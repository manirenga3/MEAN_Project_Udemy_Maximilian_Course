import multer from 'multer';
import sharp from 'sharp';

import { catchAsyncError } from '../utilities/catchAsyncError.js';

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images/posts');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const name = `post-${file.originalname
//       .toLowerCase()
//       .split(' ')
//       .join('-')}-${date.now()}.${ext}`;
//     cb(null, name);
//   },
// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    const err = new Error('Invalid file type');
    cb(err, false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
export const uploadPostImage = upload.single('image');

export const resizePostImage = catchAsyncError(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `post-${req.file.originalname
    .toLowerCase()
    .split(' ')
    .join('-')}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`images/posts/${req.file.filename}`);

  next();
});
