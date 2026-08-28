const promotionService = require('../services/promotionService');

const getPromotions = async (req, res) => {
  try {
    const promotions = await promotionService.getAllPromotions();

    res.status(200).json(promotions);
  } catch (error) {
    console.error('Error getting promotions:', error);

    res.status(500).json({
      message: 'Error al obtener las promociones',
    });
  }
};

const createPromotion = async (req, res) => {
  try {
    const promotion = await promotionService.createPromotion(req.body);

    res.status(201).json(promotion);
  } catch (error) {
    console.error('Error creating promotion:', error);

    res.status(500).json({
      message: 'Error al crear la promoción',
    });
  }
};

const updatePromotionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await promotionService.updatePromotionStatus(
      id,
      status
    );

    if (result.error === 'NOT_FOUND') {
      return res.status(404).json({
        message: 'No encontramos una promoción con ese ID.',
      });
    }

    if (result.error === 'INVALID_TRANSITION') {
      return res.status(400).json({
        message: `No puedes cambiar una promoción de ${result.currentStatus} a ${status}.`,
      });
    }

    res.status(200).json(result.promotion);
  } catch (error) {
    console.error('Error updating promotion status:', error);

    res.status(500).json({
      message: 'No pudimos actualizar el estado de la promoción.',
    });
  }
};

const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await promotionService.deletePromotion(id);

    if (result.error === 'NOT_FOUND') {
      return res.status(404).json({
        message: 'No encontramos una promoción con ese ID.',
      });
    }

    if (result.error === 'NOT_PROGRAMADA') {
      return res.status(400).json({
        message: `No puedes eliminar una promoción que está ${result.currentStatus}.`,
      });
    }

    return res.status(200).json({
      message: 'La promoción se eliminó correctamente.',
      id: result.id,
    });
  } catch (error) {
    console.error('Error deleting promotion:', error);

    res.status(500).json({
      message: 'No pudimos eliminar la promoción.',
    });
  }
};

const getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await promotionService.getPromotionById(id);

    if (!promotion) {
      return res.status(404).json({
        message: 'No encontramos una promoción con ese ID.',
      });
    }

    res.status(200).json(promotion);
  } catch (error) {
    console.error('Error getting promotion:', error);

    res.status(500).json({
      message: 'No pudimos obtener la promoción.',
    });
  }
};

const getPromotionsSummary = async (req, res) => {
  try {
    const summary = await promotionService.getPromotionsSummary();

    res.status(200).json(summary);
  } catch (error) {
    console.error('Error getting promotions summary:', error);

    res.status(500).json({
      message: 'No pudimos obtener el resumen de las promociones.',
    });
  }
};

module.exports = {
  getPromotions,
  createPromotion,
  updatePromotionStatus,
  deletePromotion,
  getPromotionById,
  getPromotionsSummary,
};