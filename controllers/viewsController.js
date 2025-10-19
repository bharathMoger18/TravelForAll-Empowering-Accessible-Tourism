const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AccessibilityRequest = require('../models/accessibilityRequestModel');
const Review = require('../models/reviewModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find().lean();

  const bookings = await Booking.aggregate([
    {
      $group: {
        _id: '$tour',
        booked: { $sum: '$numTravellers' }
      }
    }
  ]);

  const bookingMap = {};
  bookings.forEach(b => {
    bookingMap[b._id.toString()] = b.booked;
  });

  const toursWithSeats = tours.map(tour => {
    const booked = bookingMap[tour._id.toString()] || 0;
    const remainingSeats = Math.max(tour.maxGroupSize - booked, 0);
    return {
      ...tour,
      remainingSeats
    };
  });

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: toursWithSeats
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      select: 'review rating user'
    })
    .populate({
      path: 'tourLead',
      select: 'name email role photo'
    })
    .populate({
      path: 'tourGuides',
      select: 'name email role photo'
    });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  const bookings = await Booking.aggregate([
    { $match: { tour: tour._id } },
    { $group: { _id: '$tour', total: { $sum: '$numTravellers' } } }
  ]);

  const totalBooked = bookings.length > 0 ? bookings[0].total : 0;
  const remainingSeats = Math.max(tour.maxGroupSize - totalBooked, 0);

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour: {
      ...tour._doc,
      remainingSeats,
      reviews: tour.reviews
    }
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIDs = bookings.map(el => el.tour._id || el.tour);

  const tours = await Tour.find({ _id: { $in: tourIDs } });

  // Compute remaining seats
  const allBookings = await Booking.aggregate([
    {
      $group: {
        _id: '$tour',
        totalBooked: { $sum: '$numTravellers' }
      }
    }
  ]);

  const bookingMap = {};
  allBookings.forEach(b => {
    bookingMap[b._id.toString()] = b.totalBooked;
  });

  const toursWithSeats = tours.map(tour => {
    const booked = bookingMap[tour._id.toString()] || 0;
    const remainingSeats = Math.max(tour.maxGroupSize - booked, 0);
    return {
      ...tour._doc,
      remainingSeats
    };
  });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours: toursWithSeats,
    isMyTours: true
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

// Show admin all accessibility requests
exports.getAccessibilityRequests = catchAsync(async (req, res, next) => {
  const requests = await AccessibilityRequest.find().populate('user tour');

  res.status(200).render('adminAccessibility', {
    title: 'Manage Accessibility Requests',
    requests
  });
});

// Show logged-in user their own accessibility requests
exports.getMyAccessibilityRequests = catchAsync(async (req, res, next) => {
  const requests = await AccessibilityRequest.find({
    user: req.user.id
  }).populate('tour');

  res.status(200).render('myAccessibility', {
    title: 'My Accessibility Requests',
    requests
  });
});

// ADMIN: View all tours to manage
exports.getManageTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find(); // get all tours

  res.status(200).render('manageTours', {
    title: 'Manage Tours',
    tours
  });
});

// controllers/viewsController.js
exports.getManageToursDashboard = (req, res) => {
  res.status(200).render('manageToursDashboard', {
    title: 'Manage Tours'
  });
};

// ✅ Admin Create Tour Page
exports.getCreateTourForm = catchAsync(async (req, res, next) => {
  const tourLeads = await User.find({ role: 'lead-guide' }).select('name');
  const tourGuides = await User.find({ role: 'guide' }).select('name');

  res.status(200).render('createTour', {
    title: 'Create a New Tour',
    tourLeads,
    tourGuides
  });
});

exports.renderUpdateTourForm = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('updateTour', {
    title: 'Update Tour',
    tours,
    alert: req.query.alert
  });
});

exports.renderDeleteTourForm = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('deleteTour', {
    title: 'Delete Tour',
    tours,
    alert: req.query.alert
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') res.locals.alert = 'Your booking was successful!';
  if (alert === 'updated') res.locals.alert = 'Tour successfully updated!';
  if (alert === 'deleted') res.locals.alert = 'Tour deleted successfully!';
  next();
};

exports.getManageUsersDashboard = (req, res) => {
  res.status(200).render('manageUsersDashboard', {
    title: 'Manage Users'
  });
};

exports.getManageUsersPage = catchAsync(async (req, res, next) => {
  const type = req.query.type || 'users';
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  let filter = { role: { $ne: 'admin' } };

  if (type === 'guides') {
    filter = { role: { $in: ['guide', 'lead-guide'] } };
  }

  const users = await User.find(filter)
    .select('name email role photo')
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users,
    currentPage: page,
    totalPages,
    type,
    alert: req.query.alert
  });
});

// controllers/viewsController.js
// controllers/viewsController.js
exports.getManageBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find().populate('tour');

  // Group bookings by tour
  const statsMap = new Map();
  let totalRevenue = 0;

  bookings.forEach(booking => {
    const tourName =
      booking.tour && booking.tour.name ? booking.tour.name : 'Unknown Tour';
    const current = statsMap.get(tourName) || { count: 0, revenue: 0 };

    statsMap.set(tourName, {
      count: current.count + 1,
      revenue: current.revenue + booking.price
    });

    totalRevenue += booking.price;
  });

  const chartData = {
    labels: Array.from(statsMap.keys()),
    counts: Array.from(statsMap.values()).map(val => val.count),
    revenues: Array.from(statsMap.values()).map(val => val.revenue)
  };

  res.status(200).render('manageBookings', {
    title: 'Manage Bookings',
    totalBookings: bookings.length,
    totalRevenue,
    chartData: JSON.stringify(chartData)
  });
});

// controllers/viewsController.js
exports.getBillingPage = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('tour');

  const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0);

  res.status(200).render('billing', {
    title: 'Billing & Payments',
    bookings,
    totalSpent
  });
});

exports.getMyReviewsPage = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('tour');
  const reviews = await Review.find({ user: req.user.id }).populate('tour');

  const reviewedTourIds = reviews.map(r => r.tour._id.toString());

  const unreviewedTours = bookings
    .filter(b => b.tour && !reviewedTourIds.includes(b.tour._id.toString()))
    .map(b => b.tour);

  res.status(200).render('myReviews', {
    title: 'My Reviews',
    reviews,
    unreviewedTours
  });
});

// For admin to see all reviews
// ✅ Render all reviews for admin
exports.getManageReviewsPage = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
    .populate({ path: 'tour', select: 'name' })
    .populate({ path: 'user', select: 'name' });

  res.status(200).render('manageReviews', {
    title: 'Manage Reviews',
    reviews
  });
});
