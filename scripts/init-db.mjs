import { neon } from "@neondatabase/serverless";

const sql = neon("postgresql://neondb_owner:npg_s5Y0blLWCzGD@ep-twilight-mountain-aplew2dt-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    results TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`;

console.log("✅ テーブル作成完了");
