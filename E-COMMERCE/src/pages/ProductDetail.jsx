import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiStar, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productsAPI.getOne(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!product) {
    return (
      <div className="empty-state page-container">
        <h2>Product not found</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const imageUrl = product.images && product.images.length > 0
    ? `http://localhost:5000${product.images[selectedImage]}`
    : 'https://placehold.co/600x600/1e293b/94a3b8?text=No+Image';

  return (
    <div className="product-detail-page page-container">
      <Link to="/shop" className="back-link"><FiArrowLeft /> Back to Shop</Link>

      <div className="product-detail-layout">
        <div className="product-detail-images">
          <div className="main-image">
            <img src={imageUrl} alt={product.name} />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={`http://localhost:5000${img}`} alt={`${product.name} ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-category-tag">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="product-rating-large">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.round(product.rating) ? 'star-filled' : ''} />
            ))}
            <span>{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <div className="product-price-large">${product.price?.toFixed(2)}</div>

          <p className="product-description">{product.description}</p>

          <div className="product-stock">
            Status: {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock-text">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><FiMinus /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}><FiPlus /></button>
              </div>
              <button className="btn btn-primary btn-lg add-to-cart-large" onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
