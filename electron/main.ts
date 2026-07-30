import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { exec } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess: ReturnType<typeof exec> | null = null;

function resolveServerPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "server.js");
  }
  return path.resolve(__dirname, "../server.js");
}

function startNodeServerSudo(onSuccess: () => void, onError: () => void) {
  const serverPath = resolveServerPath();
  const startupToken = `mopass-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const nodeBinary = process.execPath;

  const command = `pkexec sh -c "fuser -k 3001/tcp || true; env MOPASS_STARTUP_TOKEN=\\"${startupToken}\\" ELECTRON_RUN_AS_NODE=1 \\"${nodeBinary}\\" \\"${serverPath}\\""`;

  serverProcess = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Erreur serveur root:", error, stderr);
      onError();
    }
  });

  let isStarted = false;

  const pollInterval = setInterval(async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:3001/api/health?token=${encodeURIComponent(startupToken)}`,
      );
      if (res.ok) {
        isStarted = true;
        clearInterval(pollInterval);
        onSuccess();
      }
    } catch {}
  }, 250);

  if (serverProcess) {
    serverProcess.on("exit", (code) => {
      if (!isStarted) {
        clearInterval(pollInterval);
        console.error("Le serveur root s'est arrêté avec le code:", code);
        onError();
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

  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.resolve(__dirname, "../dist/index.html");
    win.loadURL(pathToFileURL(indexPath).href);
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
    } catch {}
    serverProcess = null;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
