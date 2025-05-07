import http, { IncomingMessage, ServerResponse } from 'http';
import { ResponseWrapper } from './ResponseWrapper';
import { RequestWrapper } from './RequestWrapper';

export type Handler = (req: RequestWrapper, res: ResponseWrapper) => void;

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

  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
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

  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
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
      route.handler(request, response);
    } catch (err) {
      response.serverError(`Internal Server Error: ${(err as Error).message}`);
    }
  }

  private createRouteRegex(path: string): RegExp {
    const paramPattern = /{(\w+)}/g;
    const regexPath = path.replace(paramPattern, '(\\w+)');
    return new RegExp(`^${regexPath}$`);
  }
}
