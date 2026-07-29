import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, ChildProcess } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverProcess: ChildProcess | null = null;

function startNodeServer() {
  const serverPath = path.join(process.cwd(), "server.js");

  serverProcess = spawn("node", [serverPath], {
    stdio: "inherit",
  });

  serverProcess.on("error", (err) => {
    console.error("Erreur lors du démarrage de server.js :", err);
  });
}

function createWindow() {
  startNodeServer();

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

app.whenReady().then(createWindow);

app.on("will-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
