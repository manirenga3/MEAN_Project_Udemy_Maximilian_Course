import mongoose from 'mongoose';

import { app } from './app.js';

// REGISTERING EVENT FOR UNCAUGHT EXCEPTION (ERROR IN SYNC)
process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION! 💥 Shutting down...`);
  console.log(`Error name - ${err.name}`);
  console.log(`Error message - ${err.message}`);
  process.exit(1);
});

// DATABASE CONNECTION
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log('Database connection successful'))
  .catch((err) => console.log(`Database connection error : ${err}`));

// STARTING SERVER
const port = parseInt(process.env.PORT, 10);
const server = app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});

// REGISTERING EVENT FOR UNHANDLED REJECTIONS (ERROR IN ASYNC)
process.on('unhandledRejection', (err) => {
  console.log(`UNHANDLED REJECTION! 💥 Shutting down...`);
  console.log(`Error name - ${err.name}`);
  console.log(`Error message - ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// RESPONDING TO HEROKU'S SIGTERM SIGNAL (Every 24 hours)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM Received! Shutting down...');
  server.close(() => {
    console.log('Process terminated because of SIGTERM');
  });
});
