import {
  boolean,
  integer,
  jsonb,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const field = {
  /**
   * A field that represents a postgres unique identifier (UUID).
   * @returns a uuid field for drizzle-orm
   */
  uuid: () => uuid(),

  /**
   * A field that represents a postgres varchar.
   * @param length the length of the varchar field
   * @param opts the options for the varchar field
   * @returns a varchar field for drizzle-orm
   */
  varchar: (length?: number, opts: { enum?: [string, ...string[]] } = {}) => {
    if (opts.enum) {
      return varchar({
        length: length ?? 255,
        enum: opts.enum,
      });
    }
    return varchar({ length: length ?? 255 });
  },

  /**
   * A field that represents a postgres timestamp.
   * @param opts the options for the timestamp field
   * @returns a timestamp field for drizzle-orm
   */
  timestamp: (opts?: Parameters<typeof timestamp>[1]) => {
    if (opts) {
      return timestamp({
        mode: opts.mode ?? "date",
        precision: opts.precision ?? 3,
        withTimezone: opts.withTimezone ?? false,
      });
    }
    return timestamp();
  },

  /**
   * A field that represents a postgres jsonb.
   * @returns a jsonb field for drizzle-orm
   */
  jsonb: () => jsonb(),

  /**
   * A field that represents a postgres boolean.
   * @returns a boolean field for drizzle-orm
   */
  boolean: () => boolean(),

  /**
   * A field that represents a postgres integer.
   * @returns a integer field for drizzle-orm
   */
  integer: () => integer(),
};
