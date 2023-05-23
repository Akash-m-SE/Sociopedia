import express from 'express';
import {
  addComment,
  deletePost,
  getFeedPosts,
  getUserPosts,
  likePost,
} from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// READ
router.get('/', verifyToken, getFeedPosts); //gets every single post from the database while we are in the home page
router.get('/:userId/posts', verifyToken, getUserPosts); //gets only the posts from the user while we are in his home page

// UPDATE
router.patch('/:id/like', verifyToken, likePost); //for liking and unliking the post
router.post('/:id/comment', verifyToken, addComment);
router.delete('/:id', verifyToken, deletePost);

export default router;
