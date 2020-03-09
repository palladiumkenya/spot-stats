import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { noticeBoardSchema } from './schemas/notice-board.schema';
import { NoticeBoardRepository } from './notice-board.repository';
import { NoticeBoard } from '../../domain';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NoticeBoard.name, schema: noticeBoardSchema },
    ]),
  ],
  providers: [
    {
      provide: 'INoticeBoardRepository',
      useClass: NoticeBoardRepository,
    },
  ],
  exports: [
    {
      provide: 'INoticeBoardRepository',
      useClass: NoticeBoardRepository,
    },
  ],
})
export class NotificationsInfrastructureModule {}
