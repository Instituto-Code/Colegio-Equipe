import dotenv from 'dotenv';
dotenv.config();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;

export default {
  port: Number(process.env.PORT) || 8080,
  dbUri:
    process.env.MONGODB_URI ||
    `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/`,
  env: process.env.NODE_ENV || 'development',
};
