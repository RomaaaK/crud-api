import http, { IncomingMessage, ServerResponse } from 'http';
import { ResponseWrapper } from './ResponseWrapper';
import { RequestWrapper } from './RequestWrapper';
import { NotFoundError } from '../errors/NotFoundError';
import { BedRequestError } from '../errors/BadRequestError';

export type Handler = (
  req: RequestWrapper,
  res: ResponseWrapper,
) => Promise<void>;

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

interface Route {
  method: HTTP_METHODS;
  path: string;
  handler: Handler;
  regex: RegExp;
}

export class WebServer {
  private server: http.Server;
  private port: number;
  private routes: Route[] = [];

  constructor(port: number) {
    this.port = port;
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  public start(callback?: () => void): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
      if (callback) callback();
    });
  }

  public stop(callback?: () => void): void {
    this.server.close(() => {
      console.log('Server stopped');
      if (callback) callback();
    });
  }

  public addRoute(method: HTTP_METHODS, path: string, handler: Handler): void {
    const exists = this.routes.some(
      (r) => r.method === method && r.path === path,
    );
    if (exists) {
      console.warn(`Route ${method} ${path} already exists`);
      return;
    }
    const regex = this.createRouteRegex(path);
    this.routes.push({ method, path, handler, regex });
  }

  private async handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    const method = req.method?.toUpperCase();
    const url = req.url;
    const response = new ResponseWrapper(res);

    if (!method || !url) {
      response.badRequest('Invalid request: method or URL missing');
      return;
    }

    const route = this.routes.find(
      (r) => r.method === method && r.regex.test(url),
    );

    if (!route) {
      response.notFound('Not Found');
      return;
    }

    try {
      const request = new RequestWrapper(req, route.path, route.regex);
      await route.handler(request, response);
    } catch (err) {
      if (err instanceof NotFoundError) {
        response.notFound(err.message);
        return;
      }
      if (err instanceof BedRequestError) {
        response.badRequest(err.message);
      }
      response.serverError(`Internal Server Error: ${(err as Error).message}`);
    }
  }

  private createRouteRegex(path: string): RegExp {
    const paramPattern = /{(\w+)}/g;
    const regexPath = path.replace(paramPattern, '([\\w-]+)');
    return new RegExp(`^${regexPath}$`);
  }
}
