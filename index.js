const { ipcRenderer } = require('electron');
const searchBtn = document.getElementById('searchBtn');
const resultDisplay = document.getElementById('resultDisplay');
const modal = document.getElementById('popupModal');
const closeModal = document.getElementById('closeModal');
let currentCountryData = null;

// === Country search ===
searchBtn.addEventListener('click', () => {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return alert('Please enter a country name.');
  fetchCountry(query);
});

// === Home button redirect ===
document.getElementById("homeBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

// === Planner button redirect ===
document.getElementById("plannerBtn").addEventListener("click", () => {
  window.location.href = "planner.html";  //direct navigation
});

// === Beautiful Destinations button redirect ===
document.getElementById("exploreBtn").addEventListener("click", () => {
  window.location.href = "explore.html";
});

// === Handle popular destination click ===
document.querySelectorAll('.destination-card').forEach(card => {
  card.addEventListener('click', () => {
    const country = card.dataset.country;
    document.getElementById('searchInput').value = country;
    fetchCountry(country);
  });
});

// === Fetch Country Data ===
async function fetchCountry(query) {
  resultDisplay.innerHTML = '<p>Loading...</p>'; // Added loading indicator
  const encodedQuery = encodeURIComponent(query); // URL-encode the query
  const apiUrl = `https://restcountries.com/v3.1/name/${encodedQuery}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`); // Check HTTP status
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) throw new Error('Country not found');

    const c = data[0];
    const languages = Object.values(c.languages || {});
    const currencyData = Object.values(c.currencies || [{}]);
    const mapUrl = c.maps?.googleMaps || '#';

    resultDisplay.innerHTML = `
      <h2>${c.name.common}</h2>
      <div class="images">
        <img src="${c.flags?.png}" alt="Flag of ${c.name.common}" width="150">
        ${c.coatOfArms?.png ? `<img src="${c.coatOfArms.png}" alt="Coat of Arms" width="100">` : ''}
      </div>
      <p>Continent: ${c.continents}</p>
      <p>Region / Subregion: ${c.region} | ${c.subregion}</p>
      <p>Time Zones: ${c.timezones?.join(', ')}</p>
      <p>Capital: ${c.capital}</p>
      <p>Languages: ${languages.join(', ')}</p>
      <p>Currencies: ${currencyData[0]?.symbol || ''} ${currencyData[0]?.name || ''}</p>
      <p>Population: ${c.population?.toLocaleString()}</p>
      <p>Area: ${c.area?.toLocaleString()} km²</p>
      <p><strong>Map:</strong> 
         <a href="${mapUrl}" target="_blank">Open in Google Maps</a>
      </p>
    `;

    // === Border Countries ===
    if (c.borders && c.borders.length > 0) {
      const borderPromises = c.borders.map(async (code) => {
        try {
          const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
          const borderData = await res.json();
          return borderData[0].name.common;
        } catch {
          return `Error loading ${code}`;
        }
      });

      const borderNames = await Promise.all(borderPromises);
      resultDisplay.innerHTML += `
        <p><strong>Borders:</strong></p>
        <ul>
          ${borderNames.map(name => `<li>${name}</li>`).join('')}
        </ul>
      `;
    } else {
      resultDisplay.innerHTML += `<p><strong>Borders:</strong> No bordering countries.</p>`;
    }

    resultDisplay.innerHTML += `<button id="saveCountryBtn">Add to Plan</button>`;

    document.getElementById('saveCountryBtn').addEventListener('click', () => {
      currentCountryData = {
        name: c.name.common,
        capital: c.capital,
        currencies: `${currencyData[0]?.symbol || ''} ${currencyData[0]?.name || ''}`,
        flagUrl: c.flags?.png
      };
      openModal();
    });

  } catch (error) {
    console.error('Fetch error:', error); // Added logging for debugging
    resultDisplay.innerHTML = `<div class="error-message">❌ ${error.message}. Please try another name or check your connection.</div>`;
  }
}

// === Modal controls ===
function openModal() { modal.style.display = 'flex'; }

closeModal.addEventListener('click', () => modal.style.display = 'none');

window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

// === Confirm Save ===
document.getElementById('confirmSaveBtn').addEventListener('click', () => {
  const month = document.getElementById('monthInput').value;
  const notes = document.getElementById('notesInput').value.trim();
  if (!month || !notes) return alert('Please fill in both month and notes.');

  ipcRenderer.send('save-country', { ...currentCountryData, month, notes });
  alert('Country saved!');
  modal.style.display = 'none';
});