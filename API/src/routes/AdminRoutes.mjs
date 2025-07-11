import express from "express";
const adminRouter = express.Router();

//Middlewares
import { authorizeRole } from "../middlewares/authorizeRole.mjs";
import { authGuard } from "../middlewares/authGuard.mjs";
import { modifyDataUser } from "../controllers/AdminController.mjs";

adminRouter.patch('/modify-data-user', authGuard, authorizeRole("admin"), modifyDataUser);


export default adminRouter;