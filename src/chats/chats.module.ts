import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { Message, MessageSchema } from './entities/message.schema';
import { ChatRoomSchema } from './entities/chatroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: UserSchema },
      { name: 'message', schema: MessageSchema },
      { name: 'chatRoom', schema: ChatRoomSchema },
    ]),
  ],
  providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
