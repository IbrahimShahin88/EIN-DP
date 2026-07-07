import mysql from "mysql2/promise";

let pool: mysql.Pool | undefined;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  pool ??= mysql.createPool(process.env.DATABASE_URL);
  return pool;
}

export async function query<T extends mysql.RowDataPacket[] | mysql.ResultSetHeader>(sql: string, params: any[] = []) {
  const [rows] = await getPool().execute<T>(sql, params);
  return rows;
}

export async function pingDatabase() {
  const rows = await query<mysql.RowDataPacket[]>("SELECT 1 AS ok");
  return rows[0]?.ok === 1;
}
