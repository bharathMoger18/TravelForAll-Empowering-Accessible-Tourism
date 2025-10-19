const express = require('express');
const bodyParser = require('body-parser');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);
// ✅ Must be logged in for checkout
router.use(authController.protect);

// ✅ Used by Stripe redirection from client
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// ✅ Admin and Lead Guide access only
router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
