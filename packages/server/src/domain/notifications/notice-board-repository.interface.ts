import { IRepository } from '../../application/common/repository.interface';
import { NoticeBoard } from './notice-board';
import { Measure } from '../metrices/measure';

export interface INoticeBoardRepository extends IRepository<NoticeBoard> {
  getMain(): Promise<NoticeBoard[]>;
}
