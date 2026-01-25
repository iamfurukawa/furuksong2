import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

function getTimestamp(): string {
  return `[${new Date().toISOString()}]`;
}

enum SocketEvents {
  JOIN_ROOM = 'join-room',
  PLAY_SOUND = 'play-sound',
  SOUND_PLAYED = 'sound-played',
  USER_STATE_CHANGED = 'user-state-changed',
}

interface Room {
  [socketId: string]: string;
}

interface User {
  socketId: string;
  name: string;
  roomId?: string;
}

interface UsersState {
  rooms: {
    [roomId: string]: {
      users: { socketId: string; name: string }[];
    };
  };
  connectedUsers: { socketId: string; name: string; roomId?: string }[];
}

function getUserState(users: Map<string, User>): UsersState {
  const connectedUsers = Array.from(users.values());
  const roomIds = new Set(connectedUsers.map(user => user.roomId).filter(Boolean));
  
  const rooms: UsersState['rooms'] = {};
  roomIds.forEach(roomId => {
    const roomUsers = connectedUsers
      .filter(user => user.roomId === roomId)
      .map(user => ({ socketId: user.socketId, name: user.name }));
    
    rooms[roomId!] = {
      users: roomUsers
    };
  });
  
  return {
    rooms,
    connectedUsers: connectedUsers.map(user => ({
      socketId: user.socketId,
      name: user.name,
      ...(user.roomId && { roomId: user.roomId })
    }))
  };
}

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
    console.log(`${getTimestamp()} Cliente conectado: ${socket.id}`);
    
    broadcastUserState(io, users);

    socket.on(SocketEvents.JOIN_ROOM, (data: { roomId: string; name: string }) => {
      const { roomId, name } = data;

      if (!roomId || !name) return;

      const currentRoom = rooms[socket.id];
      if (currentRoom === roomId) return;

      const user = {
        socketId: socket.id,
        name: name.trim(),
        roomId: roomId,
      };
      users.set(socket.id, user);

      if (currentRoom) {
        socket.leave(currentRoom);
      }

      socket.join(roomId);
      rooms[socket.id] = roomId;
      
      console.log(`${getTimestamp()} ${user.name} (${socket.id}) entrou na sala: ${roomId}`);
      
      broadcastUserState(io, users);
    });

    socket.on(SocketEvents.PLAY_SOUND, (data: { soundId: string }) => {
      const { soundId } = data;

      if (!soundId) return;

      const user = users.get(socket.id);
      if (!user) return;

      const roomId = rooms[socket.id];
      if (!roomId) return;

      console.log(`${getTimestamp()} Broadcasting to room ${roomId}:`, { soundId, triggeredBy: socket.id, triggeredByName: user.name });
      io.to(roomId).emit(SocketEvents.SOUND_PLAYED, {
        soundId,
        triggeredBy: socket.id,
        triggeredByName: user.name,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      delete rooms[socket.id];
      users.delete(socket.id);
      
      console.log(`${getTimestamp()} Cliente desconectado: ${socket.id}`);

      broadcastUserState(io, users);
    });
  });

  return io;
}
