import { pbkdf2Sync, randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import mysql from "mysql2/promise";

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const envText = readFileSync(path, "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) {
      continue;
    }

    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] ??= value;
  }
}

function hashPassword(password) {
  const iterations = 210000;
  const salt = randomBytes(16).toString("base64url");
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");

  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

loadEnvFile(".env.local");

const login = process.argv[2] ?? process.env.ADMIN_LOGIN;
const password = process.argv[3] ?? process.env.ADMIN_PASSWORD;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

if (!login || !password) {
  throw new Error('Usage: npm run seed-admin -- "admin" "strong-password"');
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
await connection.execute(
  `
    INSERT INTO users (full_name, email, password_hash, role, status)
    VALUES (?, ?, ?, 'admin', 'active')
    ON DUPLICATE KEY UPDATE
      full_name = VALUES(full_name),
      password_hash = VALUES(password_hash),
      role = 'admin',
      status = 'active'
  `,
  ["Official Admin", login.toLowerCase(), hashPassword(password)],
);

const [rows] = await connection.execute("SELECT id, email, role, status FROM users WHERE email = ? LIMIT 1", [
  login.toLowerCase(),
]);
await connection.end();

console.log(`Admin user ready: ${JSON.stringify(rows[0])}`);
