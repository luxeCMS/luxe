import { z } from "zod";
import { LuxeErrors } from "../../errors/index.js";

export const moduleSchema = z.object({
  name: z
    .string()
    .min(1)
    .catch(() => {
      throw LuxeErrors.Config.MissingRequiredProperty("module", "name")();
    }),
});

export const pluginSchema = z.object({
  name: z
    .string()
    .min(1)
    .catch(() => {
      throw LuxeErrors.Config.MissingRequiredProperty("plugin", "name")();
    }),
});

export const configSchema = z
  .object({
    postgresUrl: z
      .string()
      .regex(
        /(postgres(?:ql)?):\/\/(?:([^@\s]+)@)?([^\/\s]+)(?:\/(\w+))?(?:\?(.+))?/,
      )
      .catch(() => {
        throw LuxeErrors.Config.InvalidPostgresUrl();
      }),
    modules: z.array(moduleSchema).catch(() => {
      throw LuxeErrors.Config.PropertyNotArray("modules")();
    }),
    plugins: z
      .array(pluginSchema)
      .optional()
      .catch(() => {
        throw LuxeErrors.Config.PropertyNotArray("plugins")();
      }),
  })
  .nullable()
  .catch(() => {
    throw LuxeErrors.Config.Empty();
  });
