export type DocumentModuleProps = {
  schemas: DocumentModuleSchema;
};

export type DocumentModuleSchemaItem = {
  name: string;
  type: string;
};

export type DocumentModuleSchema = Record<string, DocumentModuleSchemaItem>;

export * from "./schemas.js";
