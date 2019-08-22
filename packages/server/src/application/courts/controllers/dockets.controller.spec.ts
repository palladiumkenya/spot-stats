import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../test/test-db.helper';
import { CourtsModule } from '../courts.module';
import { Docket } from '../../../domain/courts/docket';
import { DocketsController } from './dockets.controller';
import { getTestDockets } from '../../../../test/test.data';
import { SaveDocketHandler } from '../commands/handlers/save-docket.handler';
import { SaveDocketCommand } from '../commands/save-docket.command';
import { GetDocketsHandler } from '../queries/handlers/get-dockets.handler';
import { GetDocketsQuery } from '../queries/get-dockets.query';

describe('Practices Controller Tests', () => {
  let module: TestingModule;
  let testDockets: Docket[] = [];
  const dbHelper = new TestDbHelper();
  let controller: DocketsController;
  let liveDocket: Docket;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        CourtsModule,
      ],
    }).compile();

    testDockets = getTestDockets(5);
    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', testDockets);

    const saveDocketHandler = module.get<SaveDocketHandler>(SaveDocketHandler);
    const commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(saveDocketHandler, SaveDocketCommand.name);

    const getDocketsHandler = module.get<GetDocketsHandler>(GetDocketsHandler);
    const queryBus = module.get<QueryBus>(QueryBus);
    queryBus.bind(getDocketsHandler, GetDocketsQuery.name);

    controller = new DocketsController(commandBus, queryBus);
  });

  beforeEach(async () => {
    liveDocket = new Docket('XXX', 'XXX-ZZX');
    await dbHelper.seedDb('dockets', [liveDocket]);
  });

  it('should create Docket', async () => {
    const command = { name: 'Demo', display: 'Demo' };
    const result = await controller.createOrUpdateDocket(command);
    expect(result).not.toBeNull();
    Logger.debug(result);
  });

  it('should get All Dockets', async () => {
    const result = await controller.getDockets();
    expect(result.length).toBeGreaterThan(0);
    result.forEach(c => Logger.debug(`${c}`));
  });
});
