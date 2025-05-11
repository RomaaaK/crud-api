import { NotFoundError } from '../errors/NotFoundError';

class DBService<T extends { id: string }> {
  protected data: T[] = [];

  public findAll(): T[] {
    return this.data;
  }

  public findById(id: string): T | undefined {
    const data = this.data.find((item) => item.id === id);
    if (!data) {
      throw new NotFoundError(`Entity with id ${id} not found.`);
    }
    return data;
  }

  public save(entity: T): void {
    this.data.push(entity);
  }

  public update(id: string, updated: Omit<T, 'id'>): T {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundError(`Entity with id ${id} not found.`);
    }
    const updatedEntity = { id, ...updated } as T;
    this.data[index] = updatedEntity;
    return updatedEntity;
  }

  public deleteById(id: string): boolean {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundError(`Entity with id ${id} not found.`);
    }
    this.data.splice(index, 1);
    return true;
  }
}

export default new DBService();
