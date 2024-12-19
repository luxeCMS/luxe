import { z } from "zod";
import { LuxeErrors } from "../../errors/index.js";
import { loggerSchema } from "../../logger/zod/logger-schema.js";

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

  "luxe:server:start": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:server:start")();
    }),

  "luxe:server:shutdown": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:server:shutdown")();
    }),
});

export const moduleSchema = z.object({
  name: z
    .string()
    .min(1)
    .catch(() => {
      throw LuxeErrors.Config.MissingRequiredProperty("module", "name")();
    }),
  hooks: lifecycleHooksSchema.optional(),
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
