import { IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  dongId: number;

  @IsNumber()
  clientId: number;

  @IsString()
  message: string;
}
