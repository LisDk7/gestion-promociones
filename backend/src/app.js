const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const promotionRoutes = require('./routes/promotionRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/promotions', promotionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    res.status(503).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});
module.exports = app;