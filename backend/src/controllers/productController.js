const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);

    res.status(500).json({
      message: 'No pudimos obtener los productos.',
    });
  }
};

module.exports = {
  getProducts,
};