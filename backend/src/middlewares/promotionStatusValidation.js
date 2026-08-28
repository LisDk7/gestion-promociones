const validatePromotionStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      message: 'Selecciona el nuevo estado de la promoción.',
    });
  }

  const validStatuses = ['PROGRAMADA', 'ACTIVA', 'FINALIZADA'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: 'El estado seleccionado no es válido.',
    });
  }

  next();
};

module.exports = {
  validatePromotionStatus,
};