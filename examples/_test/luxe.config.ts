import { defineConfig } from "../../packages/core/dist/types/index.js";

export default defineConfig({
  postgresUrl: process.env.POSTGRES_URL ?? "",
  modules: [],
});
