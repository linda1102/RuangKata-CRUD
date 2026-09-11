import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from'./schema';
import dotenv from "dotenv";

dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.query("SELECT DATABASE() AS db")
  .then(([rows]) => {
    console.log("DATABASE YANG DIPAKAI:", rows);
  })
  .catch((error) => {
    console.error("DATABASE ERROR:", error);
  });

export const db = drizzle(pool, {
  schema,
  mode: "default",
});

