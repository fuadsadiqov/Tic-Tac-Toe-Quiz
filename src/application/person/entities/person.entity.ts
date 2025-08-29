import { Attribute } from 'src/application/attribute/entities/attribute.entity';
import { Category } from 'src/application/category/entities/category.entity';
import { Move } from 'src/application/move/entities/move.entity';
import { BaseEntity } from 'src/infrastructure/entity';
import { Entity, Column, ManyToMany, OneToMany, JoinTable, ManyToOne } from 'typeorm';

@Entity()
export class Person extends BaseEntity{
  @Column()
  name: string;

  @ManyToMany(() => Attribute, (attribute) => attribute.persons, { eager: true })
  @JoinTable()
  attributes: Attribute[];

  @ManyToOne(() => Category, (category) => category.persons)
  category: Category;

  @OneToMany(() => Move, (move) => move.person)
  moves: Move[];
}
