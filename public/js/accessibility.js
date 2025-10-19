/* eslint-disable */
const form = document.getElementById('accessibility-form');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const wheelchair = document.getElementById('wheelchair').checked;
    const personalAssistance = document.getElementById('personalAssistance')
      .checked;
    const signLanguageSupport = document.getElementById('signLanguageSupport')
      .checked;

    const realTourId = document.getElementById('realTourId').value;

    try {
      await axios.post(`/api/v1/accessibility/${realTourId}`, {
        wheelchair,
        personalAssistance,
        signLanguageSupport
      });

      alert('✅ Accessibility request submitted successfully!');
    } catch (err) {
      const errorMsg =
        err && err.response && err.response.data ? err.response.data : err;
      console.error(errorMsg);
      alert('❌ Failed to submit accessibility request.');
    }
  });
}
