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
    // client.leave(client.id);
    // client.data.roomId = `room:lobby`;
    // client.join('room:lobby');
  }

  createRoom(client: Socket, room: any) {
    const roomId = room.id;
    const nickname: string = client.data.nickname;
    // TODO: DB 저장 로직

    client.data.roomId = roomId;
    client.rooms.clear();
    client.join(roomId);
  }

  async enterRoom(client: Socket, data: any) {
    // 만약 방에 아무도 없다면 createRoom 하고 enter
    const chatRoom = await this.chatsRepository.findOneRoom(data);
    if (!chatRoom) {
      this.chatsRepository.createRoom(client, data);
      console.log('create room');
    } else {
      this.chatsRepository.enterRoom(client, data);
      console.log('enter room');
    }

    const { roomId, roomName } = data.room;
    const { nickname } = data;
    client.data.roomId = roomId;
    // client.rooms.clear();
    client.join(roomId);
    client.emit('getMessage', {
      id: client.id,
      nickname,
      message: `${nickname} 님이 ${roomName} 방에 입장했습니다.`,
    });
    // console.log(client);
  }

  sendMessage(client: Socket, message: string) {
    // TODO db에 저장하는 로직 추가
    return message;
  }

  exitRoom(client: Socket, roomId: number) {
    this.chatsRepository.exitRoom(client, roomId);
  }

  getChatRoom(roomId: any) {
    // TODO: DB에서 roomname 가져오기
  }

  getAllMessages(client: Socket, roomId: any) {
    // TODO: 마을채팅방 접속시 DB에서 마을의 채팅기록 불러오기
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
