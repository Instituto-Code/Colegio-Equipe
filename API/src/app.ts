// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/Router.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

export default app;
