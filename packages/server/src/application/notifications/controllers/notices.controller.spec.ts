import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../test/test-db.helper';
import { getTestNotices } from '../../../../test/test.data';
import { NoticesController } from './notices.controller';
import { NotificationsModule } from '../notifications.module';
import { GetNoticesHandler, GetNoticesQuery } from '../queries';
import { NoticeBoard } from '../../../domain';
import uuid = require('uuid');

describe('Notices Controller Tests', () => {
  let module: TestingModule;
  let testNotices: NoticeBoard[] = [];
  const dbHelper = new TestDbHelper();
  let controller: NoticesController;
  let liveNoticeBoard: NoticeBoard;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        NotificationsModule,
      ],
    }).compile();

    testNotices = getTestNotices(5);
    await dbHelper.initConnection();
    await dbHelper.seedDb('noticeboards', testNotices);

    const getNoticesHandler = module.get<GetNoticesHandler>(GetNoticesHandler);
    const queryBus = module.get<QueryBus>(QueryBus);
    queryBus.bind(getNoticesHandler, GetNoticesQuery.name);

    controller = new NoticesController(queryBus);
  });

  beforeEach(async () => {
    liveNoticeBoard = new NoticeBoard(uuid.v1(), 'XXX', 8);
    await dbHelper.seedDb('noticeboards', [liveNoticeBoard]);
  });

  it('should get All Notices', async () => {
    const result = await controller.getNotices();
    expect(result.length).toBeGreaterThan(0);
    result.forEach(c => Logger.debug(`${c}`));
  });
});
