import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.ts", "./src/luxe.ts"],
	format: ["esm", "cjs"],
	sourcemap: true,
	clean: true,
	dts: true,
});
