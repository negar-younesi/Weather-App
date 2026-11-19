# 🌤️ Weather App

🌐 Live Demo

🚀 View Weather App Live Demo
🌐 Live Demo

Try the application here:

Weather App – Live Demo
A modern and responsive weather application built with HTML, CSS, and Vanilla JavaScript.

The application allows users to search for cities, view current weather conditions, and check a five-day weather forecast.

## ✨ Features

- Search weather by city name
- Display current temperature
- Five-day weather forecast
- Display humidity and wind speed
- Display atmospheric pressure
- Add and remove cities
- Save favorite cities using LocalStorage
- Dark and Light mode
- Responsive design
- Loading states and error handling
- Modular JavaScript architecture

## 🛠️ Technologies

- HTML5
- CSS3
- JavaScript ES6+
- Fetch API
- Async/Await
- JavaScript ES Modules
- LocalStorage
- OpenWeatherMap API

## 📁 Project Structure

```text
weather-app/
│
├── index.html
├── style.css
│
├── main.js
├── weather.js
├── ui.js
│
├── config.js
├── config.example.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/negar-younesi/weather-app.git
```

### 2. Open the project

```bash
cd weather-app
```

### 3. Get an API Key

Create an account at OpenWeatherMap:

https://openweathermap.org/api

Generate your API key.

### 4. Configure API Key

Create a file named `config.js` in the project root.

Copy the following code:

```javascript
export const API_KEY = "YOUR_API_KEY";
```

Replace `YOUR_API_KEY` with your actual API key.

Do not commit `config.js` to GitHub.

### 5. Run the Application

Open the project using VS Code and run it with Live Server.

The application uses JavaScript ES Modules, so it should be served over HTTP rather than opened directly using `file://`.

## 🌐 API

This project uses OpenWeatherMap:

- Current Weather API
- 5 Day / 3 Hour Forecast API

Documentation:

https://openweathermap.org/api

## 🔒 Security

The API key is excluded from the Git repository using `.gitignore`.

Important: This is a frontend-only application. API keys used in browser applications are visible to users through browser developer tools and network requests.

Do not use a private production API key in a public deployment.

## 👨‍💻 Author

negar younesi
Frontend Developer

## 📄 License

This project is available under the MIT License.
