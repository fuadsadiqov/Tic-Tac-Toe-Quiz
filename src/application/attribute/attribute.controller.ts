import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/attribute.dto';
import { PaginationQueryDto } from 'src/infrastructure/pagination/pagination-query.dto';

@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(@Body() dto: CreateAttributeDto) {
    return this.attributeService.create(dto);
  }

  @Get('all/:catId')
  findAll(
    @Param('catId') catId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.attributeService.findAll(catId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAttributeDto) {
    return this.attributeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeService.remove(id);
  }
}
