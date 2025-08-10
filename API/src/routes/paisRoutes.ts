import exporess from 'express';
const paisRouter = exporess.Router();

//Rotas
import { listChildrens } from '../controllers/PaisController.js';

//Middlewares
import { authGuard } from '../middlewares/authGuard.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

//config. rotas
paisRouter.get('/list-childrens', authGuard, listChildrens);

export default paisRouter;
