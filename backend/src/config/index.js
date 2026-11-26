import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Absolute path of the backend package, so paths do not depend on the working directory. */
export const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const DEFAULT_PORT = 3333;
const DEFAULT_DB_PATH = 'data/garden-shop.sqlite';

function parsePort(value) {
  if (value === undefined || value === '') return DEFAULT_PORT;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`PORT must be an integer between 0 and 65535, got "${value}"`);
  }
  return port;
}

function parseCorsOrigin(value) {
  if (value === undefined || value.trim() === '' || value.trim() === '*') return '*';
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return origins.length === 1 ? origins[0] : origins;
}

function resolveDbPath(value) {
  const dbPath = value && value.trim() !== '' ? value.trim() : DEFAULT_DB_PATH;
  return dbPath === ':memory:' ? dbPath : path.resolve(backendDir, dbPath);
}

/** Loads backend/.env into process.env if the file exists; real environment variables win. */
export function loadEnvFile() {
  const envFile = path.join(backendDir, '.env');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
}

export function loadConfig(env = process.env) {
  return {
    port: parsePort(env.PORT),
    dbPath: resolveDbPath(env.DB_PATH),
    corsOrigin: parseCorsOrigin(env.CORS_ORIGIN),
    publicDir: path.join(backendDir, 'public'),
    seedFile: path.join(backendDir, 'data', 'catalog.json'),
  };
}
