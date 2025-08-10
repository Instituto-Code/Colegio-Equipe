import mongoose from 'mongoose';
import config from 'config';
import Logger from './logger.js';

const dbConnection = async (): Promise<void> => {
  const dbUri = config.get<string>('dbUri');
  try {
    await mongoose.connect(dbUri);
    Logger.info('Conectado ao mongoose...');
  } catch (error: any) {
    Logger.error(error);
    process.exit(1);
  }
};

export default dbConnection;
