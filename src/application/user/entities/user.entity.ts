import { Game } from 'src/application/game/entities/game.entity';
import { Move } from 'src/application/move/entities/move.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => Game, (game) => game.playerX)
  gamesAsX: Game[];

  @OneToMany(() => Game, (game) => game.playerY)
  gamesAsY: Game[];

  @OneToMany(() => Move, (move) => move.user)
  moves: Move[];
}
