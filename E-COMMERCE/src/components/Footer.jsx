import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3><span className="brand-icon">⚡</span> ShopHub</h3>
          <p>Your one-stop destination for premium products. Quality meets affordability.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">My Account</Link>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <Link to="/shop?category=Electronics">Electronics</Link>
          <Link to="/shop?category=Clothing">Clothing</Link>
          <Link to="/shop?category=Home & Kitchen">Home & Kitchen</Link>
          <Link to="/shop?category=Sports">Sports</Link>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p><FiMail /> support@shophub.com</p>
          <p><FiPhone /> +1 (555) 123-4567</p>
          <p><FiMapPin /> 123 Commerce St, NY</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
