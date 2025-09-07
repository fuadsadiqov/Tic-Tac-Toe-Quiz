import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MoveService } from './move.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';

@Controller('move')
export class MoveController {
  constructor(private readonly moveService: MoveService) {}

  @Post()
  create(@Body() dto: CreateMoveDto) {
    return this.moveService.create(dto);
  }
}
