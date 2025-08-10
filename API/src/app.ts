// Importando módulos
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//Config. dependências
const app = express();
app.use(cors());
dotenv.config();

// Configuração de banco de dados
import connectToDatabase from './settings/database/dbConnection.js';

//Config. dados json e formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rota
import router from './routes/Router.js';
app.use(router);

const PORT = process.env.PORT;

//Conectando ao servidor
const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(PORT || 3000, () => {
      console.log(`Conectado ao sevidor na porta ${PORT}`);
    });
  } catch (err) {
    console.log('Erro ao se conectar ao mongoDB');
    process.exit(1);
  }
};

await startServer();
