import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  userId: number;

  // @Prop({ required: true })
  // roomId: number;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  roomName: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: null })
  deletedAt: Date;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  // user: Types.ObjectId;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ChatRoom' })
  // chatRoom: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
