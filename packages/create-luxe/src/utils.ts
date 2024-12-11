import pg from "pg";

export async function pingPostgres(
  connectionString: string,
  timeout = 5000,
): Promise<boolean> {
  const client = new pg.Client({
    connectionString,
    connectionTimeoutMillis: timeout,
    keepAlive: false,
  });

  try {
    await client.connect();
    await client.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("Failed to connect to PostgreSQL database.");
    return false;
  } finally {
    try {
      await client.end();
    } catch {}
  }
}
