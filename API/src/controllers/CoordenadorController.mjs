import User from "../models/User.mjs";
import Disciplina from "../models/Disciplina.mjs";
import Professor from "../models/Professor.mjs";
import Turma from "../models/Turma.mjs";
import Aluno from "../models/Aluno.mjs";


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
            alunos: [],
            professores: [],
            disciplinas: []
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


//Cadastrando alunos em suas determinadas turmas
export const registerStudent = async (req, res) => {
    const {
        nome,
        matricula,
        dataNasc,
        turma,

    } = req.body;

    try {

        const aluno = await Aluno.findOne({ matricula });

        //Validações
        if (aluno) {
            return res.status(422).json({ errors: ["Estudante já matriculado!"] });
        }

        //Buscando turma no banco
        const turmaExistente = await Turma.findById(turma);

        //Se não existir emite o erro
        if (!turmaExistente) {
            return res.status(422).json({ errors: ["Turma não encontrada!"] });
        }

        //Validando turnos
        const turnosValidos = ["manhã", "tarde"];

        if (!turnosValidos.includes(turmaExistente.turno)) {
            return res.status(422).json({ errors: ["Turno inválido!"] });
        }

        //Criando novo estudante
        const newAluno = await Aluno.create({
            nome,
            matricula,
            dataNasc,
            turma
        });


        //Atribuindo estudante a uma turma
        await Turma.findByIdAndUpdate(turma, {
            $push: { alunos: newAluno._id }
        });

        res.status(201).json({ msg: "Aluno matriculado com sucesso!" });

    }
    catch (error) {
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
    }
}

//Cadastrar os professores nas determinadas turmas
export const registerTeacher = async (req, res) => {
    const {
        user,
        matricula,
        formacaoAcademica,
        disciplinas,
        turmas

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
            disciplinas: [],
            turmas: []
        });

        //Inserindo professor no esquema de disciplina
        if (disciplinas?.length) {
            await Disciplina.updateMany(
                { _id: { $in: disciplinas } },
                { $addToSet: { professores: newProfessor._id } }
            );
        }

        // Adiciona o professor nas turmas
    if (turmas?.length) {
      await Turma.updateMany(
        { _id: { $in: turmas } },
        { $addToSet: { professores: newProfessor._id } }
      );
    }


        res.status(201).json({
            msg: "Professor cadastrado com sucesso!",
            professor: newProfessor
        })

    }
    catch (error) {
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
    }
}