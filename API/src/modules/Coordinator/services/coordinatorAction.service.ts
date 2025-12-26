import { SchoolClassRepository } from "../../schoolClass/schoolClass.repository.js";
import { StudentRepository } from "../../Student/student.repository.js";

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


