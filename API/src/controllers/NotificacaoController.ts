import Notificacoes from '../models/Notificacoes.js';
import { Response } from 'express';
import { getConnectedUsers, getIO } from '../configs/socket.js';
import { CustomRequest } from '../middlewares/authGuard.js';
import User, { IUser } from '../models/User.js';
import Logger from '../../config/logger.js';

//Função de criar notificação
export const createNote = async (req: CustomRequest, res: Response) => {
  try {
    const { conteudo, tipo, pessoa, grupo } = req.body;

    const authorId = req.user._id;

    //Validações
    if (!conteudo || !tipo) {
      return res.status(400).json({
        error: 'Campos Obrigatórios ausentes!',
      });
    }

    if (tipo === 'pessoa' && !pessoa) {
      return res.status(400).json({
        error: "Campo 'pessoa' indefinido!",
      });
    }

    if (tipo === 'grupo' && !grupo) {
      return res.status(400).json({
        error: "Campo 'grupo' indefinido!",
      });
    }

    //Criando notificações na base de dados
    const newNotification = await Notificacoes.create({
      author: authorId,
      conteudo,
      tipo,
      pessoa: tipo === 'pessoa' ? pessoa : undefined,
      grupo: tipo === 'grupo' ? grupo : undefined,
    });

    const io = getIO();
    const connectedUsers = getConnectedUsers();

    //Enviando notificação para pessoa específica
    if (tipo === 'pessoa' && pessoa) {
      const socketId = connectedUsers.get(pessoa);
      if (socketId)
        io.to(socketId).emit('new_notification', newNotification.toObject());
    }

    //Enviando para pessoa que faz parte de um grupo
    if (tipo === 'grupo' && grupo) {
      console.log(`Emitindo notificação para o grupo: ${grupo}`);
      io.to(grupo).emit('new_notification', newNotification.toObject());
    }

    res.status(201).json({
      message: 'Notificação criada com sucesso!',
      note: newNotification,
    });
  } catch (error) {
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//DEIXEI PARA PEGAR O ID PELO PARÂMETRO DA URL

//Deletando notificações
export const deleteNote = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const note = await Notificacoes.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ error: 'Notificação não encontrada!' });
    }
    res.status(200).json({ message: 'Notificação excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Editando notificações
export const updateNote = async (req: CustomRequest, res: Response) => {
  try {
    const { conteudo, tipo, pessoa, grupo } = req.body;

    const { id } = req.params;

    const note = await Notificacoes.findById(id);

    if (!note) {
      return res.status(404).json({ error: 'Notificação não encontrada!' });
    }

    //Validações de tipos
    if (tipo === 'pessoa' && !pessoa) {
      return res.status(400).json({
        error: "Campo 'pessoa' indefinido!",
      });
    }

    if (tipo === 'grupo' && !grupo) {
      return res.status(400).json({
        error: "Campo 'grupo' indefinido!",
      });
    }

    if (conteudo) note.conteudo = conteudo;

    //Validando os tipos na edição
    if (tipo) {
      note.tipo = tipo;
      if (tipo === 'pessoa') {
        note.pessoa = pessoa || note.pessoa;
        note.grupo = undefined;
      } else if (tipo === 'grupo') {
        note.grupo = grupo || note.grupo;
        note.pessoa = undefined;
      }
    } else {
      if (grupo) note.grupo = grupo;

      if (pessoa) note.pessoa = pessoa;
    }

    await note.save();

    res
      .status(200)
      .json({ message: 'Notificação atualizada com sucesso', note });
  } catch (error) {
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listando notificações por grupos
export const listNotesGroup = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;

    //Filtrando usuário logado
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
      });
    }

    //Filtrando notificações de acordo com o role do usuário

    //populate: Pega os dados referente ao author da notificação e mostra o nome
    //sort: a notificação é listada da mais recente

    const notificacoes = await Notificacoes.find({
      tipo: 'grupo',
      grupo: user.role,
    })
      .populate<{ author: IUser }>({
        path: 'author',
        select: 'nome email',
      })
      .sort({ createdAt: -1 });

    const formatedData = notificacoes.map((n) => ({
      id: n._id,
      author: {
        id: n.author._id,
        nome: n.author.name,
        email: n.author.email,
      },
      conteudo: n.conteudo,
      tipoEnvio: n.tipo,
      receptor: n.grupo,
      visto: n.visto,
    }));

    return res.status(200).json(formatedData);
  } catch (error: any) {
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//  Views nas notificações
export const viewNotes = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { noteId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado!',
      });
    }

    const note = await Notificacoes.findById(noteId);

    if (!note) {
      return res.status(404).json({
        error: 'Notificação não encontrada',
      });
    }

    //Impede várias vizualizações
    if (!note.visto.includes(userId)) {
      note.visto.push(userId);
      await note.save();
    }

    //Recuperando dados da notificação atualizada
    const updatedNote = await Notificacoes.findById(noteId)
      .populate('author', 'nome role email')
      .populate('visto', 'nome role email');

    res.status(201).json({
      message: 'Notificação marcada como vista com sucesso',
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listando notificações por IDs
export const listNotesByUser = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const notificacoes = await Notificacoes.find({ pessoa: userId })
      .populate<{ author: IUser }>({
        path: 'author',
        select: 'nome email',
      })
      .populate<{ pessoa: IUser }>('pessoa', 'name email role')
      .sort({ createdAt: -1 });

    if (notificacoes.length === 0) {
      return res.status(200).json({
        notificacoes: [],
        msg: 'Nenhuma notificação encontrada.',
      });
    }

    const formatedData = notificacoes.map((n) => ({
      id: n._id,
      author: {
        id: n.author._id,
        nome: n.author.name,
        email: n.author.email,
      },
      conteudo: n.conteudo,
      tipo: n.tipo,
      receptor: {
        id: n.pessoa._id,
        nome: n.pessoa.name,
        email: n.pessoa.email,
        role: n.pessoa.role,
      },
      visto: n.visto,
    }));

    return res.status(200).json(formatedData);
  } catch (error) {
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};

//Listar todas as notificações para o coordenador (aba enviadas)
export const listAllNotes = async (req: CustomRequest, res: Response) => {
  try {
    const notes = await Notificacoes.find()
      .populate<{ author: IUser }>('author', 'name email')
      .populate<{ pessoa: IUser }>('pessoa', 'name email role');

    const formatedData = notes.map((n) => ({
      id: n._id,
      author: n.author
        ? {
            id: n.author._id,
            nome: n.author.name,
            email: n.author.email,
          }
        : null,
      conteudo: n.conteudo,
      tipo: n.tipo,
      receptor:
        n.tipo === 'grupo'
          ? n.grupo
          : n.pessoa
          ? {
              id: n.pessoa._id,
              nome: n.pessoa.name,
              email: n.pessoa.email,
              role: n.pessoa.role,
            }
          : null,
    }));

    res.status(200).json(formatedData);
  } catch (error: any) {
    res.status(500).json({
      error: `Erro interno do servidor: ${error}`,
    });
    Logger.error(`Erro interno do servidor: ${error}`);
  }
};
