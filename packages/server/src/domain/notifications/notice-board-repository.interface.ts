import { IRepository } from '../../application/common/repository.interface';
import { NoticeBoard } from './notice-board';

export interface INoticeBoardRepository extends IRepository<NoticeBoard> {}
