import { defineConfig } from "vite";
// @ts-ignore
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	root: "src/renderer",
	base: "./",
	build: {
		outDir: "../../dist/renderer",
		emptyOutDir: true,
	},
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
});
