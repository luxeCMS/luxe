import { varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createField } from "../base-field.js";

export const text = createField<"text", string>("text", (typeName) => {
  let columnName: string;
  return () => ({
    typeName,
    database: {
      type: varchar(columnName, {
        length: 255,
      }),
    },
    component: "text",
    validation: z.string().max(255).nullable(),
    defineText: (options) => {
      columnName = options.name;
      return options;
    },
  });
});
