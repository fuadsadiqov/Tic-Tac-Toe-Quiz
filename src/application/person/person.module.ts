import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Attribute } from '../attribute/entities/attribute.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Attribute, Category])],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
