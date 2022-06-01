import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatsRepository } from './chats.repository';
import { CreateChatDto } from './dto/chat.dto';

@Injectable()
export class ChatsService {
  constructor(private chatsRepository: ChatsRepository) {}

  public handleConnection(client: Socket): void {
    console.log('connected', client.id);
    client.rooms.clear();
  }

  async enterRoom(client: Socket, data: any) {
    // 만약 방에 아무도 없다면 createRoom 하고 enter
    console.log('enter room', data);
    const { roomName, nickname } = data;
    const chatRoom = await this.chatsRepository.findOneRoom(roomName);
    if (!chatRoom) {
      await this.chatsRepository.createRoom(client, data);
      console.log('create room');
    } else {
      await this.chatsRepository.enterRoom(client, data);
      console.log('enter room');
    }

    client.join(roomName);
    const memberCnt = await this.cntMembers(roomName);
    client.broadcast.to(roomName).emit('getMessage', {
      id: client.id,
      nickname,
      message: `${nickname} 님이 입장했습니다.`,
      memberCnt,
    });
  }

  async sendMessage(client: Socket, data: any) {
    // TODO db에 저장하는 로직 추가
    const newMessage = await this.chatsRepository.storeMessage(client, data);
    return newMessage;
  }

  async exitRoom(client: Socket, data: any) {
    const { nickname, roomName } = data;
    await this.chatsRepository.exitRoom(client, roomName);

    const memberCnt = await this.cntMembers(roomName);
    client.broadcast.to(roomName).emit('getMessage', {
      id: client.id,
      nickname,
      message: `${nickname} 님이 나가셨습니다.`,
      memberCnt,
    });
  }

  async userInRoom(client: Socket, roomName: string) {
    const inRoom = await this.chatsRepository.userInRoom(client, roomName);
    return inRoom;
  }

  async getAllMessages(client: Socket, data: any) {
    // TODO: 마을채팅방 접속시 DB에서 마을의 채팅기록 불러오기
    const { roomName } = data;
    const messages = await this.chatsRepository.getAllMessages(
      client,
      roomName
    );
    return messages;
  }

  async cntMembers(roomName: string) {
    return await this.chatsRepository.cntMembers(roomName);
  }
}
