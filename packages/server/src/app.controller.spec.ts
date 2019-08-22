import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TestDbHelper } from '../test/test-db.helper';
import { AppModule } from './app.module';

describe('AppController', () => {

  let module: TestingModule;
  let appController: AppController;
  const dbHelper = new TestDbHelper();

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        AppModule,
      ],
    }).compile();
    await dbHelper.initConnection();
    appController = module.get<AppController>(AppController);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  describe('root', () => {
    it('should return "dwapi Globe"', () => {
      expect(appController.getAppName()).toBe('dwapi Globe');
    });
  });
});
