import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatFrontEndController } from './app.controller';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(configuration.mongoDB.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ChatsModule,
  ],
  controllers: [ChatFrontEndController],
  providers: [],
})
export class AppModule {}
