import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();
import userRouter from "./userRoutes.mjs";

// Emular __dirname para este arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho até o index.html
const htmlPath = path.join(__dirname, '../../public/pages/setup.html');

router.get('/', (req, res) => {
  res.sendFile(htmlPath);
});

router.use('/api/users', userRouter)




export default router;
