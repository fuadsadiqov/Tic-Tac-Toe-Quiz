import { Attribute } from "src/application/attribute/entities/attribute.entity";
import { Category } from "src/application/category/entities/category.entity";
import { Move } from "src/application/move/entities/move.entity";
import { User } from "src/application/user/entities/user.entity";
import { BaseEntity } from "src/infrastructure/entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";

export enum GameStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

export enum GameMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Entity()
export class Game extends BaseEntity {
  @Column({ type: 'json' })
  rowAttributes: Attribute[];

  @Column({ type: 'json' })
  columnAttributes: Attribute[];

  @OneToMany(() => Move, (move) => move.game, { cascade: true })
  moves: Move[];

  @ManyToOne(() => Category)
  category: Category;

  // Player X
  @ManyToOne(() => User, { nullable: true })
  playerX?: User;

  @Column({ nullable: true })
  playerXName?: string; // offline/local mode üçün

  // Player O
  @ManyToOne(() => User, { nullable: true })
  playerO?: User;

  @Column({ nullable: true })
  playerOName?: string;

  @ManyToOne(() => User, { nullable: true })
  winner?: User;

  @Column({ nullable: true })
  winnerName?: string;

  @Column({ type: "int", default: 0 })
  failedMoves: number;

  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.WAITING })
  status: GameStatus;

  @Column({ type: 'enum', enum: GameMode, default: GameMode.OFFLINE })
  mode: GameMode;

  @Column({ type: 'enum', enum: ['X', 'O'], default: 'X' })
  currentTurn: 'X' | 'O';

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt?: Date;
}