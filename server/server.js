require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/products', require('./routes/product'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/coupons', require('./routes/coupon'));
app.use('/api/pc-builder', require('./routes/pcBuilder'));
app.use('/api/admin', require('./routes/admin'));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
