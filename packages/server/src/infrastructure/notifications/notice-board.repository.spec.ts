import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDbHelper } from '../../../test/test-db.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { getTestNotices } from '../../../test/test.data';
import { NoticeBoard } from '../../domain';
import * as uuid from 'uuid';
import { NotificationsInfrastructureModule } from './notifications-infrastructure.module';
import { INoticeBoardRepository } from '../../domain/notifications/notice-board-repository.interface';

describe('Notice Board Repository  Tests', () => {
  let module: TestingModule;
  let repository: INoticeBoardRepository;
  const dbHelper = new TestDbHelper();
  const testNotices = getTestNotices();
  let liveNotice: NoticeBoard;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        NotificationsInfrastructureModule,
      ],
    }).compile();

    await dbHelper.initConnection();
    await dbHelper.seedDb('noticeboards', testNotices);
    repository = module.get<INoticeBoardRepository>('INoticeBoardRepository');
  });

  beforeEach(async () => {
    liveNotice = new NoticeBoard(uuid.v1(), 'xxx', 5);
    await dbHelper.seedDb('noticeboards', [liveNotice]);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should be defined', async () => {
    expect(repository).toBeDefined();
  });

  it('should load Notices', async () => {
    const noticeBoards = await repository.getAll();
    expect(noticeBoards.length).toBeGreaterThan(0);
    noticeBoards.forEach((d) => Logger.debug(`${d.message}`));
  });
});
