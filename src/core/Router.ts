import { Handler, HTTP_METHODS, WebServer } from '../core/WebServer';

export class Router {
  private prefix: string = '';
  private server: WebServer;

  constructor(server: WebServer) {
    this.server = server;
  }

  public setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  public get(path: string, handler: Handler): this {
    this.addRoute(HTTP_METHODS.GET, path, handler);
    return this;
  }

  public post(path: string, handler: Handler): this {
    this.addRoute(HTTP_METHODS.POST, path, handler);
    return this;
  }

  public put(path: string, handler: Handler): this {
    this.addRoute(HTTP_METHODS.PUT, path, handler);
    return this;
  }

  public patch(path: string, handler: Handler): this {
    this.addRoute(HTTP_METHODS.PATCH, path, handler);
    return this;
  }

  public delete(path: string, handler: Handler): this {
    this.addRoute(HTTP_METHODS.DELETE, path, handler);
    return this;
  }

  private addRoute(method: HTTP_METHODS, path: string, handler: Handler): void {
    const fullPath = `${this.prefix}${path}`;
    this.server.addRoute(method, fullPath, handler);
  }
}
