import { defineConfig } from "luxecms";

export default defineConfig({
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
