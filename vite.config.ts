import { defineConfig } from "vite";
// @ts-ignore
import react from "@vitejs/plugin-react";
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';
import path from "path";

export default defineConfig({
	root: "src/renderer",
	base: "./",
	build: {
		outDir: "../../dist/renderer",
		emptyOutDir: true,
	},
	plugins: [
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
});
