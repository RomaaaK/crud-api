import 'dotenv/config';
import { HTTP_METHODS } from '../core/WebServer';
import { request } from 'http';

interface ApiResponse<T> {
  data?: T;
}

export class BaseRepository<T extends { id: string }> {
  private hostname = 'localhost';
  private port = parseInt(process.env.DB_PORT || '5000');
  private pathPrefix = '/api/db';

  public async findAll(): Promise<T[]> {
    const response = await this.makeRequest<T[]>(
      HTTP_METHODS.GET,
      this.pathPrefix,
    );
    return response.data ?? [];
  }

  public async findById(id: string): Promise<T | undefined> {
    const response = await this.makeRequest<T>(
      HTTP_METHODS.GET,
      `${this.pathPrefix}/${id}`,
    );
    return response.data;
  }

  public async save(entity: T): Promise<void> {
    await this.makeRequest(HTTP_METHODS.POST, this.pathPrefix, entity);
  }

  public async update(id: string, updated: Partial<Omit<T, 'id'>>): Promise<T> {
    const response = await this.makeRequest<T>(
      HTTP_METHODS.PUT,
      `${this.pathPrefix}/${id}`,
      updated,
    );
    return response.data!;
  }

  public async deleteById(id: string): Promise<void> {
    await this.makeRequest(HTTP_METHODS.DELETE, `${this.pathPrefix}/${id}`);
  }

  private async makeRequest<R>(
    method: string,
    path: string,
    body?: object,
  ): Promise<ApiResponse<R>> {
    return new Promise((resolve, reject) => {
      const data = body ? JSON.stringify(body) : undefined;
      const options = {
        hostname: this.hostname,
        port: this.port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      };

      const req = request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({ data: parsed.data as R });
        });
      });

      req.on('error', reject);

      if (data) req.write(data);
      req.end();
    });
  }
}
