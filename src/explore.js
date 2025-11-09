const { ipcRenderer } = require('electron');

const destinations = [
  {
    name: "Maldives",
    description: "Tropical paradise with clear blue waters and white sandy beaches.",
    image: "https://images.unsplash.com/photo-1574226780565-388f10f8121e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbGRpdmVzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    capital: "Malé",
    currency: "Rufiyaa (MVR)",
    flag: "https://flagcdn.com/w320/mv.png"
  },
  {
    name: "Japan",
    description: "Where modern cities meet ancient traditions.",
    image: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amFwYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    capital: "Tokyo",
    currency: "Yen (¥)",
    flag: "https://flagcdn.com/w320/jp.png"
  },
  {
    name: "Switzerland",
    description: "Home of the Alps, chocolate, and stunning mountain lakes.",
    image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3dpdHplcmxhbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    capital: "Bern",
    currency: "Swiss Franc (CHF)",
    flag: "https://flagcdn.com/w320/ch.png"
  },
  {
    name: "Greece",
    description: "Ancient ruins, blue domes, and island sunsets.",
    image: "https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZWNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    capital: "Athens",
    currency: "Euro (€)",
    flag: "https://flagcdn.com/w320/gr.png"
  },
  {
    name: "New Zealand",
    description: "Adventure and nature in one breathtaking country.",
    image: "https://images.unsplash.com/photo-1508971607899-a238a095d417?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5ldyUyMHplYWxhbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    capital: "Wellington",
    currency: "NZ Dollar ($)",
    flag: "https://flagcdn.com/w320/nz.png"
  }
];

const galleryGrid = document.getElementById('galleryGrid');

// Render destination cards
destinations.forEach(dest => {
  const card = document.createElement('div');
  card.className = 'destination-card';
  card.innerHTML = `
    <img src="${dest.image}" alt="${dest.name}">
    <div class="destination-info">
      <h3>${dest.name}</h3>
      <p>${dest.description}</p>
      <button class="add-btn">Add to My Planner</button>
    </div>
  `;

  card.querySelector('.add-btn').addEventListener('click', () => {
    const travelData = {
      name: dest.name,
      capital: dest.capital,
      currencies: dest.currency,
      flagUrl: dest.flag,
      month: "",
      notes: ""
    };
    ipcRenderer.send('save-country', travelData);
    alert(`${dest.name} has been added to your planner!`);
  });

  galleryGrid.appendChild(card);
});

// Navigation
document.getElementById('homeBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});
document.getElementById("plannerBtn").addEventListener("click", () => {
  window.location.href = "planner.html";  // Changed from IPC to direct navigation
});
