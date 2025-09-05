import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PaginationQueryDto } from 'src/infrastructure/pagination/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('person')
export class PersonController {
  constructor(private readonly service: PersonService) {}

   @Get('all/:categoryId')
  findAll(
    @Param('categoryId') categoryId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.service.findAllByCategory(categoryId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
