const pool = require('../config/database');

const getAllProducts = async () => {
  const query = `
    SELECT
      p.id,
      p.name,
      p.category_id,
      c.name AS category_name
    FROM products p
    INNER JOIN categories c
      ON p.category_id = c.id
    ORDER BY p.id;
  `;

  const { rows } = await pool.query(query);

  return rows;
};

module.exports = {
  getAllProducts,
};