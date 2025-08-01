document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const loader = document.getElementById('loader');
  const errorMessage = document.getElementById('error-message');
  const weatherContainer = document.getElementById('weather-container');

  const cityNameEl = document.getElementById('city-name');
  const weatherDescEl = document.getElementById('weather-desc');
  const weatherIconEl = document.getElementById('weather-icon');
  const temperatureEl = document.getElementById('temperature');
  const humidityEl = document.getElementById('humidity');
  const windSpeedEl = document.getElementById('wind-speed');
  const pressureEl = document.getElementById('pressure');
  const sunriseEl = document.getElementById('sunrise');
  const forecastContainer = document.getElementById('forecast-container');

  searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
  });

  cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const city = cityInput.value.trim();
      if (city) fetchWeather(city);
    }
  });

  function showLoader() {
    loader.classList.remove('hidden');
    weatherContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
  }

  function showWeatherContainer() {
    loader.classList.add('hidden');
    weatherContainer.classList.remove('hidden');
    errorMessage.classList.add('hidden');
  }

  function displayError(msg) {
    loader.classList.add('hidden');
    weatherContainer.classList.add('hidden');
    errorMessage.textContent = "Error: " + msg;
    errorMessage.classList.remove('hidden');
  }

  function getEmoji(code) {
    const map = {
      '113': '☀️', '116': '🌤️', '119': '☁️', '122': '🌥️', '143': '🌫️',
      '176': '🌦️', '179': '🌨️', '182': '🌨️', '200': '⛈️',
      '263': '🌧️', '266': '🌧️', '296': '🌧️', '299': '🌧️',
      '302': '🌧️', '308': '🌧️', '311': '🌨️', '326': '❄️',
      '329': '❄️', '353': '🌧️', '356': '🌧️', '359': '🌧️',
    };
    return map[code.toString()] || '❓';
  }

  async function fetchWeather(query) {
    showLoader();
    try {
      const response = await fetch(`https://wttr.in/${query}?format=j1`);
      if (!response.ok) throw new Error('City not found.');
      const data = await response.json();
      const current = data.current_condition[0];
      const area = data.nearest_area[0];

      cityNameEl.textContent = `${area.areaName[0].value}, ${area.country[0].value}`;
      weatherDescEl.textContent = current.weatherDesc[0].value;
      weatherIconEl.textContent = getEmoji(current.weatherCode);
      temperatureEl.textContent = `${current.temp_C}°C`;
      humidityEl.textContent = `${current.humidity}%`;
      windSpeedEl.textContent = `${current.windspeedKmph} km/h`;
      pressureEl.textContent = `${current.pressure} hPa`;
      sunriseEl.textContent = data.weather[0].astronomy[0].sunrise;

      forecastContainer.innerHTML = '';
      data.weather.forEach(day => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        const date = new Date(day.date);
        card.innerHTML = `
          <p><strong>${date.toLocaleDateString(undefined, { weekday: 'short' })}</strong></p>
          <div style="font-size: 24px;">${getEmoji(day.hourly[4].weatherCode)}</div>
          <p>${day.maxtempC}° / ${day.mintempC}°</p>
        `;
        forecastContainer.appendChild(card);
      });

      showWeatherContainer();
    } catch (err) {
      displayError(err.message);
    }
  }

  // Auto-fetch location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      () => fetchWeather('Vijayawada')
    );
  } else {
    fetchWeather('Vijayawada');
  }
});
