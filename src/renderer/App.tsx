import React from "react";
import Map from './pages/map';

export default function App() {
	// @ts-ignore
	const msg = window.electronAPI?.ping?.() ?? "no preload bridge";
	return (
		<div style={{ padding: 24, fontFamily: "sans-serif" }}>
			<h1>⚛️ Electron + React + TypeScript</h1>
			<p>
				Hello from React! preload says: <b>{msg}</b>
			</p>
			<Map />
		</div>
	);
}
