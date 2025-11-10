const apiKey = '34884919bcbc9de419cb7c0843fe46ac'; // replace with your valid key
const cityInput = document.getElementById('city-name');
const forecastContainer = document.getElementById('forecast');
document.body.style.backgroundColor = "black";


async function fetchWeather(city) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const [weatherRes, forecastRes] = await Promise.all([fetch(weatherURL), fetch(forecastURL)]);
    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (weatherData.cod !== 200) {
      alert('City not found!');
      return;
    }

    updateCurrentWeather(weatherData);
    updateForecast(forecastData.list);
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
}

function updateCurrentWeather(data) {
  document.getElementById('current-temp').textContent = Math.round(data.main.temp);
  document.getElementById('current-condition').textContent = data.weather[0].main;
  document.getElementById('current-humidity').textContent = data.main.humidity + '%';
  document.getElementById('current-wind').textContent = (data.wind.speed * 3.6).toFixed(1) + ' km/h';
  document.getElementById('weather-icon').textContent = getWeatherIcon(data.weather[0].main);
  document.getElementById('chart-temp-label').textContent = Math.round(data.main.temp) + '°C';
  document.getElementById('date-time').textContent = new Date().toLocaleString();
}

function updateForecast(list) {
  forecastContainer.innerHTML = '';
  const days = {};

  // Group forecast data by day
  list.forEach(item => {
    const date = new Date(item.dt_txt);
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!days[dayLabel] && date.getHours() === 12) { // use midday for consistency
      days[dayLabel] = item;
    }
  });

  // Show first 4 days
  Object.keys(days).slice(0, 4).forEach((day, index) => {
    const item = days[day];
    const temp = Math.round(item.main.temp);
    const humidity = item.main.humidity;
    const condition = item.weather[0].main;
    const icon = getWeatherIcon(condition);
    const active = index === 0 ? 'active' : '';

    forecastContainer.innerHTML += `
      <div class="forecast-day ${active}">
        <p>${index === 0 ? 'Today' : day}</p>
        <span class="forecast-day-icon">${icon}</span>
        <span class="forecast-temp">${temp}°C</span>
        <span class="forecast-day-humidity">Humidity ${humidity}%</span>
      </div>`;
  });
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️'
  };
  return icons[condition] || '☁️';
}

cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') fetchWeather(cityInput.value);
});

// Default city
fetchWeather('London');
