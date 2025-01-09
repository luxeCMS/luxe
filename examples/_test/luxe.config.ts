import { defineConfig } from "@luxecms/core";

export default defineConfig({
  postgresUrl: process.env.POSTGRES_URL ?? "",
  // astro: {},
  modules: [],
});
