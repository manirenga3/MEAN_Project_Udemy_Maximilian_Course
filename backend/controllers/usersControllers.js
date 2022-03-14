import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { User } from '../models/userModel.js';
import { catchAsyncError } from './../utilities/catchAsyncError.js';
import { AppError } from './../utilities/appError.js';

// PREOCESS.ENV CONFIGURATION
dotenv.config({ path: './config.env' });
// console.log(process.env.NODE_ENV);

const createAndSendToken = (req, res, statusCode, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // const cookieOptions = {
  //   maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000,
  //   httpOnly: true,
  //   secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  // };
  // res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    message: 'You are logged in now',
    data: {
      token,
      userId,
      expiresIn: 86400,
    },
  });
};

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePwd(password, user.password))) {
    return next(new AppError('Invalid email or password', 400));
  }
  createAndSendToken(req, res, 200, user.id);
});

export const signup = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    return next(new AppError('Please provide email and passwords', 400));
  }

  const user = await User.create({ email, password, confirmPassword });

  createAndSendToken(req, res, 201, user._id);
});
