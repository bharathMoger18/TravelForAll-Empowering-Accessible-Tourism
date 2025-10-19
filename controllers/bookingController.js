const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pug = require('pug');
const htmlToText = require('html-to-text');
const fs = require('fs');

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Email = require('../utils/email');
const { generateInvoice } = require('../utils/invoice');

const FALLBACK_IMAGE_URL =
  'https://res.cloudinary.com/dew4bmwif/image/upload/v1750138637/default_ubo5gh.jpg';

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const requested = parseInt(req.query.numTravellers || '1', 10);

  const tour = await Tour.findById(tourId);
  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });

  const existing = await Booking.aggregate([
    { $match: { tour: tour._id } },
    { $group: { _id: '$tour', total: { $sum: '$numTravellers' } } }
  ]);

  const booked =
    existing.length > 0 && typeof existing[0].total === 'number'
      ? existing[0].total
      : 0;

  if (booked + requested > tour.maxGroupSize) {
    return res.status(400).json({
      status: 'fail',
      message:
        'Booking exceeds maximum group size. Please reduce the number of travellers.'
    });
  }

  const imageUrl =
    tour.imageCover && tour.imageCover.startsWith('http')
      ? tour.imageCover
      : FALLBACK_IMAGE_URL;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: tourId,
    metadata: {
      numTravellers: requested.toString()
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100 * requested,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [imageUrl]
          }
        },
        quantity: 1
      }
    ]
  });

  res.status(200).json({ status: 'success', session });
});
const createBookingCheckout = async session => {
  const tourId = session.client_reference_id;
  const userDoc = await User.findOne({ email: session.customer_email });
  if (!userDoc) return console.warn('⚠️ User not found for session');

  const user = userDoc.id;
  const price = session.amount_total / 100;
  const numTravellers = parseInt(session.metadata.numTravellers || '1', 10);

  // ✅ Create booking in DB
  const booking = await Booking.create({
    tour: tourId,
    user,
    price,
    numTravellers
  });

  // ✅ Generate invoice
  const tour = await Tour.findById(tourId);
  const url = `${process.env.BASE_URL}/my-tours`;

  let invoicePath;
  try {
    invoicePath = await generateInvoice(booking, tour, userDoc);

    const email = new Email(userDoc, url);
    const html = pug.renderFile(
      `${__dirname}/../views/email/bookingConfirmation.pug`,
      {
        firstName: userDoc.name.split(' ')[0],
        url,
        subject: `Your booking for ${tour.name} is confirmed!`,
        tour
      }
    );

    await email.newTransport().sendMail({
      from: email.from,
      to: email.to,
      subject: `Your booking for ${tour.name} is confirmed!`,
      html,
      text: htmlToText.fromString(html),
      attachments: [
        {
          filename: `invoice-${booking._id}.pdf`,
          path: invoicePath
        }
      ]
    });

    fs.unlink(invoicePath, err => {
      if (err) console.error('❌ Failed to delete invoice PDF:', err.message);
    });
  } catch (err) {
    console.error('❌ Email failed but booking saved:', err.message);
  }
};

exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    await createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
