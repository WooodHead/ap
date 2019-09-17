import { IsInt, IsString } from 'class-validator';

export class LoginAgentDto {
  @IsString() agent: string;
  @IsString() extension: string;
  @IsInt() campaign: number;
}
