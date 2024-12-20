import { defineConfig, ObjectsModule } from "luxecms";
import { schemas } from "./objects/schema.js";

export default defineConfig({
  postgresUrl: process.env.POSTGRES_URL ?? "",
  modules: [ObjectsModule({ schemas })],
});
