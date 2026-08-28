const pool = require('../config/database');

const getAllCategories = async () => {
  const query = `
    SELECT
      id,
      name
    FROM categories
    ORDER BY id;
  `;

  const { rows } = await pool.query(query);

  return rows;
};

module.exports = {
  getAllCategories,
};