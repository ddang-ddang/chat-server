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

@WebSocketGateway()
export class ChatsGateway {
  server: Server;

  private logger: Logger = new Logger('ChatsGateway');
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('creaetRoom')
  async createRoom(socket: Socket, data: string) {
    this.logger.log(`trying to create room by client Id `);
    socket.join('aRoom');
    socket.to('aRoom').emit('roomCreated', { room: 'aRoom' });
    return { event: 'roomCreated', room: 'aRoom' };
  }

  @SubscribeMessage('createChat')
  async createChat(@MessageBody() createChatDto: CreateChatDto) {
    this.logger.log(`trying to send message by client Id `);
    const message = await this.chatsService.createChat(createChatDto);
    this.server.emit('message', message);
    return message;
  }

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
    // this.logger.log(`Client connected`);
  }

  handleDisconnction(client: Socket) {
    // this.logger.log(`Client disconnected`);
  }
}
