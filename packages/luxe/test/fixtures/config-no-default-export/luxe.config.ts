import { defineLuxeConfig } from "../../../src/core";

const config = defineLuxeConfig({
  modules: [
    {
      name: "HelloWorldModule",
    },
  ],
  plugins: [],
});

export { config };
