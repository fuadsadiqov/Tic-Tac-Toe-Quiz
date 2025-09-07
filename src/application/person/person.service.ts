import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Attribute } from '../attribute/entities/attribute.entity';
import { Category } from '../category/entities/category.entity';
import { Person } from './entities/person.entity';
import { PaginationQueryDto } from 'src/infrastructure/pagination/pagination-query.dto';
import { PaginatedResult } from 'src/infrastructure/pagination/paginated-result.interface';
import { paginate } from 'src/infrastructure/pagination/pagination.util';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private repo: Repository<Person>,

    @InjectRepository(Attribute)
    private attributeRepo: Repository<Attribute>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async findAllByCategory(
    catId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<Person>> {
    const qb = this.repo
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.category', 'category')
      .leftJoinAndSelect('person.attributes', 'attributes')
      .where('category.id = :catId', { catId });

    if (query.search) {
      qb.andWhere('LOWER(person.name) LIKE :search', { search: `%${query.search.toLowerCase()}%` });
    }

    return paginate(qb, query);
  }
  
  async search(categoryId: string, term: string) {
    return this.repo.find({
      where: {
        category: { id: categoryId },
        name: ILike(`%${term}%`), 
      },
      take: 10,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.repo.findOne({
      where: { id },
      relations: ['category', 'attributes'],
    });
    if (!person) throw new NotFoundException('Person not found');
    return person;
  }

  async create(dto: CreatePersonDto): Promise<Person> {
    const category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
    if (!category) throw new NotFoundException('Category not found');

    const personExist = await this.repo.findOne({ where: { name: dto.name }});
    if(personExist) throw new ConflictException("Character already exist!");

    const attributes = await this.attributeRepo.findBy({ id: In(dto.attributeIds || []) });

    const person = this.repo.create({
      name: dto.name,
      category,
      attributes,
    });

    return this.repo.save(person);
  }

  async update(id: string, dto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);

    if (dto.name) person.name = dto.name;

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
      if (!category) throw new NotFoundException('Category not found');
      person.category = category;
    }

    if (dto.attributeIds) {
      const attributes = await this.attributeRepo.findBy({ id: In(dto.attributeIds) });
      person.attributes = attributes;
    }

    return this.repo.save(person);
  }

  async remove(id: string): Promise<void> {
    const person = await this.findOne(id);
    await this.repo.remove(person);
  }
}
