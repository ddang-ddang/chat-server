import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateChatDto } from './dto/chat.dto';

@Injectable()
export class ChatsService {
  createRoom(client: Socket, room: any) {
    const roomId = room.id;
    const nickname: string = client.data.nickname;
    // TODO: DB 저장 로직

    client.data.roomId = roomId;
    client.rooms.clear();
    client.join(roomId);
  }

  createChat(createChatDto: CreateChatDto) {
    const message = { ...createChatDto };
    // TODO db에 저장하는 로직 추가
    return message;
  }

  identify(nickname: string, clientId: string) {
    // TODO
  }

  findAll() {
    return `This action returns all chats`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
