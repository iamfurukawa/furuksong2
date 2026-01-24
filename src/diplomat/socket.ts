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
  USER_STATE_CHANGED = 'user-state-changed',
}

interface Room {
  [socketId: string]: string; // socketId -> roomId
}

interface User {
  socketId: string;
  name: string;
  roomId?: string;
}

interface UsersState {
  totalUsers: number;
  totalRooms: number;
  rooms: {
    [roomId: string]: {
      users: { socketId: string; name: string }[];
      count: number;
    };
  };
  connectedUsers: { socketId: string; name: string; roomId?: string }[];
}

// Helper function para obter estado completo dos usuários
function getUserState(users: Map<string, User>): UsersState {
  const connectedUsers = Array.from(users.values());
  const roomIds = new Set(connectedUsers.map(user => user.roomId).filter(Boolean));
  
  const rooms: UsersState['rooms'] = {};
  roomIds.forEach(roomId => {
    const roomUsers = connectedUsers
      .filter(user => user.roomId === roomId)
      .map(user => ({ socketId: user.socketId, name: user.name }));
    
    rooms[roomId!] = {
      users: roomUsers,
      count: roomUsers.length
    };
  });
  
  return {
    totalUsers: connectedUsers.length,
    totalRooms: roomIds.size,
    rooms,
    connectedUsers: connectedUsers.map(user => ({
      socketId: user.socketId,
      name: user.name,
      ...(user.roomId && { roomId: user.roomId })
    }))
  };
}

// Broadcast estado completo para todos conectados
function broadcastUserState(io: SocketIOServer, users: Map<string, User>) {
  const state = getUserState(users);
  io.emit(SocketEvents.USER_STATE_CHANGED, state);
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

      if (!roomId || !name) return;

      // Verificar se já está na sala
      const currentRoom = rooms[socket.id];
      if (currentRoom === roomId) return;

      // Criar/atualizar usuário
      const user = {
        socketId: socket.id,
        name: name.trim(),
        roomId: roomId,
      };
      users.set(socket.id, user);

      // Sair da sala anterior se existir
      if (currentRoom) {
        socket.leave(currentRoom);
      }

      // Entrar na nova sala
      socket.join(roomId);
      rooms[socket.id] = roomId;
      
      console.log(`${user.name} (${socket.id}) entrou na sala: ${roomId}`);
      
      // Broadcast estado completo para todos
      broadcastUserState(io, users);
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
      console.log(`Broadcasting to room ${roomId}:`, { soundId, triggeredBy: socket.id, triggeredByName: user.name });
      io.to(roomId).emit(SocketEvents.SOUND_PLAYED, {
        soundId,
        triggeredBy: socket.id,
        triggeredByName: user.name,
        timestamp: new Date().toISOString(),
      });
      
      // Também broadcast global para todas as guias abertas
      console.log(`Broadcasting globally:`, { soundId, triggeredBy: socket.id, triggeredByName: user.name });
      io.emit(SocketEvents.SOUND_PLAYED, {
        soundId,
        triggeredBy: socket.id,
        triggeredByName: user.name,
        timestamp: new Date().toISOString(),
        roomId: roomId,
      });
    });

    socket.on('disconnect', () => {
      delete rooms[socket.id];
      users.delete(socket.id);
      
      console.log(`Cliente desconectado: ${socket.id}`);

      broadcastUserState(io, users);
    });
  });

  return io;
}
