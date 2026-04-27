import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@store.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@store.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@store.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium noise-cancelling wireless headphones with 30-hour battery life, deep bass, and crystal-clear sound. Perfect for music lovers and professionals.',
          price: 79.99,
          category: 'Electronics',
          stock: 50,
          images: [],
          rating: 4.5,
          numReviews: 128,
          featured: true
        },
        {
          name: 'Smart Watch Pro',
          description: 'Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water resistant up to 50m.',
          price: 199.99,
          category: 'Electronics',
          stock: 35,
          images: [],
          rating: 4.7,
          numReviews: 89,
          featured: true
        },
        {
          name: 'Men\'s Classic Leather Jacket',
          description: 'Genuine leather jacket with premium stitching. Timeless design that pairs well with any outfit. Available in multiple sizes.',
          price: 149.99,
          category: 'Clothing',
          stock: 25,
          images: [],
          rating: 4.3,
          numReviews: 67,
          featured: true
        },
        {
          name: 'Stainless Steel Water Bottle',
          description: 'Double-wall vacuum insulated water bottle. Keeps drinks cold for 24 hours and hot for 12 hours. BPA free, 750ml capacity.',
          price: 24.99,
          category: 'Home & Kitchen',
          stock: 100,
          images: [],
          rating: 4.8,
          numReviews: 234,
          featured: false
        },
        {
          name: 'Running Shoes Ultra Boost',
          description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Perfect for daily training and marathon running.',
          price: 129.99,
          category: 'Sports',
          stock: 40,
          images: [],
          rating: 4.6,
          numReviews: 156,
          featured: true
        },
        {
          name: 'Organic Face Moisturizer',
          description: 'Natural and organic face moisturizer with hyaluronic acid and vitamin E. Suitable for all skin types. Dermatologically tested.',
          price: 34.99,
          category: 'Beauty',
          stock: 60,
          images: [],
          rating: 4.4,
          numReviews: 92,
          featured: false
        },
        {
          name: 'Portable Bluetooth Speaker',
          description: 'Compact waterproof Bluetooth speaker with 360-degree sound. 12-hour playtime, built-in microphone for calls.',
          price: 49.99,
          category: 'Electronics',
          stock: 75,
          images: [],
          rating: 4.2,
          numReviews: 178,
          featured: false
        },
        {
          name: 'Women\'s Yoga Pants',
          description: 'High-waisted yoga pants with 4-way stretch fabric. Moisture-wicking, breathable, and squat-proof. Perfect for workout and casual wear.',
          price: 39.99,
          category: 'Clothing',
          stock: 80,
          images: [],
          rating: 4.5,
          numReviews: 203,
          featured: true
        },
        {
          name: 'Coffee Maker Deluxe',
          description: 'Programmable drip coffee maker with thermal carafe. Brews up to 12 cups. Built-in grinder for fresh coffee every morning.',
          price: 89.99,
          category: 'Home & Kitchen',
          stock: 30,
          images: [],
          rating: 4.6,
          numReviews: 145,
          featured: true
        },
        {
          name: 'Bestselling Novel Collection',
          description: 'Box set of 5 bestselling novels from award-winning authors. Includes mystery, thriller, romance, sci-fi, and literary fiction.',
          price: 44.99,
          category: 'Books',
          stock: 45,
          images: [],
          rating: 4.8,
          numReviews: 312,
          featured: false
        },
        {
          name: 'Wireless Charging Pad',
          description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overheat protection.',
          price: 19.99,
          category: 'Electronics',
          stock: 120,
          images: [],
          rating: 4.1,
          numReviews: 89,
          featured: false
        },
        {
          name: 'Premium Yoga Mat',
          description: 'Extra thick 6mm yoga mat with non-slip surface. Eco-friendly TPE material, includes carrying strap. 72 x 24 inches.',
          price: 29.99,
          category: 'Sports',
          stock: 55,
          images: [],
          rating: 4.7,
          numReviews: 167,
          featured: false
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log(`✅ ${sampleProducts.length} sample products created`);
    } else {
      console.log(`Products already exist (${productCount} found)`);
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
