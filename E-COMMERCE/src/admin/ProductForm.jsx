import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    featured: false
  });

  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Other'];

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await productsAPI.getOne(id);
          setForm({
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            stock: data.stock,
            featured: data.featured
          });
          setExistingImages(data.images || []);
        } catch (err) {
          toast.error('Failed to load product');
          navigate('/admin/products');
        }
      };
      fetchProduct();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('stock', form.stock);
      formData.append('featured', form.featured);

      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      if (isEdit) {
        await productsAPI.update(id, formData);
        toast.success('Product updated!');
      } else {
        await productsAPI.create(formData);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-form">
      <div className="admin-page-header">
        <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="product-form-card" id="product-form">
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="name">Product Name *</label>
            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Wireless Headphones" />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows="4" placeholder="Describe the product..." />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input type="number" id="price" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" placeholder="99.99" />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input type="number" id="stock" name="stock" value={form.stock} onChange={handleChange} required min="0" placeholder="50" />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              <span>Featured Product</span>
            </label>
          </div>

          <div className="form-group full-width">
            <label>Product Images</label>
            <div className="image-upload-area">
              <input type="file" accept="image/*" multiple onChange={handleImageChange} id="image-upload" hidden />
              <label htmlFor="image-upload" className="upload-label">
                <FiUpload /> Click to upload images
              </label>
            </div>

            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="image-previews">
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="preview-item">
                    <img src={img.startsWith('http') ? img : `https://ecommerce-backend-ecru-two.vercel.app${img}`} alt={`Existing ${idx}`} />
                    <span className="existing-badge">Current</span>
                  </div>
                ))}
                {imagePreviews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="preview-item">
                    <img src={preview} alt={`Preview ${idx}`} />
                    <button type="button" className="remove-preview" onClick={() => removeNewImage(idx)}>
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
