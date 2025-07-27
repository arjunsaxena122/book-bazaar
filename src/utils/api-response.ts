class ApiResponse {
  public success: boolean;
  constructor(
    public statusCode: number,
    public message: string = "",
    public data: string | object = "No data available",
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export {
    ApiResponse
}