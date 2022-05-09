import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatRoom extends Document {
  @Prop()
  roomName: string;

  @Prop([String])
  userId: string[];

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
