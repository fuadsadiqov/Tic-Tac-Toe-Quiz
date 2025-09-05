import { Attribute } from "src/application/attribute/entities/attribute.entity";
import { Game } from "src/application/game/entities/game.entity";
import { Person } from "src/application/person/entities/person.entity";
import { User } from "src/application/user/entities/user.entity";
import { BaseEntity } from "src/infrastructure/entity";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

@Entity()
export class Move extends BaseEntity {
  @ManyToOne(() => Game, (game) => game.id, { onDelete: 'CASCADE' })
  game: Game;

  @ManyToOne(() => Person, { eager: true })
  person: Person;

  @ManyToOne(() => Attribute, { eager: true })
  rowAttribute: Attribute;

  @ManyToOne(() => Attribute, { eager: true })
  columnAttribute: Attribute;
  
  @Column({ type: 'boolean', default: false })
  isValid: boolean;

  @ManyToOne(() => User, { eager: true })
  player: User;
  
  @CreateDateColumn()
  createdAt: Date;
}