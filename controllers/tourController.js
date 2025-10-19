const multer = require('multer');
const { storage } = require('./../utils/cloudinary');
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

const upload = multer({ storage });

exports.uploadTourImages = upload.any();

exports.resizeTourImages = (req, res, next) => {
  next(); // resizing is handled by Cloudinary
};

exports.createTour = catchAsync(async (req, res, next) => {
  console.log('BODY:', req.body);
  console.log('FILES:', req.files);

  // ✅ Extract Cloudinary file paths
  const cover = req.files.find(f => f.fieldname === 'imageCover');
  if (cover) req.body.imageCover = cover.path;

  req.body.images = req.files
    .filter(f => f.fieldname === 'images')
    .map(f => f.path);

  // ✅ Parse JSON location
  if (req.body.startLocation && typeof req.body.startLocation === 'string') {
    req.body.startLocation = JSON.parse(req.body.startLocation);
  }

  // ✅ Normalize tourGuides (can be single or multiple)
  if (req.body.tourGuides && !Array.isArray(req.body.tourGuides)) {
    req.body.tourGuides = [req.body.tourGuides];
  }

  // ✅ Ensure tourLead was submitted!
  if (!req.body.tourLead) {
    return next(new AppError('A tour must have a lead guide!', 400));
  }

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newTour
    }
  });
});

// ✅ Get All Tours with Remaining Seats
exports.getAllTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  const bookings = await Booking.aggregate([
    {
      $group: {
        _id: '$tour',
        totalBooked: { $sum: '$numTravellers' }
      }
    }
  ]);

  const bookingMap = {};
  bookings.forEach(b => {
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

  res.status(200).json({
    status: 'success',
    results: toursWithSeats.length,
    data: {
      data: toursWithSeats
    }
  });
});

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    { $sort: { avgPrice: 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: -1 } },
    { $limit: 12 }
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan }
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in lat,lng format.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius]
      }
    }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { data: tours }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in lat,lng format.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: { data: distances }
  });
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.handleUpdateTour = catchAsync(async (req, res, next) => {
  const { tourId, price, maxGroupSize, duration } = req.body;

  if (!tourId) {
    return next(new AppError('Please provide a tour ID.', 400));
  }

  const updateFields = {};
  if (price) updateFields.price = price;
  if (maxGroupSize) updateFields.maxGroupSize = maxGroupSize;
  if (duration) updateFields.duration = duration;

  const updatedTour = await Tour.findByIdAndUpdate(tourId, updateFields, {
    new: true,
    runValidators: true
  });

  if (!updatedTour) {
    return next(new AppError('Tour not found.', 404));
  }

  res.redirect('/admin/update-tour?alert=updated');
});

exports.handleDeleteTour = catchAsync(async (req, res, next) => {
  const { tourId } = req.body;

  if (!tourId) {
    return next(new AppError('Please provide a tourId to delete.', 400));
  }

  const deleted = await Tour.findByIdAndDelete(tourId);

  if (!deleted) {
    return next(new AppError('Tour not found.', 404));
  }

  // ✅ Redirect with success message
  res.redirect('/admin/delete-tour?alert=Tour deleted successfully!');
});
