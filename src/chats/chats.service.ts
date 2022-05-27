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

  // createRoom(client: Socket, room: any) {
  //   const roomId = room.id;
  //   const nickname = client.data.nickname;
  //   // TODO: DB 저장 로직
  //   client.data.roomId = roomId;
  //   client.rooms.clear();
  //   client.join(roomId);
  // }

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

    // const { roomId, roomName, nickname } = data;
    // client.data.roomId = roomId;
    // client.data.roomName = roomName;
    // client.rooms.clear();
    client.join(roomName);
    client.emit('getMessage', {
      id: client.id,
      nickname,
      message: `${nickname} 님이 ${roomName} 방에 입장했습니다.`,
    });
    client.broadcast.to(roomName).emit('getMessage', {
      id: client.id,
      nickname,
      message: `${nickname} 님이 ${roomName} 방에 입장했습니다.`,
    });
  }

  sendMessage(client: Socket, data: any) {
    // TODO db에 저장하는 로직 추가
    this.chatsRepository.storeMessage(client, data);
  }

  exitRoom(client: Socket, roomName: string) {
    this.chatsRepository.exitRoom(client, roomName);
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
}
