import { Injectable, Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { IRepository } from '../../application/common/repository.interface';
import { BaseRepository } from './base.repository';
import { Model, Schema } from 'mongoose';
import * as uuid from 'uuid';
import { TestDbHelper } from '../../../test/test-db.helper';

describe('Base Repository Tests', () => {
  let module: TestingModule;
  let repository: CarRepository;
  const dbHelper = new TestDbHelper();
  let testCars: Car[] = [];
  let liveCar: Car;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        MongooseModule.forFeature([{ name: 'Car', schema: carSchema }]),
      ],
      providers: [CarRepository],
    }).compile();
    testCars = getTestCars(5);
    await dbHelper.initConnection();
    await dbHelper.seedDb('cars', testCars);
    repository = module.get<CarRepository>(CarRepository);
  });

  beforeEach(async () => {
    liveCar = new Car('XXXX');
    await dbHelper.seedDb('cars', [liveCar]);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  it('should create Entity', async () => {
    const car = new Car('Toyota');
    const result = await repository.create(car);
    expect(result).not.toBeNull();
    //  Logger.debug(result);
  });

  it('should create Batch entitie', async () => {
    const cars: Car[] = [new Car('Merc'), new Car('Sub')];
    const result = await repository.createBatch(cars);
    expect(result).toBeGreaterThan(0);
    // Logger.debug(`Created:${result}`);
  });

  it('should update Entity', async () => {
    liveCar.changeName('xyz');
    const result = await repository.update(liveCar);

    const updated = await repository.get(liveCar._id);
    expect(updated).not.toBeNull();
    expect(updated.name).toBe('xyz');
    expect(updated._id).toBe(liveCar._id);
    // Logger.debug(updated);
  });
  it('should Create or Update where new', async () => {
    const car = new Car('Toyota');
    const result = await repository.createOrUpdate(car);
    expect(result).not.toBeNull();
    // Logger.debug(result);
  });

  it('should Create or Update where updated', async () => {
    liveCar.changeName('xyz');
    const result = await repository.createOrUpdate(liveCar);

    const updated = await repository.get(liveCar._id);
    expect(updated).not.toBeNull();
    expect(updated.name).toBe('xyz');
    expect(updated._id).toBe(liveCar._id);
    // Logger.debug(updated);
  });

  it('should get Entity by Id', async () => {
    const car = await repository.get(liveCar._id);
    expect(car).not.toBeNull();
    // Logger.debug(car);
  });

  it('should get Entities', async () => {
    const cars = await repository.getAll();
    expect(cars.length).toBeGreaterThan(0);
    cars.forEach(c => Logger.debug(`${c}`));
  });

  it('should get Entity by Criteria', async () => {
    const cars = await repository.getAll({ name: liveCar.name });
    expect(cars.length).toBeGreaterThan(0);
    cars.forEach(c => Logger.debug(`${c}`));
  });

  it('should delete Entity by Id', async () => {
    const result = await repository.delete(liveCar._id);
    expect(result).toBe(true);
  });

  it('should get Count', async () => {
    const result = await repository.getCount();
    expect(result).toBeGreaterThan(0);
    // Logger.debug(`Total:${result}`);
  });
});

class Car {
  public _id: string;

  constructor(public name: string) {
    this._id = uuid();
  }

  changeName(newName) {
    this.name = newName;
  }
}

interface CarDto {
  name: string;
  _id: string;
}

const carSchema = new mongoose.Schema({
  _id: String,
  name: String,
});

interface ICarRepository extends IRepository<Car> {}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
class CarRepository extends BaseRepository<Car> implements ICarRepository {
  constructor(
    @InjectModel(Car.name)
    model: Model<Car>,
  ) {
    super(model);
  }
}

const getTestCars = (count = 2) => {
  const cars: Car[] = [];
  for (let i = 0; i < count; i++) {
    cars.push(new Car(`car${i}`));
  }
  return cars;
};
