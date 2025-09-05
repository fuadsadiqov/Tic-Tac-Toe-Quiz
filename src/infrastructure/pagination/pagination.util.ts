import { SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDto } from './pagination-query.dto';
import { PaginatedResult } from './paginated-result.interface';

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options: PaginationQueryDto,
): Promise<PaginatedResult<T>> {
  const { page, limit, isAll } = options;

  let data, total;

  if(!isAll){
    [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    }else{
      [data, total] = await qb
      .getManyAndCount();
  }

  return { data, total, page, limit };
}
