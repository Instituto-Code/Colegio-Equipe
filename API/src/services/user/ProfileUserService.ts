import { CustomRequest } from "../../middlewares/authGuard.js";

export async function ProfileUserService(req: CustomRequest) {

    const { _id, name, email, role } = req.user;

    return { id: _id, name, email, role };

}