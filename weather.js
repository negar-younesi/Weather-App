import { API_KEY } from "./config.js";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

const TIMEOUT = 10000;

// =====================================
// Request Helper
// =====================================

async function request(endpoint, params = {}) {
  if (
    !API_KEY ||
    API_KEY === "YOUR_OPENWEATHERMAP_API_KEY" ||
    API_KEY === "PASTE_YOUR_API_KEY_HERE"
  ) {
    throw new Error("API_KEY_MISSING");
  }

  const url = new URL(`${BASE_URL}/${endpoint}`);

  Object.entries({
    ...params,
    appid: API_KEY,
    units: "metric",
  }).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("CITY_NOT_FOUND");
      }

      if (response.status === 401) {
        throw new Error("INVALID_API_KEY");
      }

      if (response.status === 429) {
        throw new Error("API_LIMIT");
      }

      throw new Error("API_ERROR");
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("TIMEOUT");
    }

    if (error instanceof TypeError) {
      throw new Error("NETWORK_ERROR");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// =====================================
// Get Current Weather
// =====================================

export async function getCurrentWeather(city) {
  const data = await request("weather", {
    q: city,
  });

  if (!data.id || !data.main || !data.weather?.[0] || !data.sys) {
    throw new Error("INVALID_DATA");
  }

  return data;
}

// =====================================
// Get Five Day Forecast
// =====================================

export async function getForecast(city) {
  const data = await request("forecast", {
    q: city,
  });

  if (!Array.isArray(data.list)) {
    throw new Error("INVALID_DATA");
  }

  return data;
}

// =====================================
// Get Daily Forecast
// =====================================

export function getDailyForecast(forecastData) {
  const timezoneOffset = forecastData.city.timezone || 0;

  const groupedDays = new Map();

  forecastData.list.forEach((item) => {
    // Convert timestamp to city's local date and time
    const localDate = new Date((item.dt + timezoneOffset) * 1000);

    const year = localDate.getUTCFullYear();
    const month = localDate.getUTCMonth();
    const day = localDate.getUTCDate();

    const dateKey = [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");

    const localHour = localDate.getUTCHours();

    if (!groupedDays.has(dateKey)) {
      groupedDays.set(dateKey, []);
    }

    groupedDays.get(dateKey).push({
      ...item,
      localHour,
    });
  });

  const dailyForecast = [];

  for (const [date, items] of groupedDays) {
    // Choose the forecast closest to 12:00 local time
    const selected = items.reduce((best, current) => {
      return Math.abs(current.localHour - 12) < Math.abs(best.localHour - 12)
        ? current
        : best;
    });

    dailyForecast.push({
      date,
      timestamp: selected.dt,
      temp: selected.main.temp,
      min: selected.main.temp_min,
      max: selected.main.temp_max,
      icon: selected.weather[0].icon,
      description: selected.weather[0].description,
    });
  }

  // Return up to five calendar days
  return dailyForecast.slice(0, 5);
}
