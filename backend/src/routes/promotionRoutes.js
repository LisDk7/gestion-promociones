const express = require('express');

const promotionController = require('../controllers/promotionController');

const {
  validateCreatePromotion,
} = require('../middlewares/promotionValidation');

const {
  validatePromotionStatus,
} = require('../middlewares/promotionStatusValidation');

const router = express.Router();

router.get('/', promotionController.getPromotions);

router.post(
  '/',
  validateCreatePromotion,
  promotionController.createPromotion
);

router.patch(
  '/:id/status',
  validatePromotionStatus,
  promotionController.updatePromotionStatus
);

router.delete('/:id', promotionController.deletePromotion);

router.get('/summary', promotionController.getPromotionsSummary);

router.get('/:id', promotionController.getPromotionById);

module.exports = router;