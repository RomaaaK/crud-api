import http, { IncomingMessage, ServerResponse } from 'http';

type LoadBalancerOptions = {
  port: number;
  targets: number[];
};

export class LoadBalancer {
  private current = 0;
  private readonly targets: number[];
  private readonly port: number;
  private server?: http.Server;

  constructor({ port, targets }: LoadBalancerOptions) {
    this.port = port;
    this.targets = targets;
  }

  private async collectBody(req: IncomingMessage): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  }

  private sendRequest(
    req: IncomingMessage,
    body: Buffer,
    targetPort: number,
    res: ServerResponse,
  ) {
    const options = {
      hostname: 'localhost',
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        'content-length': body.length,
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      const statusCode = proxyRes.statusCode ?? 500;
      res.writeHead(statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error(`Error sending to ${targetPort}: ${err.message}`);
      if (!res.headersSent) {
        res.writeHead(502);
        res.end('Bad Gateway');
      }
    });

    proxyReq.write(body);
    proxyReq.end();
  }

  public start() {
    this.server = http.createServer(
      async (req: IncomingMessage, res: ServerResponse) => {
        try {
          const targetPort = this.targets[this.current];
          this.current = (this.current + 1) % this.targets.length;

          const body = await this.collectBody(req);

          this.sendRequest(req, body, targetPort!, res);
        } catch (err) {
          console.error('Error collecting body:', err);
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      },
    );

    this.server.listen(this.port, () => {
      console.log(`Load balancer listening on port ${this.port}`);
    });
  }

  public stop(): void {
    this.server!.close(() => {
      console.log(`Load balancers stopped.`);
    });
  }
}
