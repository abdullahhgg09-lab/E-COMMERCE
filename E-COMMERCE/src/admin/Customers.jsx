import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { FiSearch, FiMail, FiCalendar } from 'react-icons/fi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 15 };
        if (search) params.search = search;
        const { data } = await usersAPI.getAll(params);
        setCustomers(data.users);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [page, search]);

  return (
    <div className="admin-customers">
      <div className="admin-page-header">
        <div><h1>Customers</h1><p>{total} registered</p></div>
      </div>
      <div className="admin-search-bar">
        <FiSearch />
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      {loading ? <div className="admin-loading"><div className="spinner"></div></div> : (
        <div className="admin-table-wrapper">
          <table className="admin-table" id="customers-table">
            <thead><tr><th>Customer</th><th>Email</th><th>Role</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr></thead>
            <tbody>
              {customers.length === 0 ? <tr><td colSpan="6" className="empty-table">No customers</td></tr> :
                customers.map(c => (
                  <tr key={c._id}>
                    <td><div className="customer-name-cell"><div className="customer-avatar">{c.name?.charAt(0).toUpperCase()}</div><span>{c.name}</span></div></td>
                    <td><FiMail className="inline-icon" /> {c.email}</td>
                    <td><span className={`role-badge ${c.role}`}>{c.role}</span></td>
                    <td>{c.orderCount}</td>
                    <td>${c.totalSpent?.toFixed(2)}</td>
                    <td><FiCalendar className="inline-icon" /> {new Date(c.createdAt).toLocaleDateString()}</td>
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

export default Customers;
