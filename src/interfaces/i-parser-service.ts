export interface IParserService<T, K> {
    urls: string[];

    grabTheData(): Promise<T[]>;
    filterData(data: T[]): Promise<T[]>;
    saveToDB(data: T[]): Promise<K[]>;
    postToSlack(data: K[]): Promise<void>;
}