import Aluno from '../../models/Aluno.js';
import Professor from '../../models/Professor.js';
import Turma from '../../models/Turma.js';
import Disciplina from '../../models/Disciplina.js';
import { Request, Response } from 'express';
import { CustomRequest } from '../../middlewares/authGuard.js';
import User from '../../models/User.js';

//Contando documentos
export const getDashboardOverview = async (req: Request, res: Response) => {
  try {

    const [totalAlunos, totalProfessores, totalTurmas, totalDisciplinas] =
      await Promise.all([
        Aluno.countDocuments(),
        Professor.countDocuments(),
        Turma.countDocuments(),
        Disciplina.countDocuments(),
      ]);

      //Retornando quantidade de dados
      res.status(200).json({
        totalAlunos,
        totalProfessores,
        totalTurmas,
        totalDisciplinas
      })

  } 
  catch (error: any) {
    res.status(500).json({
        error: "Erro interno do servidor"
    });
  };
};

//Listando todos os usuários
export const listUsers = async (req: CustomRequest, res: Response) => {
    try{

        //Configurando paginação
        const { search = "", page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const usersQuery = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        const allUsers = await User.find(usersQuery)
            .skip(skip)
            .limit(Number(limit))

        const totalUsers = await User.countDocuments(usersQuery);

        if(allUsers.length === 0){
            return res.status(200).json({
                users: [],
                msg: "Nenhum usuário cadastrado."
            });
        };

        const usersFormated = allUsers.map(u => ({
            id: u._id,
            nome: u.name,
            email: u.email,
            role: u.role,
            active: u.active
        }));

        return res.status(200).json({
            total: totalUsers,
            page: Number(page),
            limit: Number(limit),
            users: usersFormated,
        });

    }
    catch(error: any){
        res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
}

//Listando alunos
export const listStudents = async (req: CustomRequest, res: Response) => {
    try{    

        //Buscando alunos e populando dados dos parentes
        const alunos = await Aluno.find()
        .populate({
            path: "parents",
            populate: {
                path: "user",
                select: "name email"
            }

        });

        //Editando dados que vão para o frontend
        const alunosFormatados = alunos.map(aluno => ({
            id: aluno._id,
            nome: aluno.nome,
            matricula: aluno.matricula,
            dataNasc: aluno.dataNasc,
            pais: aluno.parents.map((p: any) => ({
                id: p._id,
                nome: p.user?.name,
                email: p.user?.email
            })),
        }));

        res.status(200).json(
            {alunos: alunosFormatados}
        )

    }
    catch(error: any){
        res.status(500).json({
            error: "Erro interno do servidor"
        });
    };
}

//Listando um aluno específico
export const listOneStudent = async (req: CustomRequest, res: Response) => {
    try{

        const { studentId } = req.params;

        const aluno = await Aluno.findById(studentId)
           .populate({
            path: "parents",
            populate: {
                path: "user",
                select: "name email numberTel cpf"
            }
        });

        if(!aluno){
            return res.status(404).json({
                error: "Aluno não encontrado"
            });
        };

        const alunoFormatado = {
            id: aluno._id,
            nome: aluno.nome,
            matricula: aluno.matricula,
            dataNasc: aluno.dataNasc,
            pais: aluno.parents.map((p: any) => ({
                id: p._id,
                nome: p.user?.name,
                email: p.user?.email,
                numberTel: p.user?.numberTel,
                cpf: p.user?.cpf
            })),
        };


        res.status(200).json({
            aluno: alunoFormatado
        });

    }
    catch(error: any){
        res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
}

//Listando dados de professores

export const listTeachers = async (req: CustomRequest, res: Response) => {
    try{

        const professores = await Professor.find()
            .populate("user", "nome email")
            .populate("disciplinas", "nome descrição cargaHoraria")

         const professoresFormatados = professores.map(professor => ({
            id: professor._id,
            nome: professor.nome,
            matricula: professor.matricula,
            formacaoAcademica: professor.formacaoAcademica,
            disciplinas: professor.disciplinas.map((d: any) => ({
                id: d._id,
                nome: d.nome,
                descrição: d.descrição,
                cargaHoraria: d.cargaHoraria
            })),
        }));

        res.status(200).json({
            professores: professoresFormatados
        });
        

    }
    catch(error: any){
        res.status(500).json({
            error: "Erro interno do servidor"
        });
    };
};

//Listar professor
export const listOneTeacher = async (req: CustomRequest, res: Response) => {
    try{

        const { teacherId } = req.params;

        const professor = await Professor.findById(teacherId)
            .populate("user", "nome email")
            .populate("disciplinas", "nome descrição cargaHoraria")

        if(!professor){
            return res.status(404).json({
                error: "Professor não encontrado"
            });
        };

        const teacherFormated = {
            id: professor._id,
            nome: professor.nome,
            matricula: professor.matricula,
            formacaoAcademica: professor.formacaoAcademica,
            disciplinas: professor.disciplinas.map((d: any) => ({
                id: d._id,
                nome: d.nome,
                descrição: d.descrição,
                cargaHoraria: d.cargaHoraria
            })),
        }

        res.status(200).json({
            professor: teacherFormated
        });

    }
    catch(error: any){
        res.status(500).json({
            error: "Erro interno do servidor"
        });
    };
};

