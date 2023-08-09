import express from 'express';
//importing the controllers
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getAllUsers,
  updateUserProfile,
} from '../controllers/users.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// READ
router.get('/:id', verifyToken, getUser);
router.put('/:_id', verifyToken, updateUserProfile);
router.get('/:id/friends', verifyToken, getUserFriends);

// UPDATE
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

router.get('/', verifyToken, getAllUsers);

export default router;
