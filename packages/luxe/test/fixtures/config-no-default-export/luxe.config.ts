import { defineConfig } from "../../../src/core/index.js";

const config = defineConfig({
  modules: [
    {
      name: "HelloWorldModule",
    },
  ],
  plugins: [],
});

export { config };
