import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats/chats.gateway';
import { ChatsModule } from './chats/chats.module';
import { TypegooseModule } from 'nestjs-typegoose';
import * as config from 'config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatFrontEndController } from './app.controller';

const mongoDBConfig = config.get('db');
@Module({
  imports: [
    MongooseModule.forRoot(mongoDBConfig.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ChatsModule,
  ],
  controllers: [ChatFrontEndController],
  providers: [],
})
export class AppModule {}
