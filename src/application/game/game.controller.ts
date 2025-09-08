import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { LoggedUser } from 'src/infrastructure/user.decorator';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(
    @LoggedUser() user,
    @Body() body: CreateGameDto,
  ) {
    return this.gameService.createGame(
      user,
      body
    );
  }

  @Get(':id')
  async getGameById(@Param('id') id: string) {
    return this.gameService.getGameById(id);
  }

  @Get()
  async listGames() {
    return this.gameService.listGames();
  }

  @Patch(':id/finish')
  async finishGame(@Param('id') id: string, @Body('winnerId') winnerId?: number) {
    let winner = undefined;
    if (winnerId) {
      // user entity-ni tapmaq lazım
    }
    return this.gameService.finishGame(id, winner);
  }
}