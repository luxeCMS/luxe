import type http from "node:http";
import type { AddressInfo } from "node:net";
import type * as vite from "vite";
import { z } from "zod";
import {
  type LuxeError,
  LuxeErrors,
  type luxeQuery,
} from "../../../core/index.js";
import { loggerSchema } from "../logger/index.js";

export const baseModuleSchema = z.object({
  name: z
    .string()
    .min(1)
    .catch(() => {
      throw LuxeErrors.Config.MissingRequiredProperty("module", "name")();
    }),
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
        injectRoute: z.function().args(z.any()).returns(z.void()),
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
        query: z.custom<typeof luxeQuery>(),
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
