const { validationResult } = require("express-validator");

const formatErrors = (result) =>
  result.array().map((error) => ({
    field: error.param,
    message: error.msg,
  }));

const validate = (validations) => {
  return async (req, _res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const error = new Error("Validation failed");
    error.status = 400;
    error.details = formatErrors(errors);
    return next(error);
  };
};

module.exports = { validate };

