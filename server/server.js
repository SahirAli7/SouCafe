import dotenv from 'dotenv'; // Import dotenv
dotenv.config();  // Initialize dotenv to read .env variables

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dns from 'dns'; // Import dns
import authRoutes from './routes/authRoutes.js'; // Import using `import`
import itemRoutes from './routes/itemRoutes.js'; // Import using `import`
import orderRoutes from './routes/orderRoutes.js'; // Import using `import`


// Avoid DNS-related ENOBUFS issues
dns.setDefaultResultOrder('ipv4first');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Use the imported routes
app.use('/api/items', itemRoutes); // Use the imported routes
app.use('/api/orders', orderRoutes); // Use the imported routes

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Optional: only log in development
if (process.env.NODE_ENV === 'development') {
  console.log(process.env.MONGO_URI);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(5001, () => console.log('Server running on port 5001'));
}).catch(err => console.log(err));
