console.log('✅ accessibilityRoutes.js is loaded');

const express = require('express');
const accessibilityController = require('../controllers/accessibilityController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/test', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Test route working' });
});

// POST /api/v1/accessibility/:tourId
router
  .route('/:tourId')
  .post(authController.protect, accessibilityController.createRequest);

// GET /api/v1/accessibility (admin only)
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    accessibilityController.getAllRequests
  );

module.exports = router;
