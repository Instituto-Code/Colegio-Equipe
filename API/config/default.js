import dotenv from 'dotenv';
dotenv.config();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

export default {
  port: 8080,
  dbUri: `mongodb+srv://${dbUser}:${dbPass}@colegioequipe.dop0xem.mongodb.net/`,
  env: 'development',
};
