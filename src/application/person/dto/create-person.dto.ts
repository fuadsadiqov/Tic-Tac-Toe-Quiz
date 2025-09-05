import { IsNotEmpty, IsString, IsOptional, IsArray, IsNumber, IsUUID } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  categoryId: string;

  @IsArray()
  @IsString({})
  attributeIds: string[];
}
