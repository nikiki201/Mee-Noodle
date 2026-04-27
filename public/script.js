const form = document.getElementById('reservation-form');
const status = document.getElementById('form-status');
const dateInput = form.querySelector('input[name="date"]');

function getTodayIsoDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function setDateConstraints() {
  dateInput.min = getTodayIsoDate();
}

setDateConstraints();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.style.color = '';
  setDateConstraints();

  if (dateInput.value && dateInput.value < dateInput.min) {
    status.textContent = "La date de reservation doit etre egale ou posterieure a aujourd'hui.";
    status.style.color = '#b23a2d';
    dateInput.focus();
    return;
  }

  status.textContent = 'Envoi en cours...';

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la reservation.');
    }

    status.textContent = 'Votre reservation a bien ete enregistree. Merci !';
    form.reset();
    setDateConstraints();
  } catch (error) {
    console.error('Erreur fetch:', error);
    status.textContent = `Echec : ${error.message}`;
    status.style.color = '#b23a2d';
  }
});
