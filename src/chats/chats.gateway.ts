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
    origin: '*',
  },
})
export class ChatsGateway {
  server: Server;

  private logger: Logger = new Logger('ChatsGateway');
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('enterRoom')
  async setInit(client: Socket, data: any) {
    try {
      const { roomName } = data;
      await this.chatsService.enterRoom(client, data);
      // TODO: 현재까지의 채팅기록을 보여준다.
      const messages = await this.chatsService.getAllMessages(client, data);
      const memberCnt = await this.chatsService.cntMembers(roomName);
      return {
        data,
        messages,
        memberCnt,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  // @SubscribeMessage('createRoom')
  // createRoom(client: Socket, room: any) {
  //   return this.chatsService.createRoom(client, room);
  // }

  /* 메세지 보내기 */
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, data: any) {
    console.log(data);
    const { userId, nickname, message, roomName } = data;
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
    const newMessage = await this.chatsService.sendMessage(client, data);
    client.leave(client.id);
    const memberCnt = await this.chatsService.cntMembers(roomName);
    console.log('room name', roomName);
    client.rooms.forEach((roomName) =>
      client.to(roomName).emit('getMessage', {
        userId,
        nickname,
        roomName,
        message,
        createdAt: newMessage.createdAt,
        memberCnt,
      })
    );
  }

  /* 채팅방 나가기 */
  @SubscribeMessage('exitRoom')
  exitRoom(client: Socket, data: any) {
    const { roomName } = data;
    client.leave(roomName);
    this.chatsService.exitRoom(client, data);
    this.handleDisconnction(client);
    const memberCnt = this.chatsService.cntMembers(roomName);
    return {
      memberCnt,
    };
  }

  /* 특정 마을의 채팅방에 들어가면 실행될 함수 */
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
