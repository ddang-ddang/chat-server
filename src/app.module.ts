import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsGateway } from './chats/chats.gateway';
import { ChatsModule } from './chats/chats.module';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    // TypegooseModule.forRoot(
    //   {
    //     useNewUrlParser: true,
    //     useFindAndModify: false,
    //   }
    // )
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
