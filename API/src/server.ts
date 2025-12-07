import config from 'config';
import Logger from '../config/logger.js';
import dbConnection from '../config/db.js';
import app from './app.js';
import { initSocket } from './configs/socket.js';
import http from 'http';

const PORT = config.get<number>('port') || 3000;

const startServer = async () => {
  try {
    await dbConnection();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      Logger.info(`Servidor rodando na porta ${PORT}`);
    });

    // inicializa o socket no servidor http
    initSocket(server);
  } catch (err) {
    console.log('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

startServer();
