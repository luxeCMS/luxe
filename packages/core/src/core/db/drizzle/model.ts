import { pgTable, type PgTableWithColumns } from "drizzle-orm/pg-core";
import type { Model } from "../../../types/core/models/index.js";

export const defineModel = (modelName: string, fields: Model["fields"]) => {
  return pgTable(modelName, fields);
};
