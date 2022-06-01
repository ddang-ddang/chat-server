import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { ChatRoom } from './schema/chatroom.schema';
import { Message } from './schema/message.schema';
import { User } from './schema/user.schema';

@Injectable()
export class ChatsRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>
  ) {}

  async findOneRoom(roomName: string) {
    return await this.chatRoomModel.findOne({ roomName });
  }

  async findOneUser(userId: number) {
    const user = await this.userModel.find({ userId });
    return user;
  }

  async createRoom(client: Socket, data: any) {
    const { roomName } = data;
    await this.createUser(client, data);
    await this.chatRoomModel.create({
      roomName,
      // roomId,
      socketId: client.id,
    });
  }

  async enterRoom(client: Socket, data: any) {
    const { roomName } = data;
    await this.createUser(client, data);
    await this.chatRoomModel.updateOne(
      { roomName },
      { $push: { socketId: client.id } }
    );
  }

  async createUser(client: Socket, data: any) {
    const { userId, nickname } = data;
    const user = await this.findOneUser(userId);
    if (user.length === 0) {
      this.userModel.create({
        userId,
        socketId: client.id,
        nickname,
      });
    } else {
      await this.userModel.updateOne(
        { userId },
        {
          $set: {
            socketId: client.id,
            nickname,
          },
        }
      );
    }
  }

  async storeMessage(client: Socket, data: any) {
    const { userId, nickname, message, roomName } = data;
    const newMessage = this.messageModel.create({
      userId,
      nickname,
      roomName,
      message,
    });
    return newMessage;
  }

  async exitRoom(client: Socket, roomName: string) {
    await this.chatRoomModel.updateOne(
      { roomName },
      { $pull: { socketId: client.id } }
    );
  }

  async userInRoom(client: Socket, roomName: string) {
    const roomOne = await this.chatRoomModel.findOne({ roomName });
    const inRoom = await roomOne.socketId.includes(client.id);
    if (inRoom) {
      return true;
    }
    return false;
  }

  async getAllMessages(client: Socket, roomName: string) {
    const messages = await this.messageModel.find({
      roomName,
    });
    return messages;
  }

  async cntMembers(roomName: string) {
    const document = await this.chatRoomModel.findOne({ roomName });
    const cnt = document.socketId.length;
    return cnt ? cnt : 0;
  }
}
