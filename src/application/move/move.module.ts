import { Module } from '@nestjs/common';
import { MoveService } from './move.service';
import { MoveController } from './move.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Move } from './entities/move.entity';
import { Game } from '../game/entities/game.entity';
import { User } from '../user/entities/user.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { Person } from '../person/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Move, Game, User, Attribute, Person])],
  controllers: [MoveController],
  providers: [MoveService],
})
export class MoveModule {}
