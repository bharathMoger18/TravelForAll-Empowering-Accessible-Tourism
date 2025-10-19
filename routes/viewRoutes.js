const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(viewsController.alerts);

// Public pages
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);

// Protected pages
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.get(
  '/my-accessibility-requests',
  authController.protect,
  viewsController.getMyAccessibilityRequests
);
router.get(
  '/admin/accessibility-requests',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getAccessibilityRequests
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

// Tours
router.get(
  '/manage-tours',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  viewsController.getManageToursDashboard
);
router.get(
  '/admin/create-tour',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  viewsController.getCreateTourForm
);
router.get(
  '/admin/update-tour',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  viewsController.renderUpdateTourForm
);
router.get(
  '/admin/delete-tour',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  viewsController.renderDeleteTourForm
);

// Users — Dashboard → Select View
// Admin: manage users dashboard
router.get(
  '/manage-users',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getManageUsersDashboard // Shows the choice buttons
);

// Admin: list users by type
router.get(
  '/manage-users/list',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getManageUsersPage // Uses `?type=users` or `?type=guides`
);

// Bookings
router.get(
  '/manage-bookings',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getManageBookings
);

router.get('/billing', authController.protect, viewsController.getBillingPage);

router.get(
  '/my-reviews',
  authController.protect,
  viewsController.getMyReviewsPage
);
router.get(
  '/manage-reviews',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getManageReviewsPage
);

router.post(
  '/admin/create-user',
  authController.protect,
  authController.restrictTo('admin'),
  userController.createUser
);

module.exports = router;
