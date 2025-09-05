import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/attribute.dto';
import { Category } from '../category/entities/category.entity';
import { PaginationQueryDto } from 'src/infrastructure/pagination/pagination-query.dto';
import { PaginatedResult } from 'src/infrastructure/pagination/paginated-result.interface';
import { paginate } from 'src/infrastructure/pagination/pagination.util';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepo: Repository<Attribute>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateAttributeDto): Promise<Attribute> {
    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const attribute = this.attributeRepo.create({
      title: dto.title,
      category,
    });

    return this.attributeRepo.save(attribute);
  }

    async findAll(
    catId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<any>> {
    const qb = this.attributeRepo
      .createQueryBuilder('attribute')
      .leftJoinAndSelect('attribute.category', 'category')
      .leftJoinAndSelect('attribute.persons', 'person')
      .loadRelationCountAndMap('attribute.personCount', 'attribute.persons')
      .where('category.id = :catId', { catId });

    if (query.search) {
      qb.andWhere('LOWER(attribute.title) LIKE :search', { search: `%${query.search.toLowerCase()}%` });
    }

    const paginated = await paginate(qb, query);

    paginated.data = paginated.data.map(attr => ({
      ...attr,
      personNames: attr.persons.map(p => p.name),
      persons: null,
    }));

    return paginated;
  }


  async findOne(id: string): Promise<Attribute> {
    const attribute = await this.attributeRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    return attribute;
  }

  async update(id: string, dto: UpdateAttributeDto): Promise<Attribute> {
    const attribute = await this.findOne(id);
    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    attribute.title = dto.title;
    attribute.category = category;

    return this.attributeRepo.save(attribute);
  }

  async remove(id: string): Promise<void> {
    const attribute = await this.findOne(id);
    await this.attributeRepo.remove(attribute);
  }
}
