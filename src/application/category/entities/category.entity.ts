import { Attribute } from 'src/application/attribute/entities/attribute.entity';
import { Person } from 'src/application/person/entities/person.entity';
import { BaseEntity } from 'src/infrastructure/entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Category extends BaseEntity{
  @Column()
  title: string;

  @OneToMany(() => Attribute, (move) => move.category)
  attributes: Attribute[];

  @OneToMany(() => Person, (person) => person.category)
  persons: Person[];
}
