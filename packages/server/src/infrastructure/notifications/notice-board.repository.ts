import { BaseRepository } from '../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INoticeBoardRepository } from '../../domain/notifications/notice-board-repository.interface';
import { NoticeBoard } from '../../domain';

export class NoticeBoardRepository extends BaseRepository<NoticeBoard>
  implements INoticeBoardRepository {
  constructor(@InjectModel(NoticeBoard.name) model: Model<NoticeBoard>) {
    super(model);
  }
}
