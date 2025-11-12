const appDiv = document.getElementById("app");
if (appDiv) {
    const msg = window.electronAPI?.ping?.() ?? "no preload found";
    const p = document.createElement("p");
    p.textContent = `Hello from renderer! preload says: ${msg}`;
    appDiv.appendChild(p);
}
