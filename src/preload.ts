import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => "pong from preload",
  saveCurrentGrid: (snapshot: unknown) => ipcRenderer.invoke("grid:saveCurrent", snapshot),
});
