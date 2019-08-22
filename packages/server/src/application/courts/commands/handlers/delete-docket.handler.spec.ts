import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteDocketCommand } from '../delete-docket.command';
import { DeleteDocketHandler } from './delete-docket.handler';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestDockets } from '../../../../../test/test.data';
import { Docket } from '../../../../domain/courts/docket';
import { CourtsModule } from '../../courts.module';
import { docketSchema } from '../../../../infrastructure/courts/schemas/docket.schema';

describe('Delete Docket Command Tests', () => {
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

    const deleteHandler = module.get<DeleteDocketHandler>(DeleteDocketHandler);

    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(deleteHandler, DeleteDocketCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  beforeEach(async () => {
    liveDocket = new Docket('XXX', 'XXX-ZZX');
    await dbHelper.seedDb('dockets', [liveDocket]);
  });

  it('should delete Docket', async () => {
    const command = new DeleteDocketCommand(liveDocket._id);
    const result = await commandBus.execute(command);
    expect(result).toBe(true);
  });
});
