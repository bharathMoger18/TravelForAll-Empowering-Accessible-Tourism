const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// ✅ Set user and tour if not provided in body
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// ✅ Create review with error logging
exports.createReview = catchAsync(async (req, res, next) => {
  try {
    console.log('📩 Incoming Review Body:', req.body);

    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview
      }
    });
  } catch (err) {
    // Handle duplicate review error (user already reviewed tour)
    if (err.code === 11000) {
      return next(
        new AppError('You have already submitted a review for this tour.', 400)
      );
    }

    console.error('❌ Error creating review:', err);
    return next(new AppError('Failed to create review.', 500));
  }
});

// ✅ Other review operations using factory handlers
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
