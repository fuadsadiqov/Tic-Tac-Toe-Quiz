import { Game } from 'src/application/game/entities/game.entity';
import { Person } from 'src/application/person/entities/person.entity';
import { User } from 'src/application/user/entities/user.entity';
import { BaseEntity } from 'src/infrastructure/entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Move extends BaseEntity{
  @ManyToOne(() => Game, (game) => game.moves)
  game: Game;

  @ManyToOne(() => User, (user) => user.moves)
  user: User;

  @Column()
  x: number;

  @Column()
  y: number;

  @ManyToOne(() => Person, (person) => person.moves, { eager: true })
  person: Person;
}
