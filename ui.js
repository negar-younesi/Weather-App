const ICON_URL = "https://openweathermap.org/img/wn";

// =====================================
// Create Element
// =====================================

function createElement(tag, className, text = "") {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  element.textContent = text;

  return element;
}

// =====================================
// Create Weather Icon
// =====================================

function createWeatherIcon(iconCode, description) {
  const img = document.createElement("img");

  img.className = "weather-icon";

  img.src = `${ICON_URL}/${encodeURIComponent(iconCode)}@2x.png`;

  img.alt = description || "Weather icon";

  img.loading = "lazy";

  img.onerror = () => {
    img.style.display = "none";
  };

  return img;
}

// =====================================
// Create Detail Item
// =====================================

function createDetail(label, value) {
  const wrapper = createElement("div", "detail-item");

  const title = createElement("span", "detail-label", label);

  const content = createElement("strong", "detail-value", value);

  wrapper.append(title, content);

  return wrapper;
}

// =====================================
// Create Forecast
// =====================================

function createForecast(forecast) {
  const section = createElement("div", "forecast");

  const title = createElement("h4", "", "5-Day Forecast");

  const list = createElement("div", "forecast-list");

  forecast.forEach((day) => {
    const item = createElement("div", "forecast-day");

    const date = new Date(`${day.date}T12:00:00Z`);

    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "UTC",
    }).format(date);

    const dayLabel = createElement("span", "", dayName);

    const icon = createElement("img");

    icon.src = `${ICON_URL}/${encodeURIComponent(day.icon)}.png`;

    icon.alt = day.description;

    icon.loading = "lazy";

    icon.onerror = () => {
      icon.style.display = "none";
    };

    const temperature = createElement("strong", "", `${Math.round(day.temp)}°`);

    item.append(dayLabel, icon, temperature);

    list.appendChild(item);
  });

  section.append(title, list);

  return section;
}

// =====================================
// Create Weather Card
// =====================================

export function createWeatherCard(weather, forecast, onRemove) {
  const card = createElement("li", "city-card");

  card.dataset.id = String(weather.id);

  // Header

  const header = createElement("div", "card-header");

  const cityInfo = createElement("div");

  const cityName = createElement("h3", "city-name", weather.name);

  const country = createElement(
    "span",
    "country-name",
    weather.sys.country || "",
  );

  cityInfo.append(cityName, country);

  const removeBtn = createElement("button", "remove-city", "×");

  removeBtn.type = "button";

  removeBtn.setAttribute("aria-label", `Remove ${weather.name}`);

  removeBtn.addEventListener("click", () => {
    onRemove(weather.id, card);
  });

  header.append(cityInfo, removeBtn);

  // Current Weather

  const current = createElement("div", "current-weather");

  const temperature = createElement("div", "temperature");

  const tempValue = createElement(
    "strong",
    "",
    `${Math.round(weather.main.temp)}°C`,
  );

  const icon = createWeatherIcon(
    weather.weather[0].icon,
    weather.weather[0].description,
  );

  temperature.append(tempValue, icon);

  const description = createElement(
    "p",
    "weather-description",
    weather.weather[0].description,
  );

  current.append(temperature, description);

  // Details

  const details = createElement("div", "weather-details");

  details.append(
    createDetail("Feels like", `${Math.round(weather.main.feels_like)}°C`),

    createDetail("Humidity", `${weather.main.humidity}%`),

    createDetail("Pressure", `${weather.main.pressure} hPa`),

    createDetail("Wind", `${weather.wind?.speed ?? 0} m/s`),
  );

  // Forecast

  const forecastSection = createForecast(forecast);

  // Final Card

  card.append(header, current, details, forecastSection);

  return card;
}

// =====================================
// UI Helpers
// =====================================

export function updateMessage(element, message, type = "") {
  element.textContent = message;

  element.className = `message ${type}`.trim();
}

export function updateCityCount(element, count) {
  element.textContent = `${count} Cities`;
}

export function updateEmptyState(emptyState, count) {
  emptyState.hidden = count > 0;
}

export function setLoading(button, input, isLoading) {
  button.disabled = isLoading;

  input.disabled = isLoading;

  button.textContent = isLoading ? "Loading..." : "Search";
}
