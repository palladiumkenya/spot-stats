import { Inject, Injectable, Logger } from '@nestjs/common';
import { SeedReader } from './seed-reader';
import { deserializeArray } from 'class-transformer';
import { INoticeBoardRepository } from '../../domain/notifications/notice-board-repository.interface';
import { NoticeBoard } from '../../domain';
@Injectable()
export class NoticeBoardSeeder {
  constructor(
    private readonly reader: SeedReader,
    @Inject('INoticeBoardRepository')
    private readonly repository: INoticeBoardRepository,
  ) {}

  async load(): Promise<NoticeBoard[]> {
    const seedData = await this.reader.read(NoticeBoard.name.toLowerCase());
    const noticeBoards = deserializeArray(NoticeBoard, seedData);
    return noticeBoards;
  }

  async seed(): Promise<number> {
    const seedData = await this.load();
    const count = await this.repository.getCount();
    if (count === 0) {
      Logger.log(`Seeding ${NoticeBoard.name}(s)...`);
      await this.repository.createBatch(seedData);
      return seedData.length;
    }
    return 0;
  }
}
