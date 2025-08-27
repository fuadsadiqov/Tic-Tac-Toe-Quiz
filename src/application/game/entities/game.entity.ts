import { Move } from 'src/application/move/entities/move.entity';
import { User } from 'src/application/user/entities/user.entity';
import { BaseEntity } from 'src/infrastructure/entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

export type GameStatus = 'waiting' | 'in_progress' | 'finished';

@Entity()
export class Game extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.gamesAsX, { eager: true })
  playerX: User;

  @ManyToOne(() => User, (user) => user.gamesAsY, { eager: true })
  playerY: User;

  @Column({ type: 'varchar' })
  status: GameStatus;

  @OneToMany(() => Move, (move) => move.game)
  moves: Move[];
}
