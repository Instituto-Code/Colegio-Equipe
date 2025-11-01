import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Logger from '../../config/logger.js';
let io: SocketIOServer;

//Mapeando usuários conectados
const connectedUsers = new Map<string, string>();

//Iniciando o socket
export const initSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: { origin: '*' },
  });

  //Configuração do socket
  io.on('connection', (socket) => {
    let { userId, grupos } = socket.handshake.query as any;
    console.log(`Novo cliente conectado: ${socket.id} - grupo=${grupos}`);

    //Colocando usuário no mapeamento
    if (userId) {
      connectedUsers.set(userId, socket.id);
    }

    if(typeof grupos === "string"){
        grupos = [grupos];
    }

    if (Array.isArray(grupos)) {
      grupos.forEach((grp: string) => {
        socket.join(grp);
        console.log(`Usuário ${userId} entrou na sala: ${grp}`);
      });
    }

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
      if (userId) connectedUsers.delete(userId);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    Logger.error("Socket.io não inicializado ainda!")
    throw new Error('Socket.io não inicializado ainda!');
  }
  return io;
};

export const getConnectedUsers = () => connectedUsers;
