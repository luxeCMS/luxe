import postgres from "postgres";
import { LuxeErrors } from "../errors/index.js";

const POSTGRES_URL_PATTERN =
  /^postgres(?:ql)?:\/\/(?:([^:]*):?([^@]*)@)?([^\/:]+)(?::(\d+))?(?:\/([^?]+)?)?(?:\?(.*))?$/;

/**
 * Ensures that the database exists and can be connected to.
 * @param postgresUrl the postgres url to connect to
 * @throws if the url is invalid or fails to connect to the database
 */
export const initializeLuxeDatabase = async (postgresUrl: string) => {
  if (!postgresUrl?.trim()) {
    throw LuxeErrors.DB.InvalidConnectionStr();
  }

  const [, username, , host, port, database] =
    postgresUrl.match(POSTGRES_URL_PATTERN) ?? [];

  if (!username || !host || !port) {
    throw LuxeErrors.DB.InvalidConnectionStr();
  }
  if (!database) {
    throw LuxeErrors.DB.NoDatabase();
  }

  const defaultUrl = postgresUrl.replace(`/${database}`, "/postgres");
  let query: postgres.Sql | null = null;
  let defaultDb: postgres.Sql | null = null;

  try {
    query = postgres(postgresUrl, { connect_timeout: 5 });
    await query`SELECT 1`;
    return;
  } catch (error) {
    if (
      !(error instanceof postgres.PostgresError) ||
      !error.message.includes("does not exist")
    ) {
      throw LuxeErrors.DB.ConnectionFailed();
    }
  } finally {
    await query?.end().catch(() => {});
  }

  try {
    defaultDb = postgres(defaultUrl, { connect_timeout: 5 });
    await defaultDb`CREATE DATABASE ${defaultDb(database)}`;
    query = postgres(postgresUrl, { connect_timeout: 5 });
    await query`SELECT 1`;
  } catch (error) {
    if (!(error instanceof postgres.PostgresError)) {
      throw LuxeErrors.DB.ConnectionFailed();
    }

    if (error.message.includes("does not exist")) {
      throw LuxeErrors.DB.NoDatabase();
    }
    throw LuxeErrors.DB.ConnectionFailed();
  } finally {
    await Promise.all([
      defaultDb?.end().catch(() => {}),
      query?.end().catch(() => {}),
    ]);
  }
};
