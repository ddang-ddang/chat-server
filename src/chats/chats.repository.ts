import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return await this.chatRoomModel.findOne(roomId);
  }

  async findOneUser() {
    
  }

  async createRoom(data: any) {
    const { roomId, roomName } = data.room;

  }
}
