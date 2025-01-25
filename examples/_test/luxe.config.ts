import { defineConfig } from "@luxecms/core";
// import { DocumentModule } from "@luxecms/core/modules";

export default defineConfig({
  postgresUrl: process.env.POSTGRES_URL ?? "",
  astro: {},
  modules: [
    // DocumentModule({
    //   schemas: {},
    // }),
  ],
});
