import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/chat.dto';

// @WebSocketGateway(8080, {
//   cors: {
//     origin: 'http://localhost:3000',
//   },
// })
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway {
  server: Server;

  private logger: Logger = new Logger('ChatsGateway');
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('createRoom')
  createRoom(client: Socket, room: any) {
    return this.chatsService.createRoom(client, room);
  }

  @SubscribeMessage('enterRoom')
  async enterRoom(client: Socket, roomId: string) {
    if (client.rooms.has(roomId)) {
      return;
    }
    this.chatsService.enterRoom(client, roomId);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, message: string) {
    this.chatsService.sendMessage(client, message);
    client.rooms.forEach((roomId) =>
      client.to(roomId).emit('getMessage', {
        id: client.id,
        nickname: client.data.nickname,
        message,
      }),
    );
  }

  // 특정 마을의 채팅방에 들어가면 실행될 함수
  @SubscribeMessage('findAllChats')
  getAllMessages(client: Socket, roomId: any) {
    return this.chatsService.getAllMessages(client, roomId);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.verbose(`Client connected id ${client.id}`);
  }

  handleDisconnction(client: Socket) {
    this.logger.log(`Client disconnected id ${client.id}`);
  }
}
