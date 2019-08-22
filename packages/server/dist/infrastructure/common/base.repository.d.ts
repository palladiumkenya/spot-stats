import { Model } from 'mongoose';
import { IRepository } from '../../application/common/repository.interface';
export declare abstract class BaseRepository<T> implements IRepository<T> {
    protected readonly model: Model<T>;
    protected constructor(model: Model<T>);
    create(entity: any): Promise<T>;
    createBatch(entity: any[]): Promise<number>;
    update(entity: any): Promise<T>;
    get(tid: any): Promise<T>;
    getAll(criteria?: any): Promise<T[]>;
    delete(tid: any): Promise<boolean>;
    getCount(): Promise<number>;
    getModel(): any;
    createOrUpdate(entity: any): Promise<T>;
    exists(tid: any): Promise<boolean>;
    toObjects(documents: any[]): any[];
}
