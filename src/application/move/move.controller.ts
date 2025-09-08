import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MoveService } from './move.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { LoggedUser } from 'src/infrastructure/user.decorator';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('move')
@UseGuards(JwtAuthGuard)
export class MoveController {
  constructor(private readonly moveService: MoveService) {}

  @Post()
  create(@Body() dto: CreateMoveDto, @LoggedUser() user: User) {
    return this.moveService.create({...dto, playerId: user ? user.id : null});
  }

  @Get('game/:gameId')
  async getMovesByGame(@Param('gameId') gameId: string) {
    return this.moveService.getMovesByGame(gameId);
  }
}
