import { app, BrowserWindow } from "electron";
import express from "express";
import * as path from "path";

function setupRender(window: BrowserWindow) {
  if (!app.isPackaged) {
    window.loadURL("http://localhost:5173");
  } else {
    window.loadFile(path.join(__dirname, "renderer", "index.html"));
  }
}

function setupApi(window: BrowserWindow) {
  const expressApp = express();
  expressApp.get("/api/ping", (req, res) => {
    res.json({ message: "pong from Express!" });
  });

  const server = expressApp.listen(3000, () => {
    console.log("Express running at http://localhost:3000");
  });

  window.loadURL("http://localhost:3000");
}

function createWindow() {
  const window = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  setupRender(window);
  setupApi(window);
}

// listeners
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
