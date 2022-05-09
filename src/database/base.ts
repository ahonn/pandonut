export abstract class BaseFrisbeeDatabase<T> {
  abstract queryAll(): Promise<T[]>;
}
