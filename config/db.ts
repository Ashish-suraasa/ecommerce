import { Client, Pool } from "pg";
const user = process.env.USER as string;
const host = process.env.HOST as string;
const database = process.env.DATABASE as string;
const password = process.env.PASSWORD as string;
const port: number = 5432;

const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

const client = new Client({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

export { pool, client };
