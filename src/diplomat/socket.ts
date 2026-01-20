import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

enum SocketEvents {
  JOIN_ROOM = 'join-room',
  LEAVE_ROOM = 'leave-room',
  PLAY_SOUND = 'play-sound',
  USER_JOINED = 'user-joined',
  USER_LEFT = 'user-left',
  SOUND_PLAYED = 'sound-played',
  JOINED_ROOM = 'joined-room',
  LEFT_ROOM = 'left-room',
  ERROR = 'error',
}

interface Room {
  [socketId: string]: string; // socketId -> roomId
}

interface User {
  socketId: string;
  name: string;
  roomId?: string;
}

export function initializeWebSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const rooms: Room = {};
  const users: Map<string, User> = new Map(); // socketId -> User

  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on(SocketEvents.JOIN_ROOM, (data: { roomId: string; name: string }) => {
      const { roomId, name } = data;

      if (!roomId || !name) {
        socket.emit(SocketEvents.ERROR, { message: 'Room ID e nome são obrigatórios' });
        return;
      }

      // Criar/atualizar usuário
      const user = {
        socketId: socket.id,
        name: name.trim(),
        roomId: roomId,
      };
      users.set(socket.id, user);

      // Sair da sala anterior se existir
      const currentRoom = rooms[socket.id];
      if (currentRoom) {
        socket.leave(currentRoom);
        socket.to(currentRoom).emit(SocketEvents.USER_LEFT, { 
          socketId: socket.id,
          name: user.name 
        });
      }

      // Entrar na nova sala
      socket.join(roomId);
      rooms[socket.id] = roomId;
      
      console.log(`${user.name} (${socket.id}) entrou na sala: ${roomId}`);
      socket.to(roomId).emit(SocketEvents.USER_JOINED, { 
        socketId: socket.id,
        name: user.name 
      });
      socket.emit(SocketEvents.JOINED_ROOM, { roomId });
    });

    socket.on(SocketEvents.LEAVE_ROOM, (roomId: string) => {
      if (!roomId) {
        socket.emit(SocketEvents.ERROR, { message: 'Room ID é obrigatório' });
        return;
      }

      const user = users.get(socket.id);
      if (!user) {
        socket.emit(SocketEvents.ERROR, { message: 'Usuário não encontrado' });
        return;
      }

      if (rooms[socket.id] === roomId) {
        socket.leave(roomId);
        delete rooms[socket.id];
        delete user.roomId;
        
        console.log(`${user.name} (${socket.id}) saiu da sala: ${roomId}`);
        socket.to(roomId).emit(SocketEvents.USER_LEFT, { 
          socketId: socket.id,
          name: user.name 
        });
        socket.emit(SocketEvents.LEFT_ROOM, { roomId });
      }
    });

    socket.on(SocketEvents.PLAY_SOUND, (data: { soundId: string }) => {
      const { soundId } = data;

      if (!soundId) {
        socket.emit(SocketEvents.ERROR, { message: 'Sound ID é obrigatório' });
        return;
      }

      const user = users.get(socket.id);
      if (!user) {
        socket.emit(SocketEvents.ERROR, { message: 'Usuário não encontrado' });
        return;
      }

      // Pega a sala atual do cliente
      const roomId = rooms[socket.id];
      if (!roomId) {
        socket.emit(SocketEvents.ERROR, { message: 'Você não está em nenhuma sala' });
        return;
      }

      console.log(`${user.name} (${socket.id}) solicitou para tocar som ${soundId} na sala ${roomId}`);
      
      // Broadcast para todos na sala (inclusive quem solicitou)
      io.to(roomId).emit(SocketEvents.SOUND_PLAYED, {
        soundId,
        triggeredBy: socket.id,
        triggeredByName: user.name,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      const user = users.get(socket.id);
      const roomId = rooms[socket.id];
      
      if (roomId && user) {
        socket.to(roomId).emit(SocketEvents.USER_LEFT, { 
          socketId: socket.id,
          name: user.name 
        });
      }
      
      delete rooms[socket.id];
      users.delete(socket.id);
      
      console.log(`Cliente desconectado: ${socket.id}${user ? ` (${user.name})` : ''}`);
    });
  });

  return io;
}
