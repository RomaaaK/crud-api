export class BaseRepository<T extends { id: string }> {
  protected data: T[] = [];

  public findAll(): T[] {
    return this.data;
  }

  public findById(id: string): T | undefined {
    return this.data.find((item) => item.id === id);
  }

  public save(entity: T): void {
    this.data.push(entity);
  }

  public update(id: string, updated: Omit<T, 'id'>): boolean {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.data[index] = { id, ...updated } as T;
    return true;
  }

  public deleteById(id: string): boolean {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.data.splice(index, 1);
    return true;
  }
}
