import { z } from "zod";
import { LuxeErrors } from "../../errors/index.js";
import { loggerSchema } from "../../logger/zod/logger-schema.js";
import type postgres from "postgres";
import type { luxeQuery } from "../../db/establish-db.js";

const baseModuleSchema = z.object({
  name: z
    .string()
    .min(1)
    .catch(() => {
      throw LuxeErrors.Config.MissingRequiredProperty("module", "name")();
    }),
});

const basePluginSchema = z.object({
  name: z
    .string()
    .min(1)
    .catch(() => {
      throw LuxeErrors.Config.MissingRequiredProperty("plugin", "name")();
    }),
});

const baseConfigSchema = z.object({
  postgresUrl: z
    .string()
    .regex(
      /(postgres(?:ql)?):\/\/(?:([^@\s]+)@)?([^\/\s]+)(?:\/(\w+))?(?:\?(.+))?/,
    )
    .catch(() => {
      throw LuxeErrors.Config.InvalidPostgresUrl();
    }),
  modules: z.array(baseModuleSchema),
  plugins: z.array(basePluginSchema).optional(),
});

export const lifecycleHooksSchema = z.object({
  "luxe:migrate:before": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:migrate:before")();
    }),

  "luxe:migrate:start": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:migrate:start")();
    }),

  "luxe:migrate:done": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:migrate:done")();
    }),

  "luxe:migrate:error": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:migrate:error")();
    }),

  "luxe:server:init": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
        config: baseConfigSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:server:init")();
    }),

  "luxe:server:before": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
        luxeQuery: z.custom<typeof luxeQuery>(),
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:server:before")();
    }),

  "luxe:server:ready": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:server:ready")();
    }),

  "luxe:server:error": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
        error: z.any(),
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:server:error")();
    }),

  "luxe:server:close": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:server:close")();
    }),
});

export const moduleSchema = baseModuleSchema.extend({
  hooks: lifecycleHooksSchema,
});

export const configSchema = baseConfigSchema.extend({
  modules: z.array(moduleSchema),
});
