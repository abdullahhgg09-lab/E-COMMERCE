import crypto from 'crypto';
import Order from '../models/Order.js';

// ===== JAZZCASH INTEGRATION =====

const getJazzCashConfig = () => ({
  merchantId: process.env.JAZZCASH_MERCHANT_ID || 'MC12345',
  password: process.env.JAZZCASH_PASSWORD || 'your_password',
  salt: process.env.JAZZCASH_SALT || 'your_salt_key',
  returnUrl: process.env.JAZZCASH_RETURN_URL || 'http://localhost:5173/payment/callback',
  sandboxUrl: 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/',
  liveUrl: 'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/',
  isLive: process.env.JAZZCASH_LIVE === 'true'
});

const generateJazzCashHash = (params, salt) => {
  // Sort and concatenate all pp_ fields
  const sortedKeys = Object.keys(params)
    .filter(key => key.startsWith('pp_') && params[key] !== '')
    .sort();

  let hashString = salt;
  sortedKeys.forEach(key => {
    hashString += '&' + params[key];
  });

  return crypto.createHmac('sha256', salt).update(hashString).digest('hex');
};

// @desc    Initiate JazzCash payment
// @route   POST /api/payment/jazzcash/initiate
export const initiateJazzCash = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const config = getJazzCashConfig();
    const now = new Date();
    const txnDateTime = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const expiryDate = new Date(now.getTime() + 60 * 60 * 1000);
    const txnExpiryDateTime = expiryDate.toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const txnRefNo = 'T' + txnDateTime + order._id.toString().slice(-6);
    const amountInPaisa = Math.round(order.totalAmount * 100).toString();

    const params = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: config.merchantId,
      pp_SubMerchantID: '',
      pp_Password: config.password,
      pp_BankID: 'TBANK',
      pp_ProductID: 'RETL',
      pp_TxnRefNo: txnRefNo,
      pp_Amount: amountInPaisa,
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: `ORDER-${order._id.toString().slice(-8)}`,
      pp_Description: `ShopHub Order #${order._id.toString().slice(-8)}`,
      pp_TxnExpiryDateTime: txnExpiryDateTime,
      pp_ReturnURL: config.returnUrl,
      pp_SecureHash: ''
    };

    // Generate secure hash
    params.pp_SecureHash = generateJazzCashHash(params, config.salt);

    // Save txn ref to order
    order.paymentRef = txnRefNo;
    await order.save();

    res.json({
      formData: params,
      paymentUrl: config.isLive ? config.liveUrl : config.sandboxUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

// @desc    JazzCash payment callback
// @route   POST /api/payment/jazzcash/callback
export const jazzCashCallback = async (req, res) => {
  try {
    const {
      pp_ResponseCode,
      pp_ResponseMessage,
      pp_TxnRefNo,
      pp_Amount,
      pp_SecureHash
    } = req.body;

    // Find order by payment ref
    const order = await Order.findOne({ paymentRef: pp_TxnRefNo });
    if (!order) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?message=Order not found`);
    }

    // Verify response (pp_ResponseCode '000' means success)
    if (pp_ResponseCode === '000') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentDetails = {
        method: 'jazzcash',
        txnRef: pp_TxnRefNo,
        amount: pp_Amount,
        responseCode: pp_ResponseCode,
        responseMessage: pp_ResponseMessage,
        paidAt: new Date()
      };
      await order.save();

      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?orderId=${order._id}`);
    } else {
      order.paymentStatus = 'failed';
      order.paymentDetails = {
        method: 'jazzcash',
        txnRef: pp_TxnRefNo,
        responseCode: pp_ResponseCode,
        responseMessage: pp_ResponseMessage
      };
      await order.save();

      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?orderId=${order._id}&message=${pp_ResponseMessage}`);
    }
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?message=Server error`);
  }
};


// ===== EASYPAISA INTEGRATION =====

const getEasyPaisaConfig = () => ({
  storeId: process.env.EASYPAISA_STORE_ID || 'your_store_id',
  hashKey: process.env.EASYPAISA_HASH_KEY || 'your_hash_key',
  returnUrl: process.env.EASYPAISA_RETURN_URL || 'http://localhost:5173/payment/callback',
  sandboxUrl: 'https://easypay.easypaisa.com.pk/easypay/Index.jsf',
  liveUrl: 'https://easypay.easypaisa.com.pk/easypay/Index.jsf',
  isLive: process.env.EASYPAISA_LIVE === 'true'
});

const generateEasyPaisaHash = (params, hashKey) => {
  const hashString = Object.values(params).join('&');
  return crypto.createHmac('sha256', hashKey).update(hashString).digest('hex');
};

// @desc    Initiate EasyPaisa payment
// @route   POST /api/payment/easypaisa/initiate
export const initiateEasyPaisa = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const config = getEasyPaisaConfig();
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 60 * 60 * 1000);
    const ordDatetime = now.toISOString().replace('T', ' ').slice(0, 19);
    const expiryDatetime = expiryDate.toISOString().replace('T', ' ').slice(0, 19);
    const txnRefNo = 'EP' + Date.now() + order._id.toString().slice(-6);

    const params = {
      amount: order.totalAmount.toFixed(2),
      orderRefNum: txnRefNo,
      storeId: config.storeId,
      postBackURL: config.returnUrl,
      expiryDate: expiryDatetime,
      autoRedirect: '1',
      paymentMethod: 'MA_PAYMENT_METHOD',
      emailAddr: req.user.email || ''
    };

    const hashParams = {
      amount: params.amount,
      orderRefNum: params.orderRefNum,
      storeId: params.storeId,
      postBackURL: params.postBackURL,
      expiryDate: params.expiryDate
    };

    params.merchantHashedReq = generateEasyPaisaHash(hashParams, config.hashKey);

    // Save txn ref to order
    order.paymentRef = txnRefNo;
    await order.save();

    res.json({
      formData: params,
      paymentUrl: config.isLive ? config.liveUrl : config.sandboxUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

// @desc    EasyPaisa payment callback
// @route   POST /api/payment/easypaisa/callback
export const easyPaisaCallback = async (req, res) => {
  try {
    const {
      status,
      orderRefNumber,
      responseMessage
    } = req.body;

    const order = await Order.findOne({ paymentRef: orderRefNumber });
    if (!order) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?message=Order not found`);
    }

    // status '0000' = success for EasyPaisa
    if (status === '0000') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentDetails = {
        method: 'easypaisa',
        txnRef: orderRefNumber,
        responseMessage,
        paidAt: new Date()
      };
      await order.save();

      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?orderId=${order._id}`);
    } else {
      order.paymentStatus = 'failed';
      order.paymentDetails = {
        method: 'easypaisa',
        txnRef: orderRefNumber,
        responseMessage
      };
      await order.save();

      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?orderId=${order._id}&message=${responseMessage}`);
    }
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failed?message=Server error`);
  }
};

// @desc    Check payment status for an order
// @route   GET /api/payment/status/:orderId
export const getPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      paymentDetails: order.paymentDetails || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
