import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GameMode } from '../entities/game.entity';

export class CreateGameDto {
  @IsEnum(GameMode)
  mode: GameMode;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  playerXName?: string;

  @IsOptional()
  @IsString()
  playerOName?: string;
}
