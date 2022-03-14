import express from 'express';

import * as PostsControllers from './../controllers/postsControllers.js';
import { checkAuth } from '../middlewares/checkAuth.js';
import {
  uploadPostImage,
  resizePostImage,
} from '../middlewares/imageUpload.js';

export const router = express.Router();

router
  .route('/')
  .post(
    checkAuth,
    uploadPostImage,
    resizePostImage,
    PostsControllers.createPost
  )
  .get(PostsControllers.getAllPosts);

router.use(checkAuth);

router
  .route('/:id')
  .get(PostsControllers.getPost)
  .patch(uploadPostImage, resizePostImage, PostsControllers.updatePost)
  .delete(PostsControllers.deletePost);
