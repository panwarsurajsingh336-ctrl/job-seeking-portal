import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(scriptDirectory, '../../database.sql');

// The hosted database is created by the provider. Apply only its table schema.
const schema = (await readFile(schemaPath, 'utf8'))
  .replace(/^CREATE DATABASE[^;]*;\s*/im, '')
  .replace(/^USE\s+[^;]+;\s*/im, '');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'job_portal_db',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  multipleStatements: true
});

try {
  await connection.query(schema);
  console.log('Database schema initialized successfully.');
} finally {
  await connection.end();
}
