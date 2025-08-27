import { Category } from 'src/application/category/entities/category.entity';
import { Person } from 'src/application/person/entities/person.entity';
import { BaseEntity } from 'src/infrastructure/entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Attribute extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Category, (category) => category.attributes)
  category: Category;

  @ManyToMany(() => Person, (person) => person.attributes)
  persons: Person[];
}
