#!/usr/bin/env node
export default async function run() {
	const [cmd, ...args] = process.argv.slice(2);
	switch (cmd) {
		case "dev":
		case "build": {
			const { default: build } = await import("./cmd/build.js");
			await build(...args, cmd === "dev" ? "IS_DEV" : undefined);
			break;
		}
		default: {
			console.warn(
				"\n\n\n\n\n\n\npovertyCMS was real\n\n\n\n\n\n\nbtw, that's not a real command :)\n",
			);
			process.exit(1);
		}
	}
}

run();
