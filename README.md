# Weather App

A modern, responsive weather application built with vanilla JavaScript that allows users to search for and display current weather information for multiple cities simultaneously. The app features a clean, intuitive interface with real-time weather data, animated weather icons, and seamless user experience across all devices.

## Features

- Search for weather by city name
- Display multiple city weather cards
- Responsive design for mobile, tablet, and desktop
- Weather icons and detailed information
- Remove cities from the list
- Error handling for invalid city names

## Technologies Used

- HTML5
- CSS3 with responsive design
- Vanilla JavaScript (ES6+)
- OpenWeatherMap API

## Setup

1. Clone this repository
2. Open `index.html` in your browser
3. The app is ready to use!

## API Key

The app uses OpenWeatherMap API. Get your free API key at:
https://openweathermap.org/api

Replace the API key in `main.js` line 12:
```javascript
this.apiKey = "YOUR_API_KEY_HERE";
```

## Usage

1. Enter a city name in the search field
2. Click "SUBMIT" or press Enter
3. View the weather information
4. Add multiple cities to compare weather
5. Click the × button to remove a city

## Responsive Breakpoints

- Desktop: >1000px (4 columns)
- Tablet: 700px-1000px (2-3 columns)
- Mobile: <700px (1-2 columns)
- Small Mobile: <500px (1 column)
