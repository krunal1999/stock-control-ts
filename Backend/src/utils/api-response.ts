class ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
  statusCode: number;

  constructor(data: T, statusCode: number = 200) {
    this.success = true;
    this.data = data;
    this.statusCode = statusCode;
    this.message = "success";
  }
}

class ApiError {
  success: false;
  message: string;
  error?: {
    message: string;
    details?: any;
  };
  statusCode: number;

  constructor(message: string, statusCode: number = 500, details?: any) {
    this.success = false;
    this.message = "failed";
    this.error = { message, details };
    this.statusCode = statusCode;
  }
}

export { ApiSuccess, ApiError };
