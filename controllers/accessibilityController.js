const AccessibilityRequest = require('../models/accessibilityRequestModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// Create new request
exports.createRequest = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  const request = await AccessibilityRequest.create({
    user: req.user.id,
    tour: tourId,
    wheelchair: req.body.wheelchair || false,
    personalAssistance: req.body.personalAssistance || false,
    signLanguageSupport: req.body.signLanguageSupport || false
  });

  res.status(201).json({
    status: 'success',
    data: { request }
  });
});

// Admin can view all requests
exports.getAllRequests = catchAsync(async (req, res, next) => {
  const requests = await AccessibilityRequest.find();

  res.status(200).json({
    status: 'success',
    results: requests.length,
    data: { requests }
  });
});
