import { IUser } from "../../../shared/types/user.type.js";
import { TeacherRepository } from "../teacher.repository.js";


export async function ListClasses(user: IUser){

    const teacher = await TeacherRepository.findByUser(user._id as unknown as string) ;

    if(!teacher) throw new Error("Professor não encontrado.");

    const turmasFormated = teacher.turmas.map((t: any) => ({
        nome: t.name,
        turno: t.turno,
        anoLetivo: t.anoLetivo
    }))

    return turmasFormated
}