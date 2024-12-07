import { defineLuxeConfig } from "../../../src/core/index.js";

const config = defineLuxeConfig({
  modules: [
    {
      name: "HelloWorldModule",
    },
  ],
  plugins: [],
});

export { config };
