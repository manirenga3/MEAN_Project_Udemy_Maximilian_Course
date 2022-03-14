import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import { User } from '../models/userModel.js';
import { catchAsyncError } from './../utilities/catchAsyncError.js';
import { AppError } from './../utilities/appError.js';

export const checkAuth = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new AppError('User does not exists', 401));
  }

  req.user = user;

  next();
});
