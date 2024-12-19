import { defineConfig } from "luxecms";

export default defineConfig({
  postgresUrl: process.env.POSTGRES_URL ?? "",
  modules: [
    {
      name: "HelloWorldModule",
      hooks: {
        "luxe:server:start": async (ctx) => {
          ctx.logger.info("Hello, world!");
        },
        "luxe:server:shutdown": async (ctx) => {
          ctx.logger.info("Goodbye, world!");
        },
      },
    },
  ],
});
