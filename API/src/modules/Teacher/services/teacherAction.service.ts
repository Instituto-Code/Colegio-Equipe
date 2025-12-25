import { Types } from "mongoose";
import { INota } from "../../../shared/types/student.type.js";
import { DisciplineRepository } from "../../Discipline/discipline.repository.js"
import { StudentRepository } from "../../Student/student.repository.js";
import { TeacherRepository } from "../teacher.repository.js";

type RequestInsertGrade = {
    userId: string;
    disciplinaId: string,
    studentId: string,
    tipo: string,
    nota: number,
    data: Date
}

//Inserir frequencia de alunos
export async function InsertGradeService(data: RequestInsertGrade) {

    const discipline = await DisciplineRepository.findById(data.disciplinaId);

    if (!discipline) throw new Error("Disciplina não encontrada.");

    const teacher = await TeacherRepository.findByUser(data.userId);

    if (!teacher) throw new Error("Professor não encontrado.");

    const student = await StudentRepository.findById(data.studentId);

    if (!student) throw new Error("Aluno não encontrado!");


    //Verificação para evitar duplicatas em notas (tipo, disciplina e nome)
    const hasGrade = student.notas.find(
        (nota) =>
            nota.disciplina.toString() === data.disciplinaId && nota.tipo === data.tipo,
    );

    if (hasGrade) throw new Error("Tipo de nota e tipo para essa disciplina já está lançado!");

    const disciplinaObjectId = new Types.ObjectId(data.disciplinaId);

    //Criando dados da nota
    const dataGrade: INota = {
        disciplina: disciplinaObjectId,
        professor: teacher._id,
        tipo: data.tipo,
        nota: data.nota,
        data: data.data || new Date(),
    };

    //salvando nota no esquema do aluno
    student.notas.push(dataGrade);

    await student.save();

    return {
        dataGrade
    }
}

type RequestInsertAttendance = {
    userId: string,
    studentId: string,
    tipo: "presencas" | "faltas",
    data: Date
}

//Frequência do aluno
export async function InsertAttendanceService(data: RequestInsertAttendance) {

    //Validações de aluno
    const student = await StudentRepository.findById(data.studentId);

    if (!student) throw new Error("Aluno não encontrado!");

    const teacher = await TeacherRepository.findByUser(data.userId);

    if (!teacher) throw new Error("Professor não encontrado!");

    //Incrementando presenças e faltas
    if (data.tipo === 'presencas') {
        student.frequencia.presencas += 1;
    }

    if (data.tipo === 'faltas') {
        student.frequencia.faltas += 1;
    }

    student.frequencia.data = data.data;

    await student.save();

    return {
        msg: "Frequência adicionada."
    }
}

type DataNote = {
    userId: string,
    studentId: string,
    anotacao: string
}

export async function NotesService(data: DataNote) {

    const student = await StudentRepository.findById(data.studentId);

    if (!student) throw new Error("Aluno não encontrado!");

    //Criando anotação
    const teacher = await TeacherRepository.findByUser(data.userId);

    if (!teacher) throw new Error("Professor não encontrado!");

    //Criando anotação
    const newNote = {
        professor: teacher?._id,
        anotacao: data.anotacao,
    };

    student.anotacoes.push(newNote);

    await student.save();

    return {
        msg: "Anotação adicionada com sucesso",
        newNote
    }

}