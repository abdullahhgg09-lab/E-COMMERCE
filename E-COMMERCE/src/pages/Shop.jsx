import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Other'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          sort: currentSort,
        };
        if (currentCategory !== 'All') params.category = currentCategory;
        if (currentSearch) params.search = currentSearch;

        const { data } = await productsAPI.getAll(params);
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, currentCategory, currentSort, currentSearch]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div>
          <h1>Shop</h1>
          {currentSearch && <p className="search-result-text">Results for "{currentSearch}"</p>}
        </div>
        <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? <FiX /> : <FiFilter />} Filters
        </button>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className={`shop-sidebar ${showFilters ? 'active' : ''}`}>
          <div className="filter-group">
            <h3>Categories</h3>
            <div className="filter-options">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${currentCategory === cat ? 'active' : ''}`}
                  onClick={() => updateFilter('category', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select
              value={currentSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="shop-main">
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => updateFilter('page', currentPage - 1)}
                    className="page-btn"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => updateFilter('page', i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => updateFilter('page', currentPage + 1)}
                    className="page-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
