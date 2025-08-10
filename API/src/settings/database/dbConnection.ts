import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbConnection = async (): Promise<void> => {
  try {
    const db_uri = process.env.DB_URI;
    if (!db_uri) {
      console.error("Erro ao acessar variável de ambiente 'db_uri'.");
      return;
    }
    await mongoose.connect(db_uri);
    console.log('Conectado ao mongoose...');
  } catch (error: any) {
    console.log(error);
    process.exit(1);
  }
};

export default dbConnection;
