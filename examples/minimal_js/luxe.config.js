import { defineConfig } from "luxecms";

export default defineConfig({
  postgresUrl: process.env.POSTGRES_URL,
  modules: [],
  plugins: [],
});
