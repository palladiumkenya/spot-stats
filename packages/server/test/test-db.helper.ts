import { Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ConfigService } from '../src/config/config.service';

export class TestDbHelper {
  url: string;
  config: ConfigService;
  options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

  constructor() {
    jest.setTimeout(30000);
    this.config = new ConfigService(`${process.env.NODE_ENV}.env`);
    this.url = this.config.Database;
  }

  async initConnection(dbname?: string) {
    await mongoose.connect(this.url, this.options);
    Logger.debug(`connected to [${mongoose.connection.host}]`);
  }

  async seedDb(collectionName, documents: any[]) {
    for (const document of documents) {
      const { ops } = await mongoose.connection.db
        .collection(collectionName)
        .updateOne({ _id: document._id }, { $set: document }, { upsert: true });
    }
  }

  async clearDb() {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    return Promise.all(
      collections
        .map(({ name }) => name)
        .map((collection) => {
          Logger.debug(`clearing db ${collection}`);

          try {
            mongoose.connection.db.collection(collection).drop();
          } catch (e) {
            Logger.error(e);
          }
        }),
    );
  }

  async closeConnection() {
    Logger.debug(`closing connection...`);
    // mongoose.connection.close();
    Logger.debug(`connection closed`);
  }
}
