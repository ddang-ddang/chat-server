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

  async findOneRoom(data: any) {
    const { roomId } = data;
    console.log('===========');
    console.log(roomId);
    return await this.chatRoomModel.findOne({ roomId });
  }

  async findOneUser(userId: number) {
    const user = await this.userModel.find({ userId });
    return user;
  }

  async createRoom(client: Socket, data: any) {
    const { roomId, roomName } = data;
    await this.createUser(client, data);
    await this.chatRoomModel.create({
      roomName,
      roomId,
      socketId: client.id,
    });
  }

  async enterRoom(client: Socket, data: any) {
    const { roomId } = data;
    await this.createUser(client, data);
    await this.chatRoomModel.updateOne(
      { roomId },
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
    const { userId, message, roomId } = data;
    this.messageModel.create({
      userId,
      roomId,
      message,
    });
  }

  async exitRoom(client: Socket, roomId: number) {
    await this.chatRoomModel.updateOne(
      { roomId },
      { $pull: { socketId: client.id } }
    );
  }

  async userInRoom(client: Socket, roomId: number) {
    // const inRoom = await this.chatRoomModel.find({
    //   where: {
    //     roomId,
    //   },
    //   socketId: {
    //     $in: client.id,
    //   },
    // });
    const roomOne = await this.chatRoomModel.findOne({ roomId });
    const inRoom = await roomOne.socketId.includes(client.id);
    if (inRoom) {
      return true;
    }
    return false;
  }

  async getAllMessages(client: Socket, roomId: number) {
    const messages = await this.messageModel.find({
      roomId,
    });
    return messages;
  }
}
