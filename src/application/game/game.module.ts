import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { Person } from '../person/entities/person.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Attribute, Person, Category])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
