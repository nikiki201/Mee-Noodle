const reservationList = document.getElementById('reservation-list');
const reservationCount = document.getElementById('reservation-count');
const reservationEmpty = document.getElementById('reservation-empty');
const searchInput = document.getElementById('reservation-search');
let reservations = [];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function deleteReservation(id) {
  const confirmed = window.confirm('Supprimer cette reservation ? Cette action est irreversible.');
  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/reservations/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || 'Impossible de supprimer la reservation.');
    }

    reservations = reservations.filter((reservation) => reservation.id !== id);
    filterReservations(searchInput.value);
  } catch (error) {
    window.alert(error.message);
    console.error(error);
  }
}

function renderReservations(items) {
  reservationList.innerHTML = '';

  if (!items.length) {
    reservationEmpty.hidden = false;
    reservationCount.textContent = '0 reservation trouvee';
    return;
  }

  reservationEmpty.hidden = true;
  reservationCount.textContent = `${items.length} reservation${items.length > 1 ? 's' : ''}`;

  items.forEach((reservation) => {
    const card = document.createElement('article');
    card.className = 'reservation-card';
    card.innerHTML = `
      <div class="reservation-card-header">
        <div>
          <h3>${escapeHtml(reservation.name)}</h3>
          <p class="mute">${escapeHtml(reservation.email)} · ${escapeHtml(reservation.phone || 'Pas de telephone')}</p>
        </div>
        <span class="pill">${escapeHtml(reservation.guests)} pers.</span>
      </div>
      <div class="reservation-card-body">
        <p><strong>Date :</strong> ${escapeHtml(reservation.date)} a ${escapeHtml(reservation.time)}</p>
        <p><strong>Creee le :</strong> ${formatDate(reservation.created_at)}</p>
        <p><strong>Message :</strong> ${escapeHtml(reservation.message || 'Aucun message')}</p>
      </div>
      <div class="reservation-card-actions">
        <button class="button button-danger" type="button" data-delete-id="${reservation.id}">Supprimer</button>
      </div>
    `;
    reservationList.appendChild(card);
  });
}

function filterReservations(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    renderReservations(reservations);
    return;
  }

  const filtered = reservations.filter((item) => {
    return [
      item.name,
      item.email,
      item.phone,
      item.date,
      item.time,
      item.message,
    ].some((value) => value && value.toString().toLowerCase().includes(normalized));
  });

  renderReservations(filtered);
}

async function loadReservations() {
  try {
    const response = await fetch('/api/reservations');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Impossible de charger les reservations.');
    }

    const newReservations = Array.isArray(data) ? data : [];
    
    // Détecter les nouvelles réservations
    const newIds = new Set(newReservations.map(r => r.id));
    const oldIds = new Set(reservations.map(r => r.id));
    const hasNewReservations = newReservations.some(r => !oldIds.has(r.id));
    
    reservations = newReservations;
    renderReservations(reservations);
    
    // Notifier si une nouvelle réservation a été ajoutée
    if (hasNewReservations && oldIds.size > 0) {
      showNotification('Une nouvelle réservation a été ajoutée !');
    }
  } catch (error) {
    reservationCount.textContent = 'Erreur de chargement';
    reservationEmpty.hidden = false;
    reservationEmpty.textContent = 'Impossible de charger les reservations. Veuillez reessayer plus tard.';
    console.error(error);
  }
}

function showNotification(message) {
  let notification = document.getElementById('auto-refresh-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'auto-refresh-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4caf50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease-in-out;
    `;
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Ajouter les styles pour l'animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

searchInput.addEventListener('input', (event) => {
  filterReservations(event.target.value);
});

reservationList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-delete-id]');
  if (!button) {
    return;
  }

  deleteReservation(Number.parseInt(button.dataset.deleteId, 10));
});

// Charger les réservations au démarrage
loadReservations();

// Actualiser toutes les 5 secondes
setInterval(loadReservations, 5000);
