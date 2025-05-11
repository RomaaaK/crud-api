export class BedRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BedRequestError';
  }
}
