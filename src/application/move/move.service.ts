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
    const game = await this.gameRepo.findOne({
      where: { id: dto.gameId },
      relations: ['playerX', 'playerO', 'moves']
    });

    if (!game) throw new BadRequestException('Invalid game');

    let player: User | null = null;

    if (game.mode === 'online') {
      player = await this.userRepo.findOneBy({ id: dto.playerId });
      if (!player) throw new BadRequestException('Invalid player');
    }

    const person = await this.personRepo.findOneBy({ id: dto.personId });
    const rowAttr = await this.attrRepo.findOneBy({ id: dto.rowAttributeId });
    const colAttr = await this.attrRepo.findOneBy({ id: dto.columnAttributeId });

    if (!person || !rowAttr || !colAttr) {
      throw new BadRequestException('Invalid data');
    }

    const isValid = await this.checkIfValid(person, rowAttr, colAttr);
    if (!isValid) {
      game.failedMoves = (game.failedMoves || 0) + 1;
      await this.gameRepo.save(game);
      throw new BadRequestException('Invalid move!');
    }
    const totalMoves = game.moves.length;
    const expectedSymbol: 'X' | 'O' = totalMoves % 2 === 0 ? 'X' : 'O';

    if (game.mode === 'online') {
      if ((expectedSymbol === 'X' && player!.id !== game.playerX.id) ||
          (expectedSymbol === 'O' && player!.id !== game.playerO.id)) {
        throw new BadRequestException(`It's not ${player!.username}'s turn!`);
      }
    }

    const move = this.moveRepo.create({
      game,
      player: player || undefined,
      person,
      rowAttribute: rowAttr,
      columnAttribute: colAttr,
      isValid: true,
      symbol: expectedSymbol
    });

    return this.moveRepo.save(move);
  }

  private async checkIfValid(player: Person, row: Attribute, col: Attribute): Promise<boolean> {
    const personWithAttrs = await this.personRepo.findOne({
      where: { id: player.id },
      relations: ['attributes']
    });

    if (!personWithAttrs) return false;

    const hasRow = personWithAttrs.attributes.some(attr => attr.id === row.id);
    const hasCol = personWithAttrs.attributes.some(attr => attr.id === col.id);

    return hasRow && hasCol;
  }

  async getMovesByGame(gameId: string): Promise<any[]> {
    const response = await this.moveRepo.find({
      where: { game: { id: gameId } },
      relations: ['player', 'person', 'rowAttribute', 'columnAttribute'],
    });
    return response.map(move => ({
      id: move.id,
      columnAttributeId: move.columnAttribute.id,
      rowAttributeId: move.rowAttribute.id,
      isValid: move.isValid,
      symbol: move.symbol,
      person: {
        id: move.person.id,
        name: move.person.name
      },
      player: move.player ? {
        id: move.player.id,
        username: move.player.username
      } : null
    }))
  }
}
