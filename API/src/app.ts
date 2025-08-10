// Importando módulos
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import config from 'config';
import Logger from '../config/logger.js';

//Config. dependências
const app = express();
app.use(cors());
dotenv.config();

// Configuração de banco de dados
import dbConnection from '../config/db.js';

//Config. dados json e formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rota
import router from './routes/Router.js';
app.use(router);

const PORT = config.get<number>('port');

//Conectando ao servidor
const startServer = async () => {
  try {
    await dbConnection();

    app.listen(PORT || 3000, () => {
      Logger.info(`Conectado ao sevidor na porta ${PORT}`);
    });
  } catch (err) {
    console.log('Erro ao se conectar ao mongoDB');
    process.exit(1);
  }
};

await startServer();
