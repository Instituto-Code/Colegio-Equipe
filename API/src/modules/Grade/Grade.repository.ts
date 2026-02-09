import { INota } from "../../shared/types/student.type.js";
import GradeModel from "./Grade.model.js";

export const GradeRepository = {
    async create(data: any){
        return await GradeModel.create(data);
    }
}