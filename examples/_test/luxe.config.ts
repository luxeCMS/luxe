import { defineConfig } from "luxecms";

export default defineConfig({
  postgresUrl: process.env.POSTGRES_URL ?? "",
  modules: [
    {
      name: "HelloWorldModule",
      hooks: {
        "luxe:init": async (ctx) => {
          ctx.logger.info("Hello, world!");
        },
      },
    },
  ],
});
