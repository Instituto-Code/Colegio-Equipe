// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/Router.js";
import { setupSwagger } from "./swagger/swagger.js";

dotenv.config();

const app = express();

setupSwagger(app)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

export default app;
