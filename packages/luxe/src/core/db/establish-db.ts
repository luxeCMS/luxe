import postgres from "postgres";
import { LuxeErrors } from "../errors/index.js";

let _query: postgres.Sql;

export const establishLuxeDatabaseConnection = (postgresUrl: string) => {
  // Expect the database to already exist, but be prepared to throw an error if it doesn't
  try {
    _query = postgres(postgresUrl, { connect_timeout: 5 });
  } catch (error) {
    throw LuxeErrors.DB.ConnectionFailed();
  }
};

/**
 * Run a query against the database.
 * @param query the query to run
 * @returns the result of the query
 * @throws if the database is not connected
 */
export const luxeQuery = (
  query: TemplateStringsArray,
  ...parameters: readonly postgres.ParameterOrFragment<never>[]
) => {
  if (!_query) {
    throw LuxeErrors.DB.NoConnection();
  }
  return _query(query, ...parameters);
};
