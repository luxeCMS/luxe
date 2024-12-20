import type { Module } from "../types/index.js";
import type { ObjectsModuleProps, ObjectsModuleSchema } from "./types/index.js";

/**
 * The core ObjectsModule. This module is responsible for managing objects
 * types within the Luxe application.
 * @returns the core ObjectsModule
 */
export const ObjectsModule = ({ schemas }: ObjectsModuleProps): Module => {
  return {
    name: "Core_ObjectsModule",
    hooks: {
      "luxe:migrate:before": async (ctx) => {
        ctx.logger.info("Objects module migrate before hook!");
      },
      "luxe:migrate:start": async (ctx) => {
        ctx.logger.info("Objects module migrate start hook!");
      },
      "luxe:migrate:done": async (ctx) => {
        ctx.logger.info("Objects module migrate done hook!");
      },
      "luxe:migrate:error": async (ctx) => {
        ctx.logger.info("Objects module migrate error hook!");
      },

      "luxe:server:start": async (ctx) => {
        ctx.logger.info("Objects module started!");
      },
      "luxe:server:shutdown": async (ctx) => {
        ctx.logger.info("Objects module stopped!");
      },
    },
  };
};
