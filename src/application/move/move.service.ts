import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { Repository } from 'typeorm';
import { Game } from '../game/entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { Move } from './entities/move.entity';
import { Person } from '../person/entities/person.entity';

@Injectable()
export class MoveService {
  constructor(
    @InjectRepository(Move) private moveRepo: Repository<Move>,
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Attribute) private attrRepo: Repository<Attribute>,
    @InjectRepository(Person) private personRepo: Repository<Person>,
  ){}

  async create(dto: CreateMoveDto) {
    const game = await this.gameRepo.findOneBy({ id: dto.gameId });
    const player = await this.userRepo.findOneBy({ id: dto.playerId });
    const person = await this.personRepo.findOneBy({ id: dto.personId });
    const rowAttr = await this.attrRepo.findOneBy({ id: dto.rowAttributeId });
    const colAttr = await this.attrRepo.findOneBy({ id: dto.columnAttributeId });

    if (!game || !player || !person || !rowAttr || !colAttr) {
      throw new BadRequestException('Invalid data');
    }

    // pivot table-dan check
    const isValid = await this.checkIfValid(person, rowAttr, colAttr);

    if (!isValid) {
      throw new BadRequestException('Player does not match the required attributes!');
    }

    const move = this.moveRepo.create({
      game,
      player,
      person,
      rowAttribute: rowAttr,
      columnAttribute: colAttr,
      isValid: true,
    });

    return this.moveRepo.save(move);
  }

  private async checkIfValid(player: Person, row: Attribute, col: Attribute): Promise<boolean> {
    // TODO: player_attributes pivot table-da yoxla
    return true; // hələlik true
  }
}
