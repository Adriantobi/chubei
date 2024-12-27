export class ChuBeiError extends Error {
  code: string;
  metadata?: Record<string, any>;

  constructor(message: string, code: string, metadata?: Record<string, any>) {
    super(message);
    this.name = "ChuBeiError";
    this.code = code;
    this.metadata = metadata;

    // Ensure the stack trace is properly captured
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChuBeiError);
    }
  }

  toString() {
    let errorString = `${this.name} [${this.code}]: ${this.message}`;
    if (this.metadata) {
      errorString += `\nMetadata: ${JSON.stringify(this.metadata, null, 2)}`;
    }
    return errorString;
  }
}
