import { Attribute } from 'src/application/attribute/entities/attribute.entity';
import { Move } from 'src/application/move/entities/move.entity';
import { BaseEntity } from 'src/infrastructure/entity';
import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';

@Entity()
export class Person extends BaseEntity{
  @Column()
  name: string;

  @Column()
  image?: string;

  @ManyToMany(() => Attribute, (category) => category.persons)
  @JoinTable()
  attributes: Attribute[];

  @OneToMany(() => Move, (move) => move.person)
  moves: Move[];
}
