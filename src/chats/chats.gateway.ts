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

  // @SubscribeMessage('joinRoom') // join할 경우 방이 자동 생성됨
  // async createRoom(client: Socket, data: string) {
  //   this.logger.verbose('trying to create room');
  //   console.log(data);
  //   console.log(client);
  //   client.join('aRoom'); // aRoom 에는 동이름
  //   client.to('aRoom').emit('roomCreated', { room: 'aRoom' });
  //   return { event: 'roomCreated', room: 'aRoom' };
  // }

  @SubscribeMessage('joinRoom') // join할 경우 방이 자동 생성됨
  async createRoom(client: Socket, roomId: string) {
    if (client.rooms.has(roomId)) {
      return;
    }
  }

  // @SubscribeMessage('sendMessage')
  // async createChat(
  //   @MessageBody() client: Socket,
  //   createChatDto: CreateChatDto,
  // ) {
  //   this.logger.verbose('trying to send message');
  //   const message = await this.chatsService.createChat(createChatDto);
  //   // this.server.emit('message', message);
  //   console.log(message);
  //   const roomId = 'aRoom';
  //   client.to(roomId).emit('message', message);
  //   return message;
  // }

  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, message: string) {
    console.log(client.rooms);
    console.log(message);
    client.rooms.forEach((roomId) =>
      client.to(roomId).emit('getMessage', {
        id: client.id,
        nickname: client.data.nickname,
        message,
      }),
    );
  }

  //채팅방 목록 가져오기
  // @SubscribeMessage('getChatRoomList')
  // getChatRoomList(client: Socket, payload: any) {
  //   client.emit('getChatRoomList', this.chatsService.getChatRoomList());
  // }

  @SubscribeMessage('findAllChats')
  findAll() {
    return this.chatsService.findAll();
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatsService.remove(id);
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
