const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('request-saved-countries');
});

// === Header Button Event Listeners ===
document.getElementById("homeBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("plannerBtn").addEventListener("click", () => {
  window.location.href = "planner.html";  //direct navigation
});

document.getElementById("exploreBtn").addEventListener("click", () => {
  window.location.href = "explore.html";
});

ipcRenderer.on('send-saved-countries', (event, savedCountries) => {
  const plannerDiv = document.getElementById('plannerList');
  plannerDiv.innerHTML = '';

  if (savedCountries.length === 0) {
    plannerDiv.innerHTML = '<p>No countries saved yet.</p>';
    return;
  }

  savedCountries.forEach((country, index) => {
    const card = document.createElement('div');
    card.className = 'country-card';
    card.style = 'border:1px solid #ccc; padding:10px; margin:10px;';

    card.innerHTML = `
      <img src="${country.flagUrl}" alt="Flag" width="50">
      <h3>${country.name}</h3>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Currency:</strong> ${country.currencies}</p>
      <label>Month:
        <input type="month" value="${country.month || ''}" id="month-${index}">
      </label><br>
      <label>Notes:
        <textarea id="notes-${index}" rows="3">${country.notes || ''}</textarea>
      </label><br>
      <button id="update-${index}">🔄 Update</button>
      <button id="delete-${index}">🗑️ Delete</button>
    `;

    plannerDiv.appendChild(card);

    document.getElementById(`update-${index}`).addEventListener('click', () => {
      const updatedMonth = document.getElementById(`month-${index}`).value;
      const updatedNotes = document.getElementById(`notes-${index}`).value.trim();

      ipcRenderer.send('update-country', {
        index,
        updated: {
          ...country,
          month: updatedMonth,
          notes: updatedNotes
        }
      });
    });

    document.getElementById(`delete-${index}`).addEventListener('click', () => {
      if (confirm(`Delete ${country.name} from your planner?`)) {
        ipcRenderer.send('delete-country', index);
      }
    });
  });
});

ipcRenderer.on('refresh-planner', () => {
  window.location.reload();
});