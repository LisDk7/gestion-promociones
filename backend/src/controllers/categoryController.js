const categoryService = require('../services/categoryService');

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);

    res.status(500).json({
      message: 'No pudimos obtener las categorías.',
    });
  }
};

module.exports = {
  getCategories,
};