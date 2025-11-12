import React from "react";
import Map from './pages/map';

export default function App() {
	// @ts-ignore
	const msg = window.electronAPI?.ping?.() ?? "no preload bridge";
	return (
		<div style={{ padding: 16, fontFamily: "monospace" }}>
			<Map />
		</div>
	);
}
