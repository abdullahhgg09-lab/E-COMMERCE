import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="order-success-page page-container">
      <div className="success-card">
        <FiCheckCircle className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        {id && <p className="order-id">Order ID: <strong>{id}</strong></p>}
        <div className="success-actions">
          <Link to="/profile" className="btn btn-primary">View My Orders</Link>
          <Link to="/shop" className="btn btn-outline"><FiShoppingBag /> Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
