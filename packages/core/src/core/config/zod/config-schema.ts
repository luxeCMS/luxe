import type { AddressInfo } from "node:net";
import type http from "node:http";
import { z } from "zod";
import { type LuxeError, LuxeErrors } from "../../errors/index.js";
import { loggerSchema } from "../../logger/zod/logger-schema.js";
import type postgres from "postgres";
import type { luxeQuery } from "../../db/establish-db.js";
import type { AstroUserConfig } from "astro";
import type * as vite from "vite";

const baseModuleSchema = z.object({
  name: z
    .string()
    .min(1)
    .catch(() => {
      throw LuxeErrors.Config.MissingRequiredProperty("module", "name")();
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
  astro: z
    .custom<Omit<AstroUserConfig, "output" | "srcDir" | "root">>()
    .optional(),
  modules: z.array(baseModuleSchema),
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
        // This is the dev server returned by the `dev` command, copied from the `astro` package
        server: z.object({
          address: z.custom<AddressInfo>(),
          handle: z
            .function()
            .args(
              z.custom<http.IncomingMessage>(),
              z.custom<http.ServerResponse<http.IncomingMessage>>(),
            )
            .returns(z.void()),
          watcher: z.custom<vite.FSWatcher>(),
          stop: z.function().returns(z.promise(z.void())),
        }),
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
        error: z.custom<LuxeError>(),
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
