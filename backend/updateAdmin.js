import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Check if new admin already exists
    let admin = await User.findOne({ email: 'abdullahhgg09@store.com' });
    
    if (!admin) {
      // Find old admin and update it, or create if none exists
      admin = await User.findOne({ role: 'admin' });
      
      if (admin) {
        admin.email = 'abdullahhgg09@store.com';
        admin.name = 'Abdullah Admin';
        admin.password = 'abdullah123';
        await admin.save();
        console.log('Old admin updated to new credentials.');
      } else {
        await User.create({
          name: 'Abdullah Admin',
          email: 'abdullahhgg09@store.com',
          password: 'abdullah123',
          role: 'admin'
        });
        console.log('New admin created.');
      }
    } else {
      admin.password = 'abdullah123';
      admin.role = 'admin';
      await admin.save();
      console.log('Existing abdullahhgg09 admin updated.');
    }
    
    // Remove old admin if it still exists and isn't the new one
    await User.deleteOne({ email: 'admin@store.com' });
    
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateAdmin();
