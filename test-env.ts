// test-env.ts
import { config } from 'dotenv';

config(); // Load environment variables

console.log('Database Config:', {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});