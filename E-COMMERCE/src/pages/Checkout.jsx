import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI, paymentAPI } from '../services/api';
import { FiMapPin, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, subtotal, shippingCost, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'cod'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.street || !form.city || !form.state || !form.zipCode || !form.country) {
      toast.error('Please fill in all shipping details');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country
        },
        paymentMethod: form.paymentMethod
      };

      const { data } = await ordersAPI.create(orderData);
      clearCart();
      
      if (form.paymentMethod === 'jazzcash') {
        const res = await paymentAPI.initiateJazzCash({ orderId: data._id });
        submitPaymentForm(res.data.paymentUrl, res.data.formData);
      } else if (form.paymentMethod === 'easypaisa') {
        const res = await paymentAPI.initiateEasyPaisa({ orderId: data._id });
        submitPaymentForm(res.data.paymentUrl, res.data.formData);
      } else {
        toast.success('Order placed successfully!');
        navigate(`/order-success/${data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const submitPaymentForm = (url, formData) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    
    Object.keys(formData).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = formData[key];
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page page-container">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-section">
            <h2><FiMapPin /> Shipping Address</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+1 555 123 4567" />
              </div>
              <div className="form-group full-width">
                <label htmlFor="street">Street Address</label>
                <input type="text" id="street" name="street" value={form.street} onChange={handleChange} required placeholder="123 Main Street, Apt 4B" />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" value={form.city} onChange={handleChange} required placeholder="New York" />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input type="text" id="state" name="state" value={form.state} onChange={handleChange} required placeholder="NY" />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input type="text" id="zipCode" name="zipCode" value={form.zipCode} onChange={handleChange} required placeholder="10001" />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input type="text" id="country" name="country" value={form.country} onChange={handleChange} required placeholder="United States" />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2><FiCreditCard /> Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${form.paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={handleChange} />
                <span>💵 Cash on Delivery</span>
              </label>
              <label className={`payment-option ${form.paymentMethod === 'card' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === 'card'} onChange={handleChange} />
                <span>💳 Credit/Debit Card</span>
              </label>
              <label className={`payment-option ${form.paymentMethod === 'jazzcash' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="jazzcash" checked={form.paymentMethod === 'jazzcash'} onChange={handleChange} />
                <span>📱 JazzCash</span>
              </label>
              <label className={`payment-option ${form.paymentMethod === 'easypaisa' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="easypaisa" checked={form.paymentMethod === 'easypaisa'} onChange={handleChange} />
                <span>🟢 EasyPaisa</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {items.map(item => (
            <div key={item._id} className="checkout-item">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-divider"></div>
          <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span></div>
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
