import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetNoticesQuery } from '../get-notices.query';
import { INoticeBoardRepository } from '../../../../domain/notifications/notice-board-repository.interface';
import { NoticeBoardDto } from '../../../../domain';

@QueryHandler(GetNoticesQuery)
export class GetNoticesHandler
  implements IQueryHandler<GetNoticesQuery, NoticeBoardDto[]> {
  constructor(
    @Inject('INoticeBoardRepository')
    private readonly noticeBoardRepository: INoticeBoardRepository,
  ) {}

  async execute(query: GetNoticesQuery): Promise<NoticeBoardDto[]> {
    const results = await this.noticeBoardRepository.getMain();
    return results;
  }
}
