import type { AstroUserConfig } from "astro";
import type postgres from "postgres";
import { z } from "zod";
import { LuxeErrors } from "../../../core/index.js";
import { moduleSchema } from "../module/index.js";

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
});

export const configSchema = baseConfigSchema.extend({
  modules: z.array(moduleSchema),
});
