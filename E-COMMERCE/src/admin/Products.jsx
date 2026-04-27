import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const { data } = await productsAPI.getAll(params);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const handleDelete = async (id, name) => {
    try {
      await productsAPI.delete(id);
      toast.success(`Product "${name}" deleted`);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product catalog</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary">
          <FiPlus /> Add Product
        </Link>
      </div>

      <div className="admin-search-bar">
        <FiSearch />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spinner"></div></div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table" id="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="7" className="empty-table">No products found</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : `https://ecommerce-backend-ecru-two.vercel.app${product.images[0]}`) : 'https://placehold.co/50x50/1e293b/94a3b8?text=N/A'}
                        alt={product.name}
                        className="table-product-img"
                      />
                    </td>
                    <td className="product-name-cell">{product.name}</td>
                    <td><span className="category-tag">{product.category}</span></td>
                    <td>${product.price?.toFixed(2)}</td>
                    <td>
                      <span className={`stock-badge ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : 'ok'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>{product.featured ? '⭐' : '—'}</td>
                    <td className="actions-cell">
                      <Link to={`/admin/products/edit/${product._id}`} className="action-btn edit">
                        <FiEdit />
                      </Link>
                      <button onClick={() => handleDelete(product._id, product.name)} className="action-btn delete">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
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

export default Products;
