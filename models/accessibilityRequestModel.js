const mongoose = require('mongoose');

const accessibilityRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Accessibility request must belong to a user']
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Accessibility request must belong to a tour']
  },
  wheelchair: {
    type: Boolean,
    default: false
  },
  personalAssistance: {
    type: Boolean,
    default: false
  },
  signLanguageSupport: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-populate user and tour details
accessibilityRequestSchema.pre(/^find/, function(next) {
  this.populate('user').populate('tour');
  next();
});

const AccessibilityRequest = mongoose.model(
  'AccessibilityRequest',
  accessibilityRequestSchema
);

module.exports = AccessibilityRequest;
