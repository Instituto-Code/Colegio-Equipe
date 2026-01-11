import { SchoolClassRepository } from "../../schoolClass/schoolClass.repository.js";
import { StudentRepository } from "../../Student/student.repository.js";
import { UserRepository } from "../../User/user.repository.js";

type DataRequestRegister = {
    nome: string,
    turno: string,
    anoLetivo: number
}

//Criando turmas
export async function RegisterClassesService(data: DataRequestRegister) {
    //Filtrando turma por nome
    const turma = await SchoolClassRepository.findByName(data.nome);

    //Validações
    if (turma) throw new Error("Já existe uma turma com esse nome!");

    const dataCreate = {
        nome: data.nome,
        turno: data.turno,
        anoLetivo: data.anoLetivo
    }

    //Criando a turma
    const newClass = await SchoolClassRepository.create(dataCreate);

    return {
        msg: "Turma criada com sucesso.",
        newClass
    }
}

type DataRequestStudent = {
    nome: string,
    matricula: string,
    dataNasc: Date,
    sexo: string,
    cpf: string
}

// Cadastrar alunos
export async function RegisterStudentService(data: DataRequestStudent) {
    const aluno = await StudentRepository.findOne(data.matricula);

    //Validações
    if (aluno) throw new Error("Estudante já matriculado!");

    const dataRequest = {
        nome: data.nome,
        matricula: data.matricula,
        dataNasc: data.dataNasc,
        sexo: data.sexo,
        cpf: data.cpf
    }

    //Criando novo estudante
    const newStudent = await StudentRepository.create(dataRequest);

    return {
        msg: "Estudante matriculado com sucesso.",
        newStudent
    }
}

//Deletar usuário
export async function DeleteUserService(userId: string){
    const user = await UserRepository.findById(userId);

    if(!user) throw new Error("Usuário não encontrado.");

    if(user.role === "admin") throw new Error("Permissões insuficientes.");

    await UserRepository.deleteOne(userId);

    return {
        msg: "Usuário deletado com sucesso."
    }
}

// Remover aluno de turma
export async function RemoveStudentByClassService(studentId: string, className: string){
    const student = await StudentRepository.findById(studentId);

    if(!student) throw new Error("Aluno não encontrado.");

    const classroom = await SchoolClassRepository.findByName(className);

    if (!classroom) throw new Error("Turma não encontrada.");

    await SchoolClassRepository.removeByClass(studentId, className);

    return {
        msg: "Aluno removido com sucesso."
    }

}

export async function StudentByClassService(){
    const data = await StudentRepository.getStudentByClass();

    return data;
}

