import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/chat.dto';

@Injectable()
export class ChatsService {
  private chatRoomList: Record<string, chatRoomListDTO>;
  constructor() {
    this.chatRoomList = {
      'room:lobby': {
        roomId: 'room:lobby',
        roomName: '로비',
        cheifId: null,
      },
    };
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
