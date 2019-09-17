import { IsBoolean, IsString } from 'class-validator';

export class LoginAgentDto {
  @IsString() agent: string;
  @IsString() extension: string;
  @IsString() useWebRTC?: boolean;
  @IsString() secret?: string;
  @IsString() username: string;
  @IsBoolean() force?: boolean;
}
