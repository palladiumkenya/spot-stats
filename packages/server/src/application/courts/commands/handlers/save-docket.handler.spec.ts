import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { SaveDocketCommand } from '../save-docket.command';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SaveDocketHandler } from './save-docket.handler';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestDockets } from '../../../../../test/test.data';
import { Docket } from '../../../../domain/courts/docket';
import { CourtsModule } from '../../courts.module';
import { docketSchema } from '../../../../infrastructure/courts/schemas/docket.schema';

describe('Save Docket Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  let testDockets: Docket[] = [];
  const dbHelper = new TestDbHelper();
  let liveDocket: Docket;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        MongooseModule.forFeature([{ name: 'Docket', schema: docketSchema }]),
        CourtsModule,
      ],
    }).compile();
    testDockets = getTestDockets(5);
    await dbHelper.initConnection();
    await dbHelper.seedDb('dockets', testDockets);

    const saveDocketHandler = module.get<SaveDocketHandler>(SaveDocketHandler);

    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(saveDocketHandler, SaveDocketCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  beforeEach(async () => {
    liveDocket = new Docket('XXX', 'XXX-ZZX');
    await dbHelper.seedDb('dockets', [liveDocket]);
  });

  it('should create Docket', async () => {
    const command = new SaveDocketCommand('Demo', 'Demo');
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();
    Logger.debug(result);
  });

  it('should modify Docket', async () => {
    const command = new SaveDocketCommand('NewTest', 'NewTest', liveDocket._id);
    const result = await commandBus.execute(command);
    expect(result.name).toBe('NewTest');
    expect(result.display).toBe('NewTest');
    expect(result._id).toBe(liveDocket._id);
    Logger.debug(result);
  });
});
