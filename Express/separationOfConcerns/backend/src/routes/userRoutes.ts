import express from 'express';
import { 
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser 
} from '../controllers/userController';
import asyncHandler from '../middlewares/asyncHandler';

const router = express.Router();

// User routes
router.get('/', asyncHandler(getAllUsers));
router.get('/:id', asyncHandler(getUserById));
router.post('/', asyncHandler(createUser));
router.put('/:id', asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));

export default router;