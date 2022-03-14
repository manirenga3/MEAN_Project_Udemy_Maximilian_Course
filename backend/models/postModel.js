import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post must have a title'],
  },
  content: {
    type: String,
    required: [true, 'Post must have a content'],
  },
  image: {
    type: String,
    required: [true, 'Post must have an image'],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post ,must have a creator'],
  },
});

export const Post = mongoose.model('Post', postSchema);
