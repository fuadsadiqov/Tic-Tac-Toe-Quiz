import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/attribute.dto';
import { Category } from '../category/entities/category.entity';

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

  findAll(categoryId: string): Promise<Attribute[]> {
    return this.attributeRepo.find({
      relations: ['category'],
      where: { category: {id: categoryId }}
    });
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
