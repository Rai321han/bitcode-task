import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const allErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    throw new ValidationError("validation errors", allErrors);
  }
  next();
};
