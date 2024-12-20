export type ObjectsModuleProps = {
  schemas: ObjectsModuleSchema;
};

export type ObjectsModuleSchemaItem = {
  name: string;
  type: string;
};

export type ObjectsModuleSchema = Array<ObjectsModuleSchemaItem>;
