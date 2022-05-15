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
    await this.chatsService.enterRoom(client, data);
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
    console.log('후하', data);
    console.log(client.id);
    const { userId, nickname, roomId, message } = data;
    if (message === '') {
      return;
    }
    const inRoom = await this.chatsService.userInRoom(client, roomId);
    if (!inRoom) { // client id 가 chatRooms 안의 socketId 배열 안에 없다면 return
      return {
        error: '연결되지 않은 사용자입니다.',
      };
    }
    await this.chatsService.sendMessage(client, data);
    client.leave(client.id);
    client.rooms.forEach((roomId) =>
      client.to(roomId).emit('getMessage', {
        // id: client.id,
        userId,
        // nickname: client.data.nickname,
        nickname,
        roomId,
        message,
      })
    );
  }

  @SubscribeMessage('exitRoom')
  exitRoom(client: Socket, room: any) {
    console.log('여기서 exit');
    const { roomId } = room;
    client.leave(roomId);
    this.chatsService.exitRoom(client, roomId);
    this.handleDisconnction(client);
  }

  // 특정 마을의 채팅방에 들어가면 실행될 함수
  @SubscribeMessage('findAllMessages')
  async getAllMessages(client: Socket, data: any) {
    const { roomId } = data;
    const messages = await this.chatsService.getAllMessages(client, roomId);
    return {
      messages,
    };
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
