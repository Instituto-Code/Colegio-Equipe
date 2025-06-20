import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();

//Rotas
import userRouter from "./userRoutes.mjs";
import coordenadorRouter from "./coordenadorRoutes.mjs";

// Emular __dirname para este arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho até o index.html
const htmlPath = path.join(__dirname, '../../public/pages/setup.html');

router.get('/', (req, res) => {
  res.sendFile(htmlPath);
});

//Config. pré-fixo de rotas
router.use('/api/users', userRouter);
router.use('/api/coordenador', coordenadorRouter);


export default router;
