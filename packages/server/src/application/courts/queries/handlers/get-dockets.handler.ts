import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DocketDto } from '../../../../domain/courts/dtos/docket.dto';
import { IDocketRepository } from '../../../../domain/courts/docket-repository.interface';
import { GetDocketsQuery } from '../get-dockets.query';

@QueryHandler(GetDocketsQuery)
export class GetDocketsHandler
  implements IQueryHandler<GetDocketsQuery, DocketDto[]> {
  constructor(
    @Inject('IDocketRepository')
    private readonly docketRepository: IDocketRepository,
  ) {}

  async execute(query: GetDocketsQuery): Promise<DocketDto[]> {
    const results = await this.docketRepository.getAll();
    return results;
  }
}
