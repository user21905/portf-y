export class ClientValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientValidationError";
  }
}
