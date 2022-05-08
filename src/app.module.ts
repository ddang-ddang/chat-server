import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsGateway } from './chats/chats.gateway';
import { ChatsModule } from './chats/chats.module';
import { TypegooseModule } from 'nestjs-typegoose';
import * as config from 'config';

const mongoDBConfig = config.get('db');
@Module({
  imports: [TypegooseModule.forRoot(mongoDBConfig.address), ChatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
