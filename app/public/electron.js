const { app, BrowserWindow, protocol } = require("electron");
const path = require("path");

const isDev = require("electron-is-dev");

let mainWindow;

require("update-electron-app")({
  repo: "Mineru98/AutoBench-Electron",
  updateInterval: "1 hour"
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: { nodeIntegration: true },
    icon: path.join(__dirname, "assets/icon-128-nocolor.png")
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
