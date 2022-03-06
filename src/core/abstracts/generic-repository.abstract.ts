export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>;
}
