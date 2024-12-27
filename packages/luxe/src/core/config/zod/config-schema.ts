import { z } from "zod";
import { LuxeErrors } from "../../errors/index.js";
import { loggerSchema } from "../../logger/zod/logger-schema.js";

const moduleSchema = z.object({
  name: z
    .string()
    .min(1)
    .catch(() => {
      throw LuxeErrors.Config.MissingRequiredProperty("module", "name")();
    }),
});

const pluginSchema = z.object({
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
  modules: z.array(moduleSchema),
  plugins: z.array(pluginSchema).optional(),
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

export const configSchema = baseConfigSchema.extend({
  modules: z.array(moduleSchema.extend({ hooks: lifecycleHooksSchema })),
  plugins: z
    .array(pluginSchema.extend({ hooks: lifecycleHooksSchema }))
    .optional(),
});
