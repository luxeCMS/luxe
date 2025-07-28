import { type PgTableWithColumns, pgTable } from "drizzle-orm/pg-core";
import type { Model } from "../../../types/core/models/index.js";

export const defineModel = (modelName: string, fields: Model["fields"]) => {
  return pgTable(modelName, fields);
};
