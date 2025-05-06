import http, { IncomingMessage, ServerResponse } from 'http';

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

interface Route {
  method: string;
  path: string;
  handler: Handler;
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

  public addRoute(method: string, path: string, handler: Handler): void {
    this.routes.push({ method, path, handler });
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const method = req.method?.toUpperCase() || 'GET';
    const url = req.url || '/';

    const route = this.routes.find(
      (r) => r.method.toUpperCase() === method && r.path === url,
    );

    if (route) {
      route.handler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  }
}
