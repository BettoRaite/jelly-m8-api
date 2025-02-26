/**
 * Represents an API error with additional properties for better error handling.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - The HTTP status code associated with the error.
   * @param {string} message - A descriptive message for the error.
   * @param {string} [errorCode] - An optional error code for easier identification.
   * @param {object} [details] - Additional details about the error.
   */
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
