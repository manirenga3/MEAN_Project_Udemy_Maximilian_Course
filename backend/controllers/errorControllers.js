import { AppError } from '../utilities/appError.js';

// DB ERROR HANDLING (HELPER)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  // const errors = Object.values(err.errors).map((el) => el.message);
  const mes = err.message.split(':')[2].trimStart();
  const message = `${mes.charAt(0).toUpperCase()}${mes.slice(1)}`;
  return new AppError(message, 400);
};

const handleJwtError = () => new AppError('Invalid JSON Web Token', 400);

const handleJwtExpiredError = () => new AppError('JSON Web Token expired', 401);

// SENDING ERROR TO CLIENT (HELPER)
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming, other unknown error: don't leak error details
  // 1) Log error
  console.error('Error 💥', err);
  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

// ERROR HANDLER
export const globalErrorHandler = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'SyntaxError') {
      error = handleJwtError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJwtExpiredError();
    }

    sendErrorProd(error, res);
  }
};
