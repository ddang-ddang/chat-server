import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Message, MessageSchema } from './schema/message.schema';
import { ChatRoom, ChatRoomSchema } from './schema/chatroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
  ],
  providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
