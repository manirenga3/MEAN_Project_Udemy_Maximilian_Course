import { Post } from './../models/postModel.js';
import { catchAsyncError } from '../utilities/catchAsyncError.js';
import { AppError } from '../utilities/appError.js';

export const createPost = catchAsyncError(async (req, res, next) => {
  const { title, content } = req.body;
  const image = `${req.protocol}://${req.get('host')}/images/posts/${
    req.file.filename
  }`;
  const creator = req.user.id;
  if (!title || !content || !image || !creator) {
    return next(
      new AppError('Please provide post title,content,image and creator', 400)
    );
  }
  const post = await Post.create({ title, content, image, creator });
  const transformedPost = { id: post._id, title, content, image, creator };
  res.status(201).json({
    status: 'success',
    message: 'Post saved successfully',
    data: {
      post: transformedPost,
    },
  });
});

export const getAllPosts = catchAsyncError(async (req, res, next) => {
  const postsPerPage = +req.query.postsPerPage;
  const page = +req.query.page;
  let findQuery = Post.find();
  if (postsPerPage && page) {
    findQuery = findQuery.skip((page - 1) * postsPerPage).limit(postsPerPage);
  }
  const posts = await findQuery;
  const totalPosts = await Post.estimatedDocumentCount();
  const transformedPosts = posts.map((post) => {
    return {
      id: post._id,
      title: post.title,
      content: post.content,
      image: post.image,
      creator: post.creator,
    };
  });
  res.status(200).json({
    status: 'success',
    message: 'Posts fetched successfully',
    data: {
      posts: transformedPosts,
      totalPosts,
    },
  });
});

export const getPost = catchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError('No post found', 400));
  }
  const { title, image, content, creator } = post;
  const transformedPost = { id: post._id, title, content, image, creator };
  res.status(200).json({
    status: 'success',
    message: 'Post fetched successfully',
    data: {
      post: transformedPost,
    },
  });
});

export const updatePost = catchAsyncError(async (req, res, next) => {
  let { title, content, image } = req.body;
  if (req.file) {
    image = `${req.protocol}://${req.get('host')}/images/posts/${
      req.file.filename
    }`;
  }
  const data = { title, content, image };
  const result = await Post.updateOne(
    { _id: req.params.id, creator: req.user.id },
    data
  );
  if (result.matchedCount === 0) {
    return next(new AppError('You are unauthorized to update this post', 401));
  }
  res.status(200).json({
    status: 'success',
    message: 'Post updated successfully',
    data: null,
  });
});

export const deletePost = catchAsyncError(async (req, res, next) => {
  const result = await Post.deleteOne({
    _id: req.params.id,
    creator: req.user.id,
  });
  if (result.deletedCount === 0) {
    return next(new AppError('You are unauthorized to delete this post', 401));
  }
  res.status(200).json({
    status: 'success',
    message: 'Post deleted successfully',
    data: null,
  });
});
