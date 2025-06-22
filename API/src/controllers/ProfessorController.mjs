//Importando modelos necessários
import Professor from "../models/Professor.mjs";
import Aluno from "../models/Aluno.mjs";
import Turma from "../models/Turma.mjs";
import Disciplina from "../models/Disciplina.mjs";


//Funcionalidade de inserir notas
export const insertGrades = async (req, res) => {
    const {
        disciplinaId,
        studentId,
        tipo,
        nota,
        data
    } = req.body;

    try {

        //Filtrando disciplina
        const disciplina = await Disciplina.findById(disciplinaId);

        //Validando
        if (!disciplina) {
            return res.status(404).json({ errors: ["Disciplina não encontrada!"] })
        }

        //verificando se o usuário logado é um professor
        const roleAccepted = "professor";

        //Verificando se o role do usuário logado é de professor
        if (req.user.role !== roleAccepted) {
            return res.status(422).json({ errors: ["Permissões insuficientes!"] });
        }

        //pegando id de professor do usuário logado
        const professor = await Professor.findOne({ user: req.user._id }).select("_id");

        if (!professor) {
            return res.status(404).json({ errors: ["Professor não encontrado!"] });
        }

        const teacherId = professor._id;

        //Verificando se o aluno existe
        const student = await Aluno.findById(studentId);

        if (!student) {
            return res.status(404).json({ errors: ["Aluno não encontrado!"] });
        }

        //Verificação para evitar duplicatas em notas (tipo, disciplina e nome)
        const hasGrade = student.notas.find(nota =>
            nota.disciplina.toString() === disciplinaId && nota.tipo === tipo
        )

        if (hasGrade) {
            return res.status(422).json({
                errors: ["Tipo de nota e tipo para essa disciplina já está lançado!"]
            })
        }

        //Criando dados da nota
        const dataGrade = {
            disciplina: disciplinaId,
            professor: teacherId,
            tipo,
            nota,
            data: data || new Date()
        }

        //salvando nota no esquema do aluno
        student.notas.push(dataGrade);

        await student.save();

        res.status(201).json({
            msg: "Nota salva com sucesso!",
            nota: dataGrade
        })

    }
    catch (error) {
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}

//Frequencia para o aluno
export const insertAttendance = async (req, res) => {
    const {
        studentId,
        disciplinaId,
        presencas,
        faltas
    } = req.body;

    try {

        //Validações de aluno
        const student = await Aluno.findById(studentId);

        if (!student) {
            return res.status(404).json({ errors: ["Aluno não encontrado!"] });
        }

        //verificando se o usuário logado é um professor
        const roleAccepted = "professor";

        //Verificando se o role do usuário logado é de professor
        if (req.user.role !== roleAccepted) {
            return res.status(422).json({ errors: ["Permissões insuficientes!"] });
        }

        //Validações de role
        const professor = await Professor.findOne({ user: req.user._id }).select("_id");

        if (!professor) {
            return res.status(404).json({ errors: ["Professor não encontrado!"] });
        }

        //Verificando se já tem dados de frequencia
        const indexFrequency = student.frequencia.findIndex(i =>
            i.disciplina.toString() === disciplinaId
        );

        if (indexFrequency !== -1) {
            // Atualiza os valores existentes
            student.frequencia[indexFrequency].presencas = presencas;
            student.frequencia[indexFrequency].faltas = faltas;
        } else {
            // Adiciona nova frequência
            student.frequencia.push({
                disciplina: disciplinaId,
                presencas,
                faltas
            });
        }

        await student.save();

        res.status(201).json({
            msg: "Frequencia adicionada!",
        })

    }
    catch (error) {
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}

//Listagem de turmas em que o professor leciona
export const listClasses = async (req, res) => {
    try {

        //Pegando id do usuário logado
        const user = req.user

        //Validando role do usuário loado
        if(user.role !== "professor"){
            return res.status(422).json({ errors: ["Permissões insuficientes!"] });
        }

        //Buscando professor pelo id do usuário logado
        const professor = await Professor.findOne({ user: user._id }).populate("turmas");

        if(!professor){
            return res.status(404).json({
                errors: ["Professor não encontrado!"]
            });
        }

        res.status(200).json({
            classesList: professor.turmas
        })

    }
    catch (error) {
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}

//Listagem de disciplinas que o professor leciona
export const listDisciplines = async (req, res) => {
    try{

        //Buscando usuário logado
        const user = req.user


        //Verificando se é professor
        if(user.role !== "professor"){
            return res.status(422).json({ errors: ["Permissões insuficientes"] });
        }

        //Filtrando somente as disciplinas e populando os dados
        const professor = await Professor.findOne({ user: user._id })
        .select("disciplinas")
        .populate("disciplinas");

        res.status(200).json({
            listTurmas: professor.disciplinas
        })

    }
    catch(error){
        res.status(500).json({ errors: ["Erro interno do servidor!"] });
        console.log(error);
    }
}


