import User from "../models/User.mjs";
import Disciplina from "../models/Disciplina.mjs";
import Professor from "../models/Professor.mjs";
import Turma from "../models/Turma.mjs";
import Aluno from "../models/Aluno.mjs";


//CADASTRO DE PROFESSORES, ALUNOS, TURMAS E DISCIPLINAS ()

//Cadastrar as turmas
export const registerClasses = async (req, res) => {
    const {
        nome,
        turno,
        anoLetivo,

    } = req.body;

    try {

        //Filtrando turma por nome
        const turma = await Turma.findOne({ nome });

        //Validações
        if (turma) {
            return res.status(422).json({ errors: ["Já existe uma turma com esse nome!"] });
        }

        //Criando a turma
        const newTurma = await Turma.create({
            nome,
            turno,
            anoLetivo,

        });

        res.status(201).json({
            msg: "Turma criada com sucesso!",
            turma: newTurma
        });

    }
    catch (error) {
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error)
    }
}


//Cadastrando alunos
export const registerStudent = async (req, res) => {
    const {
        nome,
        matricula,
        dataNasc,

    } = req.body;

    try {

        const aluno = await Aluno.findOne({ matricula });

        //Validações
        if (aluno) {
            return res.status(422).json({ errors: ["Estudante já matriculado!"] });
        }

        //Criando novo estudante
        const newAluno = await Aluno.create({
            nome,
            matricula,
            dataNasc,

        });

        res.status(201).json({ 
            msg: "Aluno matriculado com sucesso!",
            aluno: newAluno
        });

    }
    catch (error) {
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error)
    }
}


//Cadastrar os professores
export const registerTeacher = async (req, res) => {
    const {
        user,
        matricula,
        formacaoAcademica,

    } = req.body;

    try {

        //Buscando professor pela matrícula
        const professor = await Professor.findOne({ matricula });

        //Validando se o professor já foi cadastrado
        if (professor) {
            return res.status(422).json({ errors: ["Professor existente!"] });
        }

        //Criando professor no banco de dados
        const newProfessor = await Professor.create({
            user,
            matricula,
            nome: user.nome,
            formacaoAcademica,
        });

        res.status(201).json({
            msg: "Professor cadastrado com sucesso!",
            professor: newProfessor
        })

    }
    catch (error) {
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}

//Cadastrar disciplinas
export const registerDisciplines = async (req, res) => {
    const { 
        nome, 
        descrição, 
        cargaHoraria, 
    } = req.body;

    try {

        //Buscar disciplina por nome
        const disciplina = await Disciplina.findOne({ nome });


        //Não permite salvar duas disciplinas com o mesmo nome
        if (disciplina) {
            return res.status(404).json({ errors: ["Disciplina já existe!"] });
        }

        //Salvando disciplina
        const newDiscipline = await Disciplina.create({
            nome,
            descrição,
            cargaHoraria,
        });

        res.status(201).json({
            msg: "Disciplina cadastrada com sucesso!",
            disciplina: newDiscipline
        });

    }
    catch (error) {
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}

//PREPARANDO OS RELACIONAMENTOS (CADASTROS ENTRE OS ESQUEMAS)

//Atribuindo turma a um professor

export const classToTeacher = async (req, res) => {
    const { teacherId, classId } = req.body;

    try{
        
        //Buscando e validando turma
        const classroom = await Turma.findById(classId);

        if(!classroom){
            return res.status(404).json({ errors: ["Turma não encontrada!"] });
        } 

        //Buscando e validando Professor
        const teacher = await Professor.findById(teacherId);

        if(!teacher){
            return res.status(404).json({ errors: ["Professor não encontrado"] });
        }

        //Verificando se o professor já está na turma
        const isInClassroom = classroom.professores.includes(teacherId);

        if(isInClassroom){
            return res.status(422).json({ errors: ["O professor já está na turma!"] });
        }

        //Salvando professor na turma caso não esteja e inserindo id da turma no esquema do professor
        classroom.professores.push(teacherId);

        //Salvando turma
        await classroom.save();

        //Inserindo turma no esquema de professor
        teacher.Turmas.push(classId);

        //Salvando professor
        await teacher.save();

        res.status(201).json({
            msg: "Turma atribuída ao professor com sucesso!"
        });

    }
    catch(error){
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}

//Adicionando disciplinas ao professor

export const disciplineToTeacher = async (req, res) => {
    const { disciplineId, teacherId } = req.body;

    try{

        //Buscando disciplina
        const discipline = await Disciplina.findById(disciplineId);

        if(!discipline){
            return res.status(404).json({ errors: ["Disciplina não encontrada!"] });
        }

        //Buscando professor
        const teacher = await Professor.findById(teacherId);

        if(!teacher){
            return res.status(404).json({ errors: ["Professor não encontrado!"] });
        }

        //Validando se o professor já está registrado na disciplina
        if(discipline.professores.includes(teacherId)){
            return res.status(422).json({ errors: ["O professor já está registrado na disciplina!"] });
        }

        //Salvando professor na disciplina
        discipline.professores.push(teacherId);

        await discipline.save();

        //Salvando disciplina no esquema do professor
        teacher.disciplinas.push(disciplineId);

        await teacher.save();

        res.status(201).json({
            msg: "Disciplina atribuída ao professor com sucesso!"
        })

    }
    catch(error){
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}

//Adicionando disciplina a turma

export const disciplineToClass = async (req, res) => {
    const { disciplineId, classId } = req.body;

    try{

        //Buscando disciplina
        const discipline = await Disciplina.findById(disciplineId);

        if(!discipline){
            return res.status(404).json({ errors: ["Disciplina não encontrada!"] });
        }

        //Buscando Turma
        const classroom = await Turma.findById(classId);

        if(!classroom){
            return res.status(404).json({ errors: ["Turma não encontrada!"] });
        }

        //Verificando se disciplina não já está em turma
        if(classroom.disciplinas.includes(disciplineId)){
            return res.status(404).json({ errors: ["A disciplina já está registrada na turma!"] });
        }

        classroom.disciplinas.push(disciplineId);

        await classroom.save();

        res.status(201).json({
            msg: "Disciplina registrada à turma com sucesso!"
        })
    }
    catch(error){
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}

//Adicionando aluno á turma

export const studentToClass = async (req, res) => {
    const { studentId, classId } = req.body;

    try{

        //Buscando aluno
        const student = await Aluno.findById(studentId);

        if(!student){
            return res.status(404).json({ errors: ["Aluno(a) não encontrado(a)!"] });
        }

        //Buscando turma
        const classroom = await Turma.findById(classId);

        if(!classroom){
            return res.status(404).json({ errors: ["Turma não encontrada!"] });
        }

        //Verificando se aluno não já está na turma
        if(classroom.alunos.includes(studentId)){
            return res.status(442).json({ errors: ["Aluno(a) já está na turma!"] });
        }

        //Salvando 
        classroom.alunos.push(studentId);

        await classroom.save();

        student.turma = classId;

        await student.save();

        res.status(201).json({
            msg: "Aluno salvo na turma!"
        })

    }
    catch(error){
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}


