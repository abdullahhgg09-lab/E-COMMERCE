import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { PaymentSuccess, PaymentFailed } from './pages/PaymentCallback';
import Profile from './pages/Profile';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import ProductForm from './admin/ProductForm';
import Customers from './admin/Customers';
import Orders from './admin/Orders';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' }
          }} />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/add" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/shop" element={<><Navbar /><Shop /><Footer /></>} />
            <Route path="/product/:id" element={<><Navbar /><ProductDetail /><Footer /></>} />
            <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
            <Route path="/login" element={<><Navbar /><Login /></>} />
            <Route path="/signup" element={<><Navbar /><Signup /></>} />

            {/* Protected Routes */}
            <Route path="/checkout" element={<ProtectedRoute><Navbar /><Checkout /><Footer /></ProtectedRoute>} />
            <Route path="/order-success/:id" element={<ProtectedRoute><Navbar /><OrderSuccess /><Footer /></ProtectedRoute>} />
            <Route path="/payment/success" element={<ProtectedRoute><Navbar /><PaymentSuccess /><Footer /></ProtectedRoute>} />
            <Route path="/payment/failed" element={<ProtectedRoute><Navbar /><PaymentFailed /><Footer /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Navbar /><Profile /><Footer /></ProtectedRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
