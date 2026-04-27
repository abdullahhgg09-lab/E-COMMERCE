import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories } from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Multer config for Cloudinary image uploads
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Public routes
router.get('/', getProducts);
router.get('/categories/list', getCategories);
router.get('/:id', getProduct);

// Admin routes
router.post('/', auth, admin, upload.array('images', 5), createProduct);
router.put('/:id', auth, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

export default router;
