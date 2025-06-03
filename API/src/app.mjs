// Importando módulos
import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

//Config. dependências
const app = express();
app.use(cors());
dotenv.config();

// Configuração de banco de dados
import connectToDatabase from "./settings/database/dbConnection.mjs";
connectToDatabase(app);

// Emular __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a pasta onde está os arquivos .html
const publicPath = path.join(__dirname, '../public');

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(publicPath));

//Config. dados json e formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

//Rota
import router from "./routes/Router.mjs";
app.use(router);

//Conectando ao servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Conectado ao servidor na porta", PORT);
});
