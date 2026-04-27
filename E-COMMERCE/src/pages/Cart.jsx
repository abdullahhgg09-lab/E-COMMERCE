import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal, shippingCost, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="empty-state page-container">
        <FiShoppingBag className="empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page page-container">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => {
            const imageUrl = item.images && item.images.length > 0
              ? `http://localhost:5000${item.images[0]}`
              : 'https://placehold.co/120x120/1e293b/94a3b8?text=No+Image';

            return (
              <div key={item._id} className="cart-item" id={`cart-item-${item._id}`}>
                <img src={imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <span className="cart-item-price">${item.price?.toFixed(2)}</span>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><FiMinus /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FiPlus /></button>
                  </div>
                  <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}><FiTrash2 /></button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block">
            Proceed to Checkout <FiArrowRight />
          </Link>
          <Link to="/shop" className="btn btn-outline btn-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
