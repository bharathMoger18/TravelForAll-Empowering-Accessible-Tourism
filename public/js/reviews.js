/* eslint-disable */
// Assumes axios is loaded via CDN and available globally

// Submit or Update Review
async function submitReview(e) {
  e.preventDefault();

  const form = e.target;
  const tourIdInput = form.querySelector('input[name="tourId"]');
  const reviewId = form.dataset.id;

  const rating = form.querySelector('select[name="rating"]').value;
  const review = form.querySelector('textarea[name="review"]').value;

  try {
    if (reviewId) {
      // Update review
      await axios.patch(`/api/v1/reviews/${reviewId}`, {
        rating,
        review
      });

      alert('✅ Review updated!');
    } else {
      const tourId = tourIdInput.value;
      await axios.post('/api/v1/reviews', {
        tour: tourId,
        rating,
        review
      });

      alert('✅ Review submitted!');
    }

    window.location.reload();
  } catch (err) {
    console.error((err.response && err.response.data) || err.message);
    alert('❌ Failed to submit review.');
  }
}

// Delete Review
async function deleteReview(reviewId) {
  const confirmed = confirm('Are you sure you want to delete this review?');
  if (!confirmed) return;

  try {
    await axios.delete(`/api/v1/reviews/${reviewId}`);
    alert('🗑️ Review deleted.');
    window.location.reload();
  } catch (err) {
    console.error((err.response && err.response.data) || err.message);
    alert('❌ Failed to submit review.');
  }
}

// Attach listeners after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.review-form').forEach(form => {
    form.addEventListener('submit', submitReview);
  });

  document.querySelectorAll('.delete-review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const reviewId = btn.dataset.reviewId;
      deleteReview(reviewId);
    });
  });
});
