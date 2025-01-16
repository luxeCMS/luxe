import type { Module } from "../../core/config/types/config.js";
import { defineModule, defineModel, field } from "../../core/index.js";
import type { DocumentModuleProps } from "./types/index.js";

/**
 * The core DocumentModule. This module is responsible for managing
 * data and their schemas within the Luxe application.
 * @returns the core DocumentModule
 */
export const DocumentModule = ({ schemas }: DocumentModuleProps): Module => {
  return defineModule("document", () => ({
    models: [
      defineModel("documents", {
        id: field.uuid().primaryKey(),
        schema_id: field.varchar(255),
        slug: field.varchar(255),
        created_at: field.timestamp(),
        updated_at: field.timestamp(),
        is_published: field.boolean(),
      }),
      defineModel("document_versions", {
        id: field.uuid().primaryKey(),
        document_id: field.uuid().foreignKey("documents", "id"),
        version_number: field.integer(),
        data: field.jsonb(),
        created_at: field.timestamp(),
        updated_at: field.timestamp(),
      }),
      defineModel("document_references", {
        id: field.uuid().primaryKey(),
        document_id: field.uuid().foreignKey("documents", "id"),
        reference_id: field.uuid().foreignKey("documents", "id"),
        field_path: field.varchar(255),
        created_at: field.timestamp(),
        updated_at: field.timestamp(),
      }),
    ],
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
  }));
};
