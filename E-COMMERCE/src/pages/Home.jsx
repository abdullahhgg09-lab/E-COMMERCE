import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiRefreshCw } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await productsAPI.getAll({ featured: 'true', limit: 8 });
        setFeaturedProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', icon: '🔌', color: '#3b82f6' },
    { name: 'Clothing', icon: '👕', color: '#8b5cf6' },
    { name: 'Home & Kitchen', icon: '🏠', color: '#10b981' },
    { name: 'Sports', icon: '⚽', color: '#f59e0b' },
    { name: 'Beauty', icon: '💄', color: '#ec4899' },
    { name: 'Books', icon: '📚', color: '#6366f1' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-content">
          <span className="hero-badge">🔥 New Arrivals 2026</span>
          <h1>Everything you need in<br /><span className="gradient-text">One Place</span></h1>
          <p>Shop thousend of products with secure checkout and fast delivery.</p>
          <div className="hero-buttons">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/shop?category=Electronics" className="btn btn-outline btn-lg">
              Explore Electronics
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>10K+</strong><span>Products</span></div>
            <div className="stat"><strong>50K+</strong><span>Customers</span></div>
            <div className="stat"><strong>4.9</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow"></div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="feature-item">
          <FiTruck className="feature-icon" />
          <div>
            <strong>Free Shipping</strong>
            <span>Orders over $100</span>
          </div>
        </div>
        <div className="feature-item">
          <FiShield className="feature-icon" />
          <div>
            <strong>Secure Payment</strong>
            <span>100% protected</span>
          </div>
        </div>
        <div className="feature-item">
          <FiHeadphones className="feature-icon" />
          <div>
            <strong>24/7 Support</strong>
            <span>Dedicated help</span>
          </div>
        </div>
        <div className="feature-item">
          <FiRefreshCw className="feature-icon" />
          <div>
            <strong>Easy Returns</strong>
            <span>30-day policy</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" id="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find exactly what you're looking for</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              key={cat.name}
              className="category-card"
              style={{ '--accent': cat.color }}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" id="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/shop" className="section-link">View All <FiArrowRight /></Link>
        </div>
        {loading ? (
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Shopping?</h2>
          <p>Join thousands of happy customers and discover amazing deals every day.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create Account <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
