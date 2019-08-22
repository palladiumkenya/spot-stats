export interface ISeedReader {
    getFiles(): Promise<string[]>;
    read(fileMatch: string): Promise<string>;
}
