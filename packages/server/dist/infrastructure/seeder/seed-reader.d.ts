import { ISeedReader } from '../../application/common/seeder-reader.interface';
export declare class SeedReader implements ISeedReader {
    private pattern;
    private glob;
    getFiles(): Promise<string[]>;
    read(fileMatch: string): Promise<string>;
}
