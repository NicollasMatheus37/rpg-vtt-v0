import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as fs from "fs";

function createWindow() {
  const window = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const rendererPath = path.join(__dirname, "renderer", "index.html");
  const hasBuiltFiles = fs.existsSync(rendererPath);

  // Handle load failures
  window.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    if (errorCode === -106 || errorCode === -105) {
      // ERR_CONNECTION_REFUSED or ERR_NAME_NOT_RESOLVED
      console.error("Failed to load:", errorDescription);
      window.webContents.executeJavaScript(`
        document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif; text-align: center;">
          <h1>⚠️ Connection Error</h1>
          <p>Could not connect to Vite dev server at http://localhost:5173</p>
          <p><strong>For development:</strong> Run <code>npm run dev</code></p>
          <p><strong>For production:</strong> Run <code>npm run build</code> first, then <code>npm run start</code></p>
        </div>';
      `);
    }
  });

  if (hasBuiltFiles) {
    // Use built files (production or after build)
    window.loadFile(rendererPath);
  } else if (!app.isPackaged) {
    // Development mode: try to load from Vite dev server
    window.loadURL("http://localhost:5173");
  } else {
    // Packaged app: should have built files
    window.loadFile(rendererPath);
  }
}

// listeners
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
