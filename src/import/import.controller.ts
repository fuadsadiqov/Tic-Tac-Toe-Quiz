import { Body, Controller, Post } from '@nestjs/common';
import { ImportService } from './import.service';
import * as path from 'path';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post()
  create() {
    const categoryId = '21292eb1-cb2b-4160-8a6a-7a9c5d3d01ec';
    const filePath = path.join(__dirname, 'players.xlsx');
    return this.importService.importExcel(filePath, categoryId);
  }
}