import { IsInt, IsString } from 'class-validator';

export class AMIDto {
  @IsString() agent: string;
  @IsString() extension?: string;
  @IsInt() pauseCode?: number;
  @IsString() channel?: string;
  @IsString() sourceExtension?: string;
}
