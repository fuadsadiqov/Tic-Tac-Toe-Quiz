import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAttributeDto {
  @IsNotEmpty()
  title: string;

  @IsUUID()
  categoryId: string;
}

export class UpdateAttributeDto {
  @IsNotEmpty()
  title: string;

  @IsUUID()
  categoryId: string;
}
