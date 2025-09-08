import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameMode, GameStatus } from './entities/game.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { User } from '../user/entities/user.entity';
import { Person } from '../person/entities/person.entity';
import { Category } from '../category/entities/category.entity';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
    @InjectRepository(Attribute)
    private attrRepo: Repository<Attribute>,
    @InjectRepository(Person)
    private personRepo: Repository<Attribute>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async createGame(
    creator: User,
    dto: CreateGameDto
  ): Promise<Game> {
    const { mode, playerOName, playerXName, categoryId } = dto;
    const maxRetries = 10;
    let attempt = 0;
    let created: boolean = false;

    while (attempt < maxRetries && !created) {
      attempt++;

      const rowAttributes = await this.getRandomAttributes(2);
      const columnAttributes = await this.getRandomAttributes(2);

      let isValid = true;
      for (const row of rowAttributes) {
        for (const col of columnAttributes) {
          const persons = await this.personRepo
            .createQueryBuilder('p')
            .innerJoin('p.attributes', 'a1', 'a1.id = :rowId', { rowId: row.id })
            .innerJoin('p.attributes', 'a2', 'a2.id = :colId', { colId: col.id })
            .getMany();

          if (persons.length === 0) {
            isValid = false;
            break;
          }
        }
        if (!isValid) break;
      }

      if (isValid) {
        created = true;
        const category = await this.categoryRepo.findOne({ where: { id: categoryId } });

        const game = this.gameRepo.create({
          category,
          rowAttributes,
          columnAttributes,
          mode,
          currentTurn: 'X',
          startedAt: new Date(),
        });

        if (mode === GameMode.ONLINE) {
          // creator həmişə playerX
          game.playerX = creator;
          game.status = GameStatus.WAITING;
        } else if (mode === GameMode.OFFLINE) {
          game.playerXName = playerXName ?? 'Player X';
          game.playerOName = playerOName ?? 'Player O';
          game.status = GameStatus.ACTIVE;
        }

        return this.gameRepo.save(game);
      }
    }

    throw new BadRequestException(
      `Uygun atribut kombinasiya tapılmadı (${maxRetries} cəhd edildi).`,
    );
  }

  private async getRandomAttributes(count: number): Promise<Attribute[]> {
    return this.attrRepo
      .createQueryBuilder('a')
      .orderBy('RANDOM()')
      .limit(count)
      .getMany();
  }

  async getGameById(id: string): Promise<Game> {
    const games = this.gameRepo.findOne({
      where: { id },
      relations: ['moves', 'playerX', 'playerO', 'winner', 'category'],
    });
    
    return games;
  }

  async listGames(status?: GameStatus): Promise<Game[]> {
    const where = status ? { status } : {};
    return this.gameRepo.find({ where });
  }

  async finishGame(id: string, winner?: User): Promise<Game> {
    const game = await this.getGameById(id);
    if (!game) throw new BadRequestException('Game not found');

    game.status = GameStatus.FINISHED;
    game.endedAt = new Date();
    if (winner) {
      game.winner = winner;
    }

    return this.gameRepo.save(game);
  }
}
