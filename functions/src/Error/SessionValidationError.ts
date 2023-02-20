export class SessionValidationError extends Error {
  constructor(message: string, public readonly status: number = 401) {
    super(message);
    this.name = "SessionValidationError";
  }
}
