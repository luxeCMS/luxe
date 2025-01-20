export type DocumentModuleSchemaItem = {
  name: string;
  type: string;
};

export type DocumentModuleSchema = Record<string, DocumentModuleSchemaItem>;

export type DocumentModuleProps = {
  schemas: DocumentModuleSchema;
};

export * from "./schemas.js";
