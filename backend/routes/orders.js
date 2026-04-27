import express from 'express';
import { createOrder, getMyOrders, getAllOrders, getOrder, updateOrderStatus, getOrderStats } from '../controllers/orderController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// User routes
router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);

// Admin routes (must come before /:id)
router.get('/stats/summary', auth, admin, getOrderStats);
router.get('/', auth, admin, getAllOrders);
router.put('/:id/status', auth, admin, updateOrderStatus);

// Shared route
router.get('/:id', auth, getOrder);

export default router;
