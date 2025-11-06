const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
}

function createPlannerWindow() {
  const plannerWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  plannerWindow.loadFile(path.join(__dirname, 'planner.html'));
  plannerWindow.webContents.openDevTools();
}

// Optional: fallback if itinerary window isn't defined
function createItineraryWindow(country) {
  const itineraryWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  itineraryWindow.loadFile(path.join(__dirname, 'itinerary.html')); // Make sure this file exists
  itineraryWindow.webContents.openDevTools();
}

// === Utility: Ensure file exists ===
function ensureFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
}

// === File paths ===
const countryFile = path.join(app.getPath('userData'), 'saved_countries.json');
const itineraryFile = path.join(app.getPath('userData'), 'plan.json');

// === Save country ===
ipcMain.on('save-country', (event, data) => {
  ensureFile(countryFile);
  let savedCountries = JSON.parse(fs.readFileSync(countryFile));
  savedCountries.push(data);
  fs.writeFileSync(countryFile, JSON.stringify(savedCountries, null, 2));
  console.log(`Country saved: ${data.name}`);
});

// === Request saved countries ===
ipcMain.on('request-saved-countries', (event) => {
  ensureFile(countryFile);
  const savedCountries = JSON.parse(fs.readFileSync(countryFile));
  event.reply('send-saved-countries', savedCountries);
});

// === Update country ===
ipcMain.on('update-country', (event, { index, updated }) => {
  ensureFile(countryFile);
  const savedCountries = JSON.parse(fs.readFileSync(countryFile));
  savedCountries[index] = updated;
  fs.writeFileSync(countryFile, JSON.stringify(savedCountries, null, 2));
  event.reply('refresh-planner');
});

// === Delete country ===
ipcMain.on('delete-country', (event, index) => {
  ensureFile(countryFile);
  const savedCountries = JSON.parse(fs.readFileSync(countryFile));
  savedCountries.splice(index, 1);
  fs.writeFileSync(countryFile, JSON.stringify(savedCountries, null, 2));
  event.reply('refresh-planner');
});

// === Save itinerary ===
ipcMain.on('save-itinerary', (event, data) => {
  ensureFile(itineraryFile);
  const itineraries = JSON.parse(fs.readFileSync(itineraryFile));
  itineraries.push(data);
  fs.writeFileSync(itineraryFile, JSON.stringify(itineraries, null, 2));
  console.log('Itinerary saved to:', itineraryFile);
});

// === Open planner window ===
ipcMain.on('open-planner', () => {
  createPlannerWindow();
});

// === Open itinerary window ===
ipcMain.on('open-itinerary-window', (event, country) => {
  console.log('IPC received: open-itinerary-window with:', country);
  createItineraryWindow(country);
});

app.whenReady().then(createMainWindow);
