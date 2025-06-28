export const errorHandler = (err, req, res, next) => {
  console.log(Error, err.message);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};
