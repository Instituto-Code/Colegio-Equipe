import express from "express";
import upload from "../middlewares/upload.js";
import { uploadBoletim } from "../controllers/UploadController.js";
const uploadRouter = express.Router();


uploadRouter.post('/upload/:alunoId', upload.array("documento", 10), uploadBoletim);


export default uploadRouter;