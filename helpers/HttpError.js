class HttpError extends Error {
  constructor(message, httpError = 500) {
    super(message);
    this.httpErrorCode = httpError;
  }
}

module.exports = HttpError;
