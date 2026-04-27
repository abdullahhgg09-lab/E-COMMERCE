import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiArrowLeft, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout" id="admin-panel">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="brand-icon">⚡</span>
          <span>Admin Panel</span>
          <button className="admin-close-sidebar" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'} onClick={() => setSidebarOpen(false)}>
            <FiGrid /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'} onClick={() => setSidebarOpen(false)}>
            <FiPackage /> Products
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'} onClick={() => setSidebarOpen(false)}>
            <FiShoppingBag /> Orders
          </NavLink>
          <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'} onClick={() => setSidebarOpen(false)}>
            <FiUsers /> Customers
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-link">
            <FiArrowLeft /> Back to Store
          </NavLink>
          <button onClick={handleLogout} className="admin-nav-link logout-btn">
            <FiLogOut /> Logout
          </button>
          <div className="admin-user-info">
            <span>{user?.name}</span>
            <small>{user?.email}</small>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-mobile-header">
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <h2>Admin Dashboard</h2>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
