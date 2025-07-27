class ApiError extends Error {
  public data: null;
  public success: boolean;

  constructor(
    public statusCode: number,
    public message: string = "Something went wrong",
    public error: string[] | object[] = [],
    public stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export {
    ApiError
}