import exporess from "express";
const paisRouter = exporess.Router();

//Rotas
import { 
    listChildrens,
    listFrequency
} from "../controllers/PaisController.mjs";

//Middlewares
import { authGuard } from "../middlewares/authGuard.mjs";
import { authorizeRole } from "../middlewares/authorizeRole.mjs";

//config. rotas
paisRouter.get('/list-childrens', authGuard, listChildrens);
paisRouter.get('/list-frequency', authGuard, listFrequency);


export default paisRouter;