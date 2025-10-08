const errorHandler = (req, res, err, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error(err);

    if ((err.name = "Cast error")) {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    if ((err.code = 11000)) {
      const message = "Duplicate keys";
      error = new Error(message);
      error.statusCode = 400;
    }

    if ((errname = "ValidationError")) {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(","));
      error.statusCode = 400;
    }

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or empty JSON payload" });
    }
  } catch (error) {
    next(error);
  }
};

export default errorHandler;
