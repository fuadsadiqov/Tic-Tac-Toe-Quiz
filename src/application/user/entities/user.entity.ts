import { Game } from 'src/application/game/entities/game.entity';
import { Move } from 'src/application/move/entities/move.entity';
import { BaseEntity } from 'src/infrastructure/entity';
import { Entity, Column, OneToMany } from 'typeorm';

enum Role{
  User = 1,
  Admin
}

@Entity()
export class User extends BaseEntity{
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

  @Column({ type: "int", default: Role.User })
  role: Role = Role.User;
}