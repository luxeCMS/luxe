import { z } from "zod";
import { LuxeErrors } from "../../errors/index.js";
import { loggerSchema } from "../../logger/zod/logger-schema.js";

export const lifecycleHooksSchema = z.object({
  "luxe:init": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:init")();
    }),

  "luxe:module:start": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:module:start")();
    }),

  "luxe:module:ready": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:module:ready")();
    }),

  "luxe:module:done": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:module:done")();
    }),

  "luxe:plugin:start": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:plugin:start")();
    }),

  "luxe:plugin:ready": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:plugin:ready")();
    }),

  "luxe:plugin:done": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:plugin:done")();
    }),

  "luxe:ready": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:ready")();
    }),

  "luxe:cleanup": z
    .function()
    .args(
      z.object({
        logger: loggerSchema,
      }),
    )
    .returns(z.void().or(z.promise(z.void())))
    .optional()
    .catch(() => {
      throw LuxeErrors.Config.InvalidHookFn("luxe:cleanup")();
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
