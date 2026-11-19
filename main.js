// Weather App JavaScript
// API: https://api.openweathermap.org/data/2.5/weather
// Icons: https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/

import { getCurrentWeather, getForecast, getDailyForecast } from "./weather.js";

import {
  createWeatherCard,
  updateMessage,
  updateCityCount,
  updateEmptyState,
  setLoading,
} from "./ui.js";

// =====================================
// DOM Elements
// =====================================

const form = document.getElementById("weatherForm");

const cityInput = document.getElementById("cityInput");

const searchBtn = document.getElementById("searchBtn");

const citiesContainer = document.getElementById("cities");

const message = document.getElementById("message");

const cityCount = document.getElementById("cityCount");

const emptyState = document.getElementById("emptyState");

const themeToggle = document.getElementById("themeToggle");

// =====================================
// Configuration
// =====================================

const STORAGE_KEY = "weatherAppCities";

const THEME_KEY = "weatherAppTheme";

// Store cities using their unique API IDs
const cities = new Map();

// =====================================
// Error Messages
// =====================================

const ERROR_MESSAGES = {
  API_KEY_MISSING: "Please add your OpenWeatherMap API key to config.js.",

  CITY_NOT_FOUND: "City not found. Please check the city name.",

  INVALID_API_KEY: "Invalid API key. Please check your configuration.",

  API_LIMIT: "API request limit reached. Please try again later.",

  NETWORK_ERROR: "Network error. Please check your internet connection.",

  TIMEOUT: "Request timed out. Please try again.",

  INVALID_DATA: "Invalid weather data received.",

  API_ERROR: "Something went wrong while fetching weather data.",
};

// =====================================
// Initialize Application
// =====================================

function init() {
  form.addEventListener("submit", handleSearch);

  cityInput.addEventListener("input", clearMessage);

  themeToggle.addEventListener("click", toggleTheme);

  loadTheme();

  restoreCities();

  updateDashboard();
}

// =====================================
// Search City
// =====================================

async function handleSearch(event) {
  event.preventDefault();

  const cityName = cityInput.value.trim();

  if (!cityName) {
    showMessage("Please enter a city name.", "error");

    return;
  }

  setLoading(searchBtn, cityInput, true);

  clearMessage();

  try {
    // Get current weather and forecast together
    const [weather, forecastData] = await Promise.all([
      getCurrentWeather(cityName),

      getForecast(cityName),
    ]);

    // Check duplicate city
    if (cities.has(weather.id)) {
      showMessage("This city has already been added.", "error");

      return;
    }

    const forecast = getDailyForecast(forecastData);

    addCity(weather, forecast);

    saveCities();

    cityInput.value = "";

    showMessage(`${weather.name} added successfully!`, "success");
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(searchBtn, cityInput, false);
  }
}

// =====================================
// Add City
// =====================================

function addCity(weather, forecast) {
  const card = createWeatherCard(weather, forecast, removeCity);

  cities.set(weather.id, {
    weather,
    forecast,
  });

  citiesContainer.appendChild(card);

  updateDashboard();
}

// =====================================
// Remove City
// =====================================

function removeCity(id, card) {
  if (!cities.has(id)) {
    return;
  }

  card.style.opacity = "0";

  card.style.transform = "scale(0.9)";

  setTimeout(() => {
    card.remove();

    cities.delete(id);

    saveCities();

    updateDashboard();

    showMessage("City removed successfully.", "success");
  }, 250);
}

// =====================================
// Update Dashboard
// =====================================

function updateDashboard() {
  const count = cities.size;

  updateCityCount(cityCount, count);

  updateEmptyState(emptyState, count);
}

// =====================================
// Save Cities
// =====================================

function saveCities() {
  try {
    const savedCities = Array.from(cities.values()).map(({ weather }) => ({
      name: weather.name,

      country: weather.sys.country,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCities));
  } catch (error) {
    console.error("Storage Error:", error);

    showMessage("Unable to save cities in local storage.", "error");
  }
}

// =====================================
// Restore Cities
// =====================================

async function restoreCities() {
  let savedCities = [];

  try {
    savedCities = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (!Array.isArray(savedCities)) {
      savedCities = [];
    }
  } catch (error) {
    console.error("Restore Error:", error);

    savedCities = [];
  }

  if (savedCities.length === 0) {
    return;
  }

  // Restore cities one by one to avoid excessive requests
  for (const city of savedCities) {
    if (
      !city ||
      typeof city.name !== "string" ||
      typeof city.country !== "string"
    ) {
      continue;
    }

    try {
      const query = `${city.name},${city.country}`;

      const [weather, forecastData] = await Promise.all([
        getCurrentWeather(query),

        getForecast(query),
      ]);

      if (cities.has(weather.id)) {
        continue;
      }

      const forecast = getDailyForecast(forecastData);

      addCity(weather, forecast);
    } catch (error) {
      console.error(`Could not restore ${city.name}:`, error);
    }
  }

  saveCities();
}

// =====================================
// Message Management
// =====================================

function showMessage(text, type = "") {
  updateMessage(message, text, type);
}

function clearMessage() {
  updateMessage(message, "");
}

// =====================================
// Error Handling
// =====================================

function handleError(error) {
  console.error("Weather App Error:", error);

  const errorMessage =
    ERROR_MESSAGES[error.message] ||
    "An unexpected error occurred. Please try again.";

  showMessage(errorMessage, "error");
}

// =====================================
// Theme Management
// =====================================

function loadTheme() {
  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  } catch (error) {
    console.error("Theme Storage Error:", error);
  }

  const isLight = savedTheme === "light";

  document.body.classList.toggle("light-theme", isLight);

  themeToggle.textContent = isLight ? "☀️" : "🌙";
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light-theme");

  themeToggle.textContent = isLight ? "☀️" : "🌙";

  try {
    localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
  } catch (error) {
    console.error("Theme Storage Error:", error);
  }
}

// =====================================
// Start Application
// =====================================

init();
