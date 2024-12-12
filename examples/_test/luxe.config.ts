import { defineConfig } from "luxecms";

export default defineConfig({
  postgresUrl: "postgres://user:password@localhost:5432/dbname",
  modules: [
    {
      name: "HelloWorldModule",
      hooks: {
        "luxe:init": async (ctx) => {
          console.log("Hello, world!");
        },
      },
    },
  ],
});
