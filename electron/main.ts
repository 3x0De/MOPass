import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import sudo from "@vscode/sudo-prompt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ManagedServerProcess = {
  kill: () => void;
  once: (event: string, listener: (...args: unknown[]) => void) => void;
};

let serverProcess: ManagedServerProcess | null = null;

function startNodeServerSudo(onSuccess: () => void, onError: () => void) {
  const serverPath = path.resolve(__dirname, "../server.js");
  const startupToken = `mopass-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  let nodePath = "node";
  try {
    nodePath = execSync("which node", { encoding: "utf8" }).trim();
  } catch {
    nodePath = process.argv[0];
  }

  const command = `cd "${path.dirname(serverPath)}" && fuser -k 3001/tcp || true && MOPASS_STARTUP_TOKEN="${startupToken}" ELECTRON_RUN_AS_NODE=1 "${nodePath}" "${serverPath}"`;
  const options = { name: "MOPass" };

  let isStarted = false;
  let startupFinished = false;

  const finishStartup = (callback: () => void) => {
    if (startupFinished) {
      return;
    }

    startupFinished = true;
    callback();
  };

  const launchedProcess = sudo.exec(command, options, (error) => {
    if (error && !isStarted) {
      console.error("Authentification annulée ou refusée.");
      finishStartup(onError);
    }
  }) as unknown as ManagedServerProcess | undefined;

  if (launchedProcess) {
    serverProcess = launchedProcess;
  }

  const pollInterval = setInterval(async () => {
    if (isStarted || startupFinished) {
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:3001/api/health?token=${encodeURIComponent(startupToken)}`,
      );
      if (res.ok) {
        isStarted = true;
        clearInterval(pollInterval);
        clearTimeout(startupTimeout);
        finishStartup(onSuccess);
      }
    } catch {}
  }, 250);

  const startupTimeout = setTimeout(() => {
    if (!isStarted && !startupFinished) {
      clearInterval(pollInterval);
      console.error("Le serveur n'a pas démarré dans les 30 secondes.");
      finishStartup(onError);
    }
  }, 30000);

  if (serverProcess) {
    serverProcess.once("exit", (code) => {
      if (!isStarted && code !== 0 && !startupFinished) {
        clearInterval(pollInterval);
        clearTimeout(startupTimeout);
        console.error(
          `Le serveur a quitté prématurément avec le code ${code}.`,
        );
        finishStartup(onError);
      }
    });
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  startNodeServerSudo(
    () => createWindow(),
    () => app.quit(),
  );
});

app.on("will-quit", () => {
  if (serverProcess) {
    try {
      serverProcess.kill();
    } catch (err) {
      console.warn("Impossible de tuer le serveur élevé sans sudo:", err);
    }
    serverProcess = null;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
