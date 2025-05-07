import { IncomingHttpHeaders, IncomingMessage } from 'http';

export class RequestWrapper {
  private readonly url: string;
  private readonly headers: IncomingHttpHeaders;
  private readonly params: Record<string, string>;

  constructor(
    private readonly raw: IncomingMessage,
    routePath: string,
    regex: RegExp,
  ) {
    if (!raw.method) throw new Error('Request method is missing');
    if (!raw.url) throw new Error('Request URL is missing');

    this.url = raw.url;
    this.params = this.extractParams(routePath, this.url, regex);
  }

  public getParam(name: string): string | undefined {
    return this.params[name];
  }

  public async getBody<T = unknown>(
    maxSize: number = 1024 * 1024,
    contentType: string = 'application/json',
  ): Promise<T> {
    const actualContentType = this.getHeader('content-type') || '';
    if (!actualContentType.includes(contentType)) {
      throw new Error(`Unsupported Content-Type. Expected ${contentType}`);
    }

    return new Promise<T>((resolve, reject) => {
      let totalLength = 0;
      const chunks: Buffer[] = [];

      this.raw.on('data', (chunk) => {
        totalLength += chunk.length;
        if (totalLength > maxSize) {
          reject(new Error('Request body too large'));
        }
        chunks.push(chunk);
      });

      this.raw.on('end', () => {
        try {
          const bodyStr = Buffer.concat(chunks).toString();
          const body = bodyStr ? JSON.parse(bodyStr) : {};
          resolve(body);
        } catch {
          reject(new Error('Invalid JSON body'));
        }
      });

      this.raw.on('error', reject);
    });
  }

  private getHeader(key: string): string | string[] | undefined {
    return this.headers[key.toLowerCase()];
  }

  private extractParams(
    routePath: string,
    url: string,
    regex: RegExp,
  ): Record<string, string> {
    const paramNames = this.getParamNames(routePath);
    const match = url.match(regex);
    if (!match) return {};

    const values = match.slice(1);
    const params: Record<string, string> = {};
    paramNames.forEach((name, i) => {
      if (values[i] !== undefined) {
        params[name] = values[i];
      }
    });

    return params;
  }

  private getParamNames(routePath: string): string[] {
    const paramPattern = /{(\w+)}/g;
    return [...routePath.matchAll(paramPattern)]
      .map((match) => match[1])
      .filter((param): param is string => param !== undefined);
  }
}
