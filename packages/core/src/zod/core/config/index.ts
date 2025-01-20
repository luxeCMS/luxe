import { z } from "zod";
import type postgres from "postgres";
import type { AstroUserConfig } from "astro";
import { LuxeErrors } from "../../../core/index.js";
import { baseModuleSchema, moduleSchema } from "../module/index.js";

export const baseConfigSchema = z.object({
  postgresUrl: z
    .string()
    .regex(
      /(postgres(?:ql)?):\/\/(?:([^@\s]+)@)?([^\/\s]+)(?:\/(\w+))?(?:\?(.+))?/,
    )
    .catch(() => {
      throw LuxeErrors.Config.InvalidPostgresUrl();
    }),
  astro: z
    .custom<Omit<AstroUserConfig, "output" | "srcDir" | "root">>()
    .optional(),
  modules: z.array(baseModuleSchema),
});

export const configSchema = baseConfigSchema.extend({
  modules: z.array(moduleSchema),
});
