import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document } from 'mongoose';
import { Types, Document, Schema as MongooseSchema } from 'mongoose';

import { Message } from './message.schema';

@Schema()
export class User extends Document {
  @Prop()
  socketId: string;

  @Prop()
  nickname: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }] })
  messages: Message[];
}

export const UserSchema = SchemaFactory.createForClass(User);
