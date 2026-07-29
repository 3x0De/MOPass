import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync, ChildProcess } from "node:child_process";
import sudo from "@vscode/sudo-prompt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess: ChildProcess | null = null;

function startNodeServerSudo(onSuccess: () => void, onError: () => void) {
  const serverPath = path.resolve(__dirname, "../server.js");

  let nodePath = "node";
  try {
    nodePath = execSync("which node", { encoding: "utf8" }).trim();
  } catch {
    nodePath = process.argv[0];
  }

  // On demande sudo, on tue le port 3001 si nécessaire, puis on démarre le serveur Node
  const command = `cd "${path.dirname(serverPath)}" && fuser -k 3001/tcp || true && ELECTRON_RUN_AS_NODE=1 "${nodePath}" "${serverPath}"`;
  const options = { name: "MOPass" };

  let isStarted = false;

  serverProcess = sudo.exec(command, options, (error) => {
    if (error && !isStarted) {
      console.error("Authentification annulée ou refusée.");
      onError();
    }
  });

  const pollInterval = setInterval(async () => {
    try {
      const res = await fetch("http://localhost:3001/api/save-csv", {
        method: "HEAD",
      }).catch(() => null);
      if (res && !isStarted) {
        isStarted = true;
        clearInterval(pollInterval);
        onSuccess();
      }
    } catch {}
  }, 250);

  setTimeout(() => {
    if (!isStarted) {
      clearInterval(pollInterval);
      console.error("Le serveur n'a pas démarré dans les 30 secondes.");
    }
  }, 30000);
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
    serverProcess.kill();
  }
  try {
    execSync("sudo fuser -k 3001/tcp || true");
  } catch {}
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
