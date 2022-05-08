import { prop } from '@typegoose/typegoose';

export class Chat {
  @prop({
    required: [true, 'Message is required'],
  })
  message: string;

  constructor(chat?: Partial<Chat>) {
    Object.assign(this, chat);
  }
}
