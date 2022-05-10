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
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
  ) {}

  async findOneRoom(data: any) {
    const { roomId } = data.room;
    return await this.chatRoomModel.findOne({ roomId });
  }

  async findOneUser() {
    
  }

  async createRoom(client: Socket, data: any) {
    const { roomId, roomName } = data.room;
    this.chatRoomModel.create({
      roomName,
      roomId,
      socketId: client.id,
    });
  }

  async enterRoom(client: Socket, data: any) {
    const { roomId } = data.room;
    await this.chatRoomModel.updateOne(
      { roomId },
      { $push: { socketId: client.id } },
    );
  }
}
