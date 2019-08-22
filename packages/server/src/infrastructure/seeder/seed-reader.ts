import * as fg from 'fast-glob';
import * as fs from 'fs';
import { ISeedReader } from '../../application/common/seeder-reader.interface';
import { Logger } from '@nestjs/common';

export class SeedReader implements ISeedReader {

  private pattern = '**/*.seed.json';
  private glob: any;

  async getFiles(): Promise<string[]> {
    let files: string[] = [];
    files = await fg([this.pattern], { dot: true });
    return files;
  }

  async read(fileMatch: string): Promise<string> {
    const seedFiles = await this.getFiles();
    const fileToParse = seedFiles.find(f => f.includes(fileMatch.toLowerCase()));
    if (fileToParse) {
      Logger.log(`reading seed [${fileToParse}]`);
      const contents = fs.readFileSync(fileToParse).toString();
      return contents;
    }
    return '';
  }
}
