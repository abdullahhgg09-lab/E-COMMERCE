import { useState, useEffect } from 'react';
import { ordersAPI, usersAPI, productsAPI } from '../services/api';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orderRes, userRes, productRes] = await Promise.all([
          ordersAPI.getStats(),
          usersAPI.getStats(),
          productsAPI.getAll({ limit: 1 })
        ]);
        setStats(orderRes.data);
        setUserStats(userRes.data);
        setProductCount(productRes.data.total);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="admin-loading"><div className="spinner"></div></div>;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxSale = stats?.monthlySales?.length > 0
    ? Math.max(...stats.monthlySales.map(m => m.sales))
    : 1;

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Overview of your store performance</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-card-icon"><FiDollarSign /></div>
          <div className="stat-card-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">${stats?.totalRevenue?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-card-icon"><FiShoppingBag /></div>
          <div className="stat-card-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{stats?.totalOrders || 0}</span>
            <span className="stat-sub">{stats?.pendingOrders || 0} pending</span>
          </div>
        </div>

        <div className="stat-card customers">
          <div className="stat-card-icon"><FiUsers /></div>
          <div className="stat-card-info">
            <span className="stat-label">Total Customers</span>
            <span className="stat-value">{userStats?.totalUsers || 0}</span>
            <span className="stat-sub">+{userStats?.newUsersThisMonth || 0} this month</span>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-card-icon"><FiPackage /></div>
          <div className="stat-card-info">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{productCount}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Sales Chart */}
        <div className="dashboard-card chart-card">
          <h3><FiTrendingUp /> Monthly Sales</h3>
          <div className="chart-container">
            {stats?.monthlySales?.length > 0 ? (
              <div className="bar-chart">
                {stats.monthlySales.map((m, idx) => (
                  <div key={idx} className="bar-group">
                    <div className="bar-wrapper">
                      <div
                        className="bar"
                        style={{ height: `${(m.sales / maxSale) * 100}%` }}
                        title={`$${m.sales.toFixed(2)}`}
                      >
                        <span className="bar-value">${m.sales >= 1000 ? `${(m.sales / 1000).toFixed(1)}k` : m.sales.toFixed(0)}</span>
                      </div>
                    </div>
                    <span className="bar-label">{months[m._id.month - 1]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-chart">
                <p>No sales data yet. Start selling!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card">
          <h3><FiShoppingBag /> Recent Orders</h3>
          {stats?.recentOrders?.length > 0 ? (
            <div className="recent-orders-list">
              {stats.recentOrders.map(order => (
                <div key={order._id} className="recent-order-item">
                  <div className="recent-order-info">
                    <strong>{order.user?.name || 'Customer'}</strong>
                    <span className="recent-order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="recent-order-right">
                    <span className="recent-order-amount">${order.totalAmount?.toFixed(2)}</span>
                    <span className={`status-badge status-${order.status}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
