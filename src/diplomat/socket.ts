// import { Server as SocketIOServer } from 'socket.io';
// import { Server as HTTPServer } from 'http';
// import { dbGet, dbAll, dbRun } from '../database/db.js';

// export function initializeWebSocket(httpServer: HTTPServer) {
//   const io = new SocketIOServer(httpServer, {
//     cors: {
//       origin: '*', // Configure conforme necessário para produção
//       methods: ['GET', 'POST'],
//     },
//   });

//   io.on('connection', (socket) => {
//     console.log(`Cliente conectado: ${socket.id}`);

//     // Exemplo: Receber mensagem do cliente
//     socket.on('message', async (data) => {
//       console.log('Mensagem recebida:', data);
      
//       // Processar mensagem (exemplo: salvar no banco)
//       try {
//         // Exemplo de uso do banco de dados
//         // await dbRun('INSERT INTO messages (content, user_id) VALUES (?, ?)', [data.content, data.userId]);
        
//         // Enviar resposta para o cliente
//         socket.emit('messageResponse', {
//           success: true,
//           message: 'Mensagem recebida com sucesso',
//           data,
//         });

//         // Broadcast para outros clientes
//         socket.broadcast.emit('newMessage', data);
//       } catch (error) {
//         console.error('Erro ao processar mensagem:', error);
//         socket.emit('messageResponse', {
//           success: false,
//           error: 'Erro ao processar mensagem',
//         });
//       }
//     });

//     // Exemplo: Evento de desconexão
//     socket.on('disconnect', () => {
//       console.log(`Cliente desconectado: ${socket.id}`);
//     });

//     // Exemplo: Evento customizado
//     socket.on('joinRoom', (room: string) => {
//       socket.join(room);
//       console.log(`Cliente ${socket.id} entrou na sala: ${room}`);
//       socket.to(room).emit('userJoined', { socketId: socket.id });
//     });

//     socket.on('leaveRoom', (room: string) => {
//       socket.leave(room);
//       console.log(`Cliente ${socket.id} saiu da sala: ${room}`);
//       socket.to(room).emit('userLeft', { socketId: socket.id });
//     });

//     // Exemplo: Enviar dados do banco via WebSocket
//     socket.on('getUsers', async () => {
//       try {
//         const users = await dbAll('SELECT * FROM users');
//         socket.emit('usersList', users);
//       } catch (error) {
//         console.error('Erro ao buscar usuários:', error);
//         socket.emit('error', { message: 'Erro ao buscar usuários' });
//       }
//     });
//   });

//   return io;
// }
