const path = require('path');

const { Pool } = require('pg');

const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

const pool = new Pool({
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

module.exports = pool;