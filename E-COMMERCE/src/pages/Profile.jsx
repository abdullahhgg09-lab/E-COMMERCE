import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { FiUser, FiPackage, FiCalendar } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await ordersAPI.getMy();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  return (
    <div className="profile-page page-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FiUser />
        </div>
        <div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="profile-section">
        <h2><FiPackage /> My Orders</h2>
        {loading ? (
          <div className="loading-screen"><div className="spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders yet. Start shopping!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id-label">Order #{order._id.slice(-8)}</span>
                    <span className="order-date">
                      <FiCalendar /> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="order-status" style={{ '--status-color': getStatusColor(order.status) }}>
                    {order.status}
                  </span>
                </div>
                <div className="order-card-body">
                  <div className="order-items-preview">
                    {order.items.map((item, idx) => (
                      <span key={idx}>{item.name} × {item.quantity}</span>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>${order.totalAmount?.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
