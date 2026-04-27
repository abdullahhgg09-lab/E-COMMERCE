import { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiShoppingBag } from 'react-icons/fi';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="order-success-page page-container">
      <div className="success-card">
        <FiCheckCircle className="success-icon" style={{ color: 'var(--success)' }} />
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed and your order is confirmed.</p>
        {orderId && <p className="order-id">Order ID: <strong>{orderId}</strong></p>}
        <div className="success-actions">
          <Link to="/profile" className="btn btn-primary">View My Orders</Link>
          <Link to="/shop" className="btn btn-outline"><FiShoppingBag /> Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || 'Payment could not be processed.';
  const orderId = searchParams.get('orderId');

  return (
    <div className="order-success-page page-container">
      <div className="success-card">
        <FiXCircle className="success-icon" style={{ color: 'var(--danger)' }} />
        <h1>Payment Failed</h1>
        <p>{message}</p>
        {orderId && <p className="order-id">Order ID: <strong>{orderId}</strong></p>}
        <div className="success-actions">
          <Link to="/checkout" className="btn btn-primary">Try Again</Link>
          <Link to="/shop" className="btn btn-outline">Back to Shop</Link>
        </div>
      </div>
    </div>
  );
};
