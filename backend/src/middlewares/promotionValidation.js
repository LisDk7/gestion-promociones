const validateCreatePromotion = (req, res, next) => {
  const {
    name,
    product_id,
    category_id,
    discount_type,
    discount_value,
    start_date,
    end_date,
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: 'Por favor, ingresa un nombre para la promoción.',
    });
  }

  const hasProduct = product_id !== undefined && product_id !== null;
  const hasCategory = category_id !== undefined && category_id !== null;

  if (!hasProduct && !hasCategory) {
    return res.status(400).json({
      message: 'Selecciona un producto o una categoría para la promoción.',
    });
  }

  if (hasProduct && hasCategory) {
    return res.status(400).json({
      message: 'Selecciona solo un producto o una categoría, no ambos.',
    });
  }

  if (!discount_type) {
    return res.status(400).json({
      message: 'Selecciona un tipo de descuento.',
    });
  }

  const validDiscountTypes = ['PORCENTAJE', 'MONTO_FIJO'];

  if (!validDiscountTypes.includes(discount_type)) {
    return res.status(400).json({
      message: 'El tipo de descuento seleccionado no es válido.',
    });
  }

  if (
    discount_value === undefined ||
    discount_value === null ||
    discount_value === ''
  ) {
    return res.status(400).json({
      message: 'Ingresa el valor del descuento.',
    });
  }

  const numericDiscountValue = Number(discount_value);

  if (
    Number.isNaN(numericDiscountValue) ||
    numericDiscountValue <= 0
  ) {
    return res.status(400).json({
      message: 'El valor del descuento debe ser mayor que 0.',
    });
  }

  if (
    discount_type === 'PORCENTAJE' &&
    (numericDiscountValue < 1 || numericDiscountValue > 100)
  ) {
    return res.status(400).json({
      message: 'El porcentaje de descuento debe estar entre 1 y 100.',
    });
  }

  if (!start_date || !end_date) {
    return res.status(400).json({
      message: 'Selecciona la fecha de inicio y la fecha de fin.',
    });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return res.status(400).json({
      message: 'Revisa las fechas ingresadas e inténtalo nuevamente.',
    });
  }

  if (endDate <= startDate) {
    return res.status(400).json({
      message: 'La fecha de fin debe ser posterior a la fecha de inicio.',
    });
  }

  next();
};

module.exports = {
  validateCreatePromotion,
};