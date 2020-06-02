import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestDockets, getTestNotices } from '../../../../../test/test.data';
import { QueryBus } from '@nestjs/cqrs';
import { Docket } from '../../../../domain/courts/docket';
import { DocketDto } from '../../../../domain/courts/dtos/docket.dto';
import { NotificationsModule } from '../../notifications.module';
import { GetNoticesHandler } from './get-notices.handler';
import { GetNoticesQuery } from '../get-notices.query';
import { NoticeBoard, NoticeBoardDto } from '../../../../domain';
import uuid = require('uuid');

describe('Get Notices Query Tests', () => {
  let module: TestingModule;
  let queryBus: QueryBus;
  let testNotices: NoticeBoard[] = [];
  const dbHelper = new TestDbHelper();
  let liveNotice: NoticeBoard;

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

    const getDocketsHandler = module.get<GetNoticesHandler>(GetNoticesHandler);

    queryBus = module.get<QueryBus>(QueryBus);
    queryBus.bind(getDocketsHandler, GetNoticesQuery.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  beforeEach(async () => {
    liveNotice = new NoticeBoard(uuid.v1(), 'XXX', 1);
    await dbHelper.seedDb('noticeboards', [liveNotice]);
  });

  it('should get Noticeboards', async () => {
    const query = new GetNoticesQuery();
    const result = await queryBus.execute<GetNoticesQuery, NoticeBoardDto[]>(
      query,
    );
    expect(result.length).toBeGreaterThan(0);
    result.forEach((c) => Logger.debug(`${c}`));
  });
});
