import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';

import { router as usersRoutes } from './routes/usersRoutes.js';
import { router as postsRoutes } from './routes/postsRoutes.js';
import { globalErrorHandler } from './controllers/errorControllers.js';
import { AppError } from './utilities/appError.js';

// To access filename and dirname
// const fileName = fileURLToPath(import.meta.url);
// const dirName = path.dirname(fileName);
// console.log(dirName);

// EXPRESS APP
export const app = express();

// To enable and trust proxy
app.enable('trust proxy');

// GLOBAL MIDDLEWARES
// To implement CORS
// app.use(cors());

// To respond to options preflight by browser for non-simple requests
// app.options('*', cors());

// To implement CORS manually
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization,X-Auth_Token,X-Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PATCH,PUT,DELETE,OPTIONS'
  );
  next();
});
app.options('*', (_, res) => {
  res.sendStatus(200);
});

// For serving static files
app.use('/images', express.static(path.join('images')));

// For security http headers
app.use(helmet());

// For limiting requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP! Please try again after 30 minutes',
});
app.use('*', limiter);

// For develeopment env logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// For reading data into req.body from req and for also to set payload limit to 10kb
app.use(express.json({ limit: '10kb' }));

// For reading url encoded data
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// For reading cookies into req.cookies
app.use(cookieParser());

// For data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// For data sanitization against XSS (Cross Site Attack)
app.use(xss());

// To prevent HTTP parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// For compressing responses
app.use(compression());

// Routes
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

app.use('*', (req, res, next) => {
  return next(new AppError('Page not found!', 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);
