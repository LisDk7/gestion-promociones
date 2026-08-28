const pool = require('../config/database');

const getAllPromotions = async () => {
  const query = `
    SELECT
      p.id,
      p.name,
      p.discount_type,
      p.discount_value,
      p.start_date,
      p.end_date,
      p.status,
      p.product_id,
      pr.name AS product_name,
      p.category_id,
      c.name AS category_name
    FROM promotions p
    LEFT JOIN products pr ON p.product_id = pr.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id DESC;
  `;

  const { rows } = await pool.query(query);

  return rows;
};

const createPromotion = async (promotionData) => {
  const {
    name,
    product_id,
    category_id,
    discount_type,
    discount_value,
    start_date,
    end_date,
  } = promotionData;

  const query = `
    INSERT INTO promotions (
      name,
      product_id,
      category_id,
      discount_type,
      discount_value,
      start_date,
      end_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
      id,
      name,
      product_id,
      category_id,
      discount_type,
      discount_value,
      start_date,
      end_date,
      status,
      created_at;
  `;

  const values = [
    name,
    product_id || null,
    category_id || null,
    discount_type,
    discount_value,
    start_date,
    end_date,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

const updatePromotionStatus = async (id, newStatus) => {
  const findQuery = `
    SELECT id, status
    FROM promotions
    WHERE id = $1;
  `;

  const { rows } = await pool.query(findQuery, [id]);

  if (rows.length === 0) {
    return {
      error: 'NOT_FOUND',
    };
  }

  const currentStatus = rows[0].status;

  const validTransition =
    (currentStatus === 'PROGRAMADA' && newStatus === 'ACTIVA') ||
    (currentStatus === 'ACTIVA' && newStatus === 'FINALIZADA');

  if (!validTransition) {
    return {
      error: 'INVALID_TRANSITION',
      currentStatus,
    };
  }

  const updateQuery = `
    UPDATE promotions
    SET
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING
      id,
      name,
      product_id,
      category_id,
      discount_type,
      discount_value,
      start_date,
      end_date,
      status,
      created_at,
      updated_at;
  `;

  const { rows: updatedRows } = await pool.query(
    updateQuery,
    [newStatus, id]
  );

  return {
    promotion: updatedRows[0],
  };
};

const deletePromotion = async (id) => {
  const findQuery = `
    SELECT id, status
    FROM promotions
    WHERE id = $1;
  `;

  const { rows } = await pool.query(findQuery, [id]);

  if (rows.length === 0) {
    return {
      error: 'NOT_FOUND',
    };
  }

  const promotion = rows[0];

  if (promotion.status !== 'PROGRAMADA') {
    return {
      error: 'NOT_PROGRAMADA',
      currentStatus: promotion.status,
    };
  }

  const deleteQuery = `
    DELETE FROM promotions
    WHERE id = $1
    RETURNING id;
  `;

  const { rows: deletedRows } = await pool.query(deleteQuery, [id]);

  return {
    deleted: true,
    id: deletedRows[0].id,
  };
};

const getPromotionById = async (id) => {
  const query = `
    SELECT
      p.id,
      p.name,
      p.discount_type,
      p.discount_value,
      p.start_date,
      p.end_date,
      p.status,
      p.product_id,
      pr.name AS product_name,
      p.category_id,
      c.name AS category_name
    FROM promotions p
    LEFT JOIN products pr ON p.product_id = pr.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1;
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
};

const getPromotionsSummary = async () => {
  const query = `
    SELECT
      COUNT(*) FILTER (WHERE status = 'PROGRAMADA') AS programadas,
      COUNT(*) FILTER (WHERE status = 'ACTIVA') AS activas,
      COUNT(*) FILTER (WHERE status = 'FINALIZADA') AS finalizadas,
      COUNT(*) FILTER (
        WHERE CURRENT_DATE BETWEEN start_date AND end_date
      ) AS vigentes_hoy
    FROM promotions;
  `;

  const { rows } = await pool.query(query);

  return {
    programadas: Number(rows[0].programadas),
    activas: Number(rows[0].activas),
    finalizadas: Number(rows[0].finalizadas),
    vigentesHoy: Number(rows[0].vigentes_hoy),
  };
};
module.exports = {
  getAllPromotions,
  createPromotion,
  updatePromotionStatus,
  deletePromotion,
  getPromotionById,
  getPromotionsSummary,
};