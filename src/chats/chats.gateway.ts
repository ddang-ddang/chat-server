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
    const { userId, nickname, roomId, message, roomName } = data;
    const filterMsg = message.trim();
    if (message === '' || filterMsg === '') {
      return;
    }
    const inRoom = await this.chatsService.userInRoom(client, roomName);
    if (!inRoom) {
      // client id 가 chatRooms 안의 socketId 배열 안에 없다면 return
      return {
        error: '연결되지 않은 사용자입니다.',
      };
    }
    await this.chatsService.sendMessage(client, data);
    client.leave(client.id);
    client.rooms.forEach((roomName) =>
      client.to(roomName).emit('getMessage', {
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
    const { roomName } = room;
    client.leave(roomName);
    this.chatsService.exitRoom(client, roomName);
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
