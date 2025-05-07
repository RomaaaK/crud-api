import { ServerResponse } from 'http';
import { HTTP_STATUS } from './http-status';

type ResponseData = Record<string, unknown>;

export class ResponseWrapper {
  constructor(private res: ServerResponse) {}

  public ok(data: ResponseData): void {
    this.send(HTTP_STATUS.OK, data);
  }

  public created(data: ResponseData): void {
    this.send(HTTP_STATUS.CREATED, data);
  }

  public noContent(): void {
    this.res.writeHead(HTTP_STATUS.NO_CONTENT);
    this.res.end();
  }

  public badRequest(message: string): void {
    this.send(HTTP_STATUS.BAD_REQUEST, { error: message });
  }

  public notFound(message: string): void {
    this.send(HTTP_STATUS.NOT_FOUND, { error: message });
  }

  public serverError(message: string): void {
    this.send(HTTP_STATUS.INTERNAL_SERVER_ERROR, { error: message });
  }

  private send(statusCode: number, data?: unknown): void {
    this.res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    this.res.end(data !== undefined ? JSON.stringify(data) : undefined);
  }
}
