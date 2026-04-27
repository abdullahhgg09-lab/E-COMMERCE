import express from 'express';
import {
  initiateJazzCash,
  jazzCashCallback,
  initiateEasyPaisa,
  easyPaisaCallback,
  getPaymentStatus
} from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// JazzCash
router.post('/jazzcash/initiate', auth, initiateJazzCash);
router.post('/jazzcash/callback', jazzCashCallback);  // No auth - JazzCash server calls this

// EasyPaisa
router.post('/easypaisa/initiate', auth, initiateEasyPaisa);
router.post('/easypaisa/callback', easyPaisaCallback);  // No auth - EasyPaisa server calls this

// Payment status
router.get('/status/:orderId', auth, getPaymentStatus);

export default router;
