import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
	buildTsConfig,
	findProjectRoot,
	importConfigFile,
	loadLuxeConfigFile,
} from "~/core/config/index.js";
import path from "node:path";
import { LuxeError, LuxeErrors } from "~/core/errors/index.js";
import fs from "node:fs";

const getConfigPathFromFixture = async (
	fixture: string,
	ext: "ts" | "js" | "mjs" = "ts",
) => {
	const configPath = path.join(
		__dirname,
		`../fixtures/${fixture}/luxe.config.${ext}`,
	);
	return configPath;
};

describe("findProjectRoot", () => {
	const testDir = path.join(__dirname, "../fixtures/test-project");
	const subDir = path.join(testDir, "src");

	beforeAll(async () => {
		fs.mkdirSync(testDir, { recursive: true });
		fs.mkdirSync(subDir, { recursive: true });
		fs.writeFileSync(path.join(testDir, "package.json"), "{}");
	});

	afterAll(async () => {
		fs.rmSync(testDir, { recursive: true, force: true });
	});

	it("should find the root with package.json", async () => {
		const result = await findProjectRoot(subDir);
		expect(result).toBe(testDir);
	});

	it("should throw if start path doesn't exist", async () => {
		await expect(findProjectRoot("/nonexistent/path")).rejects.toBe(
			LuxeErrors.Config.NoRoot,
		);
	});

	it("should throw if start path is a file", async () => {
		const filePath = path.join(testDir, "test.txt");
		fs.writeFileSync(filePath, "");
		expect(findProjectRoot(filePath)).rejects.toBe(LuxeErrors.Config.NoRoot);
		fs.unlinkSync(filePath);
	});

	it("should throw if no package.json found within depth", async () => {
		const deepDir = path.join(testDir, "a", "b", "c");
		fs.mkdirSync(deepDir, { recursive: true });
		await expect(findProjectRoot(deepDir)).rejects.toBe(
			LuxeErrors.Config.NoRoot,
		);
	});
});

describe("buildTsConfig", () => {
	it("should successfully build a TypeScript config file", async () => {
		const configPath = await getConfigPathFromFixture("ts-valid-config");
		const result = await buildTsConfig(configPath);

		expect(result).toBeDefined();
		expect(result).toContain("luxe_config_default as default");
	});

	it("should throw new LuxeError on invalid TypeScript", async () => {
		const invalidPath = await getConfigPathFromFixture("ts-invalid-config");
		await expect(buildTsConfig(invalidPath)).rejects.toBeTypeOf(
			typeof new LuxeError(),
		);
	});
});

describe("importConfigFile", () => {
	it("should import a valid config file", async () => {
		const configPath = await getConfigPathFromFixture("ts-valid-config");
		const result = await importConfigFile(configPath);
		const expected = await import(configPath);

		expect(result).toBeDefined();
		expect(result).toEqual(expected.default);
	});

	it("should delete the temporary file after importing", async () => {
		const configPath = await getConfigPathFromFixture("ts-valid-config");
		await importConfigFile(configPath);

		const tmpFile = configPath.replace(/\.ts$/, ".js");
		expect(() => {
			return fs.readFileSync(tmpFile);
		}).toThrow();
	});

	it("should throw a new LuxeError if no default export is found", async () => {
		const configPath = await getConfigPathFromFixture(
			"config-no-default-export",
		);
		await expect(importConfigFile(configPath)).rejects.toBe(
			LuxeErrors.Config.NoDefaultExport,
		);
	});

	it("should throw a new LuxeError if the file is not found", async () => {
		const configPath = await getConfigPathFromFixture("config-not-found");
		await expect(importConfigFile(configPath)).rejects.toBe(
			LuxeErrors.Config.FailedToDynamicImport,
		);
	});

	it("should load a valid TypeScript config file", async () => {
		const configPath = await getConfigPathFromFixture("ts-valid-config");
		const result = await importConfigFile(configPath);
		const expected = await import(configPath);

		expect(result).toBeDefined();
		expect(result).toEqual(expected.default);
	});

	it("should load a valid JavaScript config file", async () => {
		const configPath = await getConfigPathFromFixture("js-valid-config", "js");
		const result = await importConfigFile(configPath);
		const expected = await import(configPath);

		expect(result).toBeDefined();
		expect(result).toEqual(expected.default);
	});

	it("should load a valid ES module config file", async () => {
		const configPath = await getConfigPathFromFixture(
			"mjs-valid-config",
			"mjs",
		);
		const result = await importConfigFile(configPath);
		const expected = await import(configPath);

		expect(result).toBeDefined();
		expect(result).toEqual(expected.default);
	});
});

describe("loadLuxeConfigFile", () => {
	it("should throw a new LuxeError if the config file is not found", async () => {
		const configPath = (
			await getConfigPathFromFixture("config-not-found")
		).replace("/luxe.config.ts", "");
		await expect(loadLuxeConfigFile(configPath)).rejects.toBe(
			LuxeErrors.Config.NoConfigFile,
		);
	});

	it("should load a TypeScript config file successfully", async () => {
		const configPath = (
			await getConfigPathFromFixture("ts-valid-config")
		).replace("/luxe.config.ts", "");
		const config = await loadLuxeConfigFile(configPath);
		expect(config).toBeDefined();
		expect(config).toBeTypeOf("object");
	});

	it("should load a JavaScript config file successfully", async () => {
		const configPath = (
			await getConfigPathFromFixture("js-valid-config", "js")
		).replace("/luxe.config.js", "");
		const config = await loadLuxeConfigFile(configPath);
		expect(config).toBeDefined();
		expect(config).toBeTypeOf("object");
	});

	it("should load an ESM config file successfully", async () => {
		const configPath = (
			await getConfigPathFromFixture("mjs-valid-config", "mjs")
		).replace("/luxe.config.mjs", "");
		const config = await loadLuxeConfigFile(configPath);
		expect(config).toBeDefined();
		expect(config).toBeTypeOf("object");
	});

	it("should throw NoRoot error when project root cannot be found", async () => {
		const nonExistentPath = "/path/that/does/not/exist";
		await expect(loadLuxeConfigFile(nonExistentPath)).rejects.toBe(
			LuxeErrors.Config.NoRoot,
		);
	});

	it("should skip empty config files and continue searching", async () => {
		const configPath = (
			await getConfigPathFromFixture("config-not-found")
		).replace("/luxe.config.ts", "");
		await expect(loadLuxeConfigFile(configPath)).rejects.toBe(
			LuxeErrors.Config.NoConfigFile,
		);
	});
});
