import express from 'express';
import { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook 
} from '../controllers/bookController';
import asyncHandler from '../middlewares/asyncHandler';

const router = express.Router();

// Book routes
router.get('/', asyncHandler(getAllBooks));
router.get('/:id', asyncHandler(getBookById));
router.post('/', asyncHandler(createBook));
router.put('/:id', asyncHandler(updateBook));
router.delete('/:id', asyncHandler(deleteBook));

export default router;