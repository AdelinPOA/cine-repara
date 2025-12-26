import { sql } from '@vercel/postgres';

/**
 * Database client using Vercel Postgres
 *
 * Usage:
 * - Use `sql` template tag for queries: await sql`SELECT * FROM users`
 * - Automatically handles connection pooling
 * - Parameterized queries prevent SQL injection
 */

export { sql };

/**
 * Execute a database query with parameters
 *
 * @example
 * const result = await query('SELECT * FROM users WHERE email = $1', [email]);
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  const result = await sql.query(text, params);
  return {
    rows: result.rows as T[],
    rowCount: result.rowCount || 0,
  };
}

/**
 * Execute a single query and return the first row
 *
 * @example
 * const user = await queryOne('SELECT * FROM users WHERE id = $1', [userId]);
 */
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] || null;
}

/**
 * Execute multiple SQL statements in a transaction
 *
 * @example
 * await transaction(async () => {
 *   await sql`INSERT INTO users ...`;
 *   await sql`INSERT INTO installer_profiles ...`;
 * });
 */
export async function transaction<T>(
  callback: () => Promise<T>
): Promise<T> {
  try {
    await sql`BEGIN`;
    const result = await callback();
    await sql`COMMIT`;
    return result;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
}

/**
 * Check database connection
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}
