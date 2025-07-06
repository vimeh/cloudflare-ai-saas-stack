import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "src/client/routes",
			generatedRouteTree: "src/client/routeTree.gen.ts",
		}),
		react(),
		cloudflare(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@client": path.resolve(__dirname, "./src/client"),
			"@shared": path.resolve(__dirname, "./src/shared"),
			"@worker": path.resolve(__dirname, "./src/worker"),
		},
	},
});
