import { z } from "zod";
import { createField } from "../base-field.js";
import { varchar } from "drizzle-orm/pg-core";

export const text = createField<"text", string>(() => {
  let columnName: string;

  return () => ({
    database: {
      type: varchar(columnName, {
        length: 255,
      }),
    },

    validation: z.string().max(255),

    defineText: (options) => {
      columnName = options.name;
      return options;
    },
  });
});
