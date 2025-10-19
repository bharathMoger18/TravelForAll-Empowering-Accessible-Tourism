/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51RAoIaLZCUfoBXO0F9zBP6RnyPWtIUpXNQM6IHqZdk9ZRHTs54YKhGhJDzjp3lgMqdzu2MLskljgPPk693ezeT1m00Oqy74xvm'
);

export const bookTour = async tourId => {
  if (!tourId) {
    console.error('❌ Tour ID is undefined');
    showAlert('error', 'Invalid tour. Please try again.');
    return;
  }

  try {
    const numTravellersInput = document.getElementById('numTravellers');
    const numTravellers = numTravellersInput ? numTravellersInput.value : 1;

    const sessionRes = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}?numTravellers=${numTravellers}`
    );

    await stripe.redirectToCheckout({
      sessionId: sessionRes.data.session.id
    });
  } catch (err) {
    console.error('Error redirecting to Stripe:', err);
    showAlert(
      'error',
      (err.response && err.response.data && err.response.data.message) ||
        'Payment failed. Try again.'
    );
  }
};
