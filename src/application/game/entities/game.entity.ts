import { Attribute } from "src/application/attribute/entities/attribute.entity";
import { Category } from "src/application/category/entities/category.entity";
import { Move } from "src/application/move/entities/move.entity";
import { User } from "src/application/user/entities/user.entity";
import { BaseEntity } from "src/infrastructure/entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany } from "typeorm";

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

  @ManyToOne(() => User)
  playerX: User;

  @ManyToOne(() => User)
  playerO: User;

  @ManyToOne(() => User, { nullable: true })
  winner?: User;

  @Column({ type: 'enum', enum: ['active', 'finished'], default: 'active' })
  status: string;
  
  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt?: Date;
}
