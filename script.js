console.log("Script loaded");

const apiKey = "568d6d65d1918dc112d45c7f610810c5";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const result = document.getElementById("weather-result");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  result.innerHTML = "<p>Loading...</p>";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    displayWeather(data);
    getForecast(city);
  } catch (error) {
    result.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

function displayWeather(data) {
  const icon = data.weather[0].icon;

  result.innerHTML = `
    <div class="weather-card">
      <h2>${data.name}</h2>

      <img 
        src="https://openweathermap.org/img/wn/${icon}@2x.png" 
        alt="Weather Icon"
      />

      <p class="temp">🌡 ${data.main.temp}°C</p>
      <p>🌥 ${data.weather[0].description}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
    </div>
  `;
}

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    displayForecast(data);
  } catch (error) {
    console.error("Forecast error:", error.message);
  }
}

function displayForecast(data) {
  const forecastContainer = document.createElement("div");
  forecastContainer.classList.add("forecast-container");

  data.list.slice(0, 5).forEach((item) => {
    const icon = item.weather[0].icon;

    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");

    forecastItem.innerHTML = `
      <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
      <p>${item.main.temp}°C</p>
    `;

    forecastContainer.appendChild(forecastItem);
  });

  result.appendChild(forecastContainer);
}
