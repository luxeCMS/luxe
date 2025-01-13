import type { Module } from "../../core/config/types/config.js";
import type {
  DocumentModuleProps,
  DocumentModuleSchema,
} from "./types/index.js";

/**
 * The core DocumentModule. This module is responsible for managing
 * data and their schemas within the Luxe application.
 * @returns the core DocumentModule
 */
export const DocumentModule = ({ schemas }: DocumentModuleProps): Module => {
  return {
    name: "Core_DocumentModule",
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

      "luxe:server:init": async (ctx) => {
        ctx.logger.info("Objects module started!");
      },
      "luxe:server:before": async (ctx) => {
        ctx.logger.info("Objects module server before hook!");
      },
      "luxe:server:ready": async (ctx) => {
        ctx.logger.info("Objects module started!");
      },
      "luxe:server:close": async (ctx) => {
        ctx.logger.info("Objects module stopped!");
      },
      "luxe:server:error": async (ctx) => {
        ctx.logger.info("Objects module error!");
      },
    },
  };
};
