class ValidationError extends AppError {
  constructor(message, details) {
    super(message);
    this.details = details;
  }
}
