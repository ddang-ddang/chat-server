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

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
@WebSocketGateway(8080, {
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatsGateway {
  server: Server;

  private logger: Logger = new Logger('ChatsGateway');
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('enterRoom')
  async setInit(client: Socket, data: any) {
    this.chatsService.enterRoom(client, data);
    // TODO: 현재까지의 채팅기록을 보여준다.
    const messages = await this.chatsService.getAllMessages(client, data);
    return {
      data,
      messages,
    };
  }

  @SubscribeMessage('createRoom')
  createRoom(client: Socket, room: any) {
    return this.chatsService.createRoom(client, room);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, data: any) {
    const { message } = data;
    console.log('데이터 맞아?', data);
    await this.chatsService.sendMessage(client, data);
    client.leave(client.id);
    client.rooms.forEach((roomId) =>
      client.to(roomId).emit('getMessage', {
        id: client.id,
        nickname: client.data.nickname,
        message,
      })
    );
  }

  @SubscribeMessage('exitRoom')
  exitRoom(client: Socket, roomInfo: any) {
    const { roomId } = roomInfo;
    client.leave(roomId);
    this.chatsService.exitRoom(client, roomId);
    this.handleDisconnction(client);
  }

  // 특정 마을의 채팅방에 들어가면 실행될 함수
  @SubscribeMessage('findAllMessages')
  getAllMessages(client: Socket, room: any) {
    const { roomId } = room;
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
