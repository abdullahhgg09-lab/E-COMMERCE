import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const imageUrl = product.images && product.images.length > 0
    ? `http://localhost:5000${product.images[0]}`
    : 'https://placehold.co/400x400/1e293b/94a3b8?text=No+Image';

  return (
    <Link to={`/product/${product._id}`} className="product-card" id={`product-${product._id}`}>
      <div className="product-card-image">
        <img src={imageUrl} alt={product.name} loading="lazy" />
        {product.featured && <span className="product-badge">Featured</span>}
        {product.stock === 0 && <span className="product-badge out-of-stock">Out of Stock</span>}
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <FiStar className="star-filled" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="review-count">({product.numReviews || 0})</span>
        </div>
        <div className="product-card-footer">
          <span className="product-price">${product.price?.toFixed(2)}</span>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <FiShoppingCart /> Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
