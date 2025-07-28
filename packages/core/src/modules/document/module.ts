import { defineModel, defineModule, field } from "../../core/index.js";
import type { Module } from "../../types/index.js";
import type { DocumentModuleProps } from "../../zod/modules/documents/index.js";

const documentModel = defineModel("documents", {
  id: field.uuid().primaryKey(),
  schema_id: field.varchar(255),
  slug: field.varchar(255),
  created_at: field.timestamp(),
  updated_at: field.timestamp(),
  is_published: field.boolean(),
});

const documentVersionModel = defineModel("document_versions", {
  id: field.uuid().primaryKey(),
  document_id: field.uuid().references(() => documentModel.fields),
  version_number: field.integer(),
  data: field.jsonb(),
  created_at: field.timestamp(),
  updated_at: field.timestamp(),
});

const documentReferenceModel = defineModel("document_references", {
  id: field.uuid().primaryKey(),
  document_id: field.uuid().references(() => documentModel.id),
  reference_id: field.uuid().references(() => documentModel.id),
  field_path: field.varchar(255),
  created_at: field.timestamp(),
  updated_at: field.timestamp(),
});

/**
 * The core DocumentModule. This module is responsible for managing
 * data and their schemas within the Luxe application.
 * @returns the core DocumentModule
 */
export const DocumentModule = ({ schemas }: DocumentModuleProps): Module => {
  return defineModule("document", {
    // Models represent the database tables and the
    // fields represent the columns in the tables
    models: [documentModel, documentVersionModel, documentReferenceModel],

    hooks: {
      "luxe:migrate:before": async (ctx) => {
        ctx.logger.info("Document module migrate before hook!");
      },
      "luxe:migrate:start": async (ctx) => {
        ctx.logger.info("Document module migrate start hook!");
      },
      "luxe:migrate:done": async (ctx) => {
        ctx.logger.info("Document module migrate done hook!");
      },
      "luxe:migrate:error": async (ctx) => {
        ctx.logger.info("Document module migrate error hook!");
      },
      "luxe:server:init": async (ctx) => {
        ctx.logger.info("Document module started!");
      },
      "luxe:server:before": async (ctx) => {
        ctx.logger.info("Document module server before hook!");
      },
      "luxe:server:ready": async (ctx) => {
        ctx.logger.info("Document module started!");
      },
      "luxe:server:close": async (ctx) => {
        ctx.logger.info("Document module stopped!");
      },
      "luxe:server:error": async (ctx) => {
        ctx.logger.info("Document module error!");
      },
    },
  });
};
