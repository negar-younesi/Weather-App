// Weather App JavaScript
// API: https://api.openweathermap.org/data/2.5/weather
// Icons: https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/

class WeatherApp {
    constructor() {
        this.form = document.querySelector("form");
        this.input = document.querySelector(".inputText input");
        this.submitBtn = document.querySelector(".submitBtn button");
        this.weatherCards = document.querySelector(".weatherCards .cities");
        this.msg = document.querySelector(".msg");
        this.apiKey = "edc228562ac0a8aa3116d41c0687cf56";
        this.cities = new Set(); // Track added cities to prevent duplicates
        
        this.init();
    }

    init() {
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        this.input.addEventListener("input", () => this.clearMessage());
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const inputValue = this.input.value.trim();
        
        if (!inputValue) {
            this.showMessage("Please enter a city name", "error");
            return;
        }

        // Check for duplicate cities
        if (this.cities.has(inputValue.toLowerCase())) {
            this.showMessage("City already added", "error");
            return;
        }

        this.setLoading(true);
        this.clearMessage();

        try {
            const weatherData = await this.fetchWeatherData(inputValue);
            this.displayWeatherCard(weatherData);
            this.cities.add(inputValue.toLowerCase());
            this.input.value = "";
        } catch (error) {
            this.handleError(error);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchWeatherData(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found");
            } else if (response.status === 401) {
                throw new Error("Invalid API key");
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        }

        const data = await response.json();
        
        // Validate required data
        if (!data.main || !data.name || !data.sys || !data.weather) {
            throw new Error("Invalid weather data received");
        }

        return data;
    }

    displayWeatherCard(data) {
        const { main, name, sys, weather } = data;
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
        
        const li = document.createElement("li");
        li.classList.add("city");
        
        const markup = `
            <h2 data-name="${name},${sys.country}">
                <span>${name}</span>
                <span>${sys.country}</span>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}°C</div>
            <div class="city-details">
                <div class="city-feels">Feels like: ${Math.round(main.feels_like)}°C</div>
                <div class="city-humidity">Humidity: ${main.humidity}%</div>
            </div>
            <figure>
                <img class="city-icon" src="${icon}" alt="${weather[0].description}" onerror="this.src='https://via.placeholder.com/120x100?text=No+Icon'">
                <figcaption>${weather[0].description}</figcaption>
            </figure>
            <button class="remove-city" onclick="weatherApp.removeCity(this, '${name.toLowerCase()}')">×</button>
        `;
        
        li.innerHTML = markup;
        this.weatherCards.appendChild(li);
        
        // Add fade-in animation
        li.style.opacity = '0';
        setTimeout(() => {
            li.style.transition = 'opacity 0.3s ease-in';
            li.style.opacity = '1';
        }, 10);
    }

    removeCity(button, cityName) {
        const cityCard = button.closest('.city');
        cityCard.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        cityCard.style.opacity = '0';
        cityCard.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            cityCard.remove();
            this.cities.delete(cityName);
        }, 300);
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = "LOADING...";
            this.input.disabled = true;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = "SUBMIT";
            this.input.disabled = false;
        }
    }

    showMessage(message, type = "info") {
        this.msg.textContent = message;
        this.msg.className = `msg ${type}`;
    }

    clearMessage() {
        this.msg.textContent = "";
        this.msg.className = "msg";
    }

    handleError(error) {
        console.error('Weather App Error:', error);
        
        if (error.message.includes("City not found")) {
            this.showMessage("City not found. Please check the spelling.", "error");
        } else if (error.message.includes("API key")) {
            this.showMessage("API key issue. Please contact support.", "error");
        } else if (error.message.includes("network")) {
            this.showMessage("Network error. Please check your connection.", "error");
        } else {
            this.showMessage("An error occurred. Please try again.", "error");
        }
    }
}

// Initialize the app when DOM is loaded
let weatherApp;
document.addEventListener('DOMContentLoaded', () => {
    weatherApp = new WeatherApp();
});

// Handle API errors gracefully
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
});

