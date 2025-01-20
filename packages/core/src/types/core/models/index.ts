import type {
  PgBooleanBuilderInitial,
  PgIntegerBuilderInitial,
  PgJsonbBuilderInitial,
  PgTimestampBuilderInitial,
  PgUUIDBuilderInitial,
  PgVarcharBuilderInitial,
} from "drizzle-orm/pg-core";

export type Model = {
  name: string;
  fields: Record<
    string,
    | PgUUIDBuilderInitial<"">
    | PgVarcharBuilderInitial<"", [string, ...string[]], number>
    | PgTimestampBuilderInitial<"">
    | PgBooleanBuilderInitial<"">
    | PgJsonbBuilderInitial<"">
    | PgIntegerBuilderInitial<"">
  >;
};
