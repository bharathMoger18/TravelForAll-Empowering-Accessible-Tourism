const showAlert = (type, msg, time = 7) => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(() => {
    const el = document.querySelector('.alert');
    if (el) el.remove();
  }, time * 1000);
};

const tourCreateForm = document.getElementById('tourCreateForm');

tourCreateForm?.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = new FormData();

  const name = document.getElementById('name').value.trim();
  const duration = +document.getElementById('duration').value;
  const maxGroupSize = +document.getElementById('maxGroupSize').value;
  const difficulty = document.getElementById('difficulty').value;
  const ratingsAverage = +document.getElementById('ratingsAverage').value;
  const ratingsQuantity = +document.getElementById('ratingsQuantity').value;
  const price = +document.getElementById('price').value;
  const priceDiscount = +document.getElementById('priceDiscount').value;
  const summary = document.getElementById('summary').value.trim();
  const description = document.getElementById('description').value.trim();
  const address = document.getElementById('address').value.trim();
  const locationDescription = document
    .getElementById('locationDescription')
    .value.trim();
  const coordinates = document
    .getElementById('coordinates')
    .value.trim()
    .split(',')
    .map(c => parseFloat(c.trim()));

  if (coordinates.length !== 2 || coordinates.some(isNaN)) {
    return showAlert('error', 'Please provide valid coordinates (lng, lat)');
  }

  const startLocation = {
    type: 'Point',
    coordinates,
    address,
    description: locationDescription
  };

  const startDates = Array.from(document.querySelectorAll('.startDate'))
    .map(input => input.value)
    .filter(Boolean);

  const imageCover = document.getElementById('imageCover')?.files[0];
  const images = document.getElementById('images')?.files;

  // ✅ ✅ ✅ FIX: Get tourLead
  const tourLead = document.getElementById('tourLead').value;

  // ✅ ✅ ✅ FIX: Get all checked tourGuides
  const tourGuideElements = document.querySelectorAll(
    'input[name="tourGuides"]:checked'
  );
  const tourGuides = Array.from(tourGuideElements).map(el => el.value);

  // ✅ ✅ ✅ Add to FormData
  formData.append('name', name);
  formData.append('duration', duration);
  formData.append('maxGroupSize', maxGroupSize);
  formData.append('difficulty', difficulty);
  formData.append('ratingsAverage', ratingsAverage);
  formData.append('ratingsQuantity', ratingsQuantity);
  formData.append('price', price);
  if (!isNaN(priceDiscount)) formData.append('priceDiscount', priceDiscount);
  formData.append('summary', summary);
  formData.append('description', description);
  formData.append('startLocation', JSON.stringify(startLocation));
  startDates.forEach(date => formData.append('startDates', date));
  if (imageCover) formData.append('imageCover', imageCover);
  if (images?.length) {
    Array.from(images).forEach(img => formData.append('images', img));
  }

  // ✅ ✅ ✅ These were missing
  formData.append('tourLead', tourLead);
  tourGuides.forEach(guideId => formData.append('tourGuides', guideId));

  try {
    const res = await fetch('/api/v1/tours', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      showAlert('success', 'Tour created!');
      setTimeout(() => location.assign('/'), 1500);
    } else {
      showAlert('error', result.message || 'Failed to create tour');
    }
  } catch (err) {
    showAlert('error', 'Something went wrong.');
  }
});
