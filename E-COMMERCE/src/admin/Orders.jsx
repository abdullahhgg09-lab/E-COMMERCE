import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const { data } = await ordersAPI.getAll(params);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) { toast.error('Failed to update'); }
  };

  const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <div><h1>Orders</h1><p>Manage customer orders</p></div>
      </div>
      <div className="status-filter-bar">
        {statuses.map(s => (
          <button key={s} className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
            onClick={() => { setStatusFilter(s); setPage(1); }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      {loading ? <div className="admin-loading"><div className="spinner"></div></div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table" id="orders-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {orders.length === 0 ? <tr><td colSpan="8" className="empty-table">No orders</td></tr> :
                orders.map(o => (
                  <tr key={o._id}>
                    <td className="order-id-cell">#{o._id.slice(-6)}</td>
                    <td>{o.user?.name || 'N/A'}</td>
                    <td>{o.items?.length} items</td>
                    <td><strong>${o.totalAmount?.toFixed(2)}</strong></td>
                    <td><span className={`payment-badge ${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                    <td><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                    <td><FiCalendar className="inline-icon" /> {new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="status-select">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="page-btn">Previous</button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="page-btn">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
