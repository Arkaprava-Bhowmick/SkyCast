// ====== CONFIG ======
const apiKey = "16a982fef042696ecc121024e95e29d7";
const apiBase = "https://api.openweathermap.org/data/2.5/weather";

// ====== DOM Elements ======
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const themeToggle = document.getElementById("theme-toggle");

const locationEl = document.getElementById("location");
const datetimeEl = document.getElementById("datetime");
const weatherIconEl = document.getElementById("weather-icon");
const temperatureEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const backgroundEl = document.getElementById("background");

// ====== Fetch Weather Data ======
async function fetchWeather(city) {
  try {
    const url = `${apiBase}?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      alert(data.message);
      return;
    }

    updateUI(data);
  } catch (err) {
    console.error("Error fetching weather:", err);
  }
}

// ====== Update UI ======
function updateUI(data) {
  const { name, sys, main, weather, wind, dt, timezone } = data;

  // Location & Time
  locationEl.textContent = `${name}, ${sys.country}`;
  datetimeEl.textContent = getLocalTime(dt, timezone);

  // Weather Info
  temperatureEl.textContent = `${Math.round(main.temp)}°C`;
  conditionEl.textContent = weather[0].description;
  feelsLikeEl.textContent = `Feels like: ${Math.round(main.feels_like)}°C`;
  humidityEl.textContent = `Humidity: ${main.humidity}%`;
  windEl.textContent = `Wind: ${Math.round(wind.speed)} km/h`;

  // Weather Icon
  const iconCode = weather[0].icon;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Change Background
  changeBackground(weather[0].main.toLowerCase());
}

// ====== Get Local Time ======
function getLocalTime(dt, timezone) {
  const localTime = new Date((dt + timezone) * 1000);
  return localTime.toUTCString().replace("GMT", "");
}

// ====== Change Background Based on Weather ======
function changeBackground(condition) {
  let gradient;

  if (condition.includes("cloud")) {
    gradient = "linear-gradient(to bottom, #bdc3c7, #2c3e50)";
  } else if (condition.includes("rain")) {
    gradient = "linear-gradient(to bottom, #00c6fb, #005bea)";
  } else if (condition.includes("clear")) {
    gradient = "linear-gradient(to bottom, #f7971e, #ffd200)";
  } else if (condition.includes("snow")) {
    gradient = "linear-gradient(to bottom, #e6dada, #274046)";
  } else {
    gradient = "linear-gradient(to bottom, #4facfe, #00f2fe)";
  }

  backgroundEl.style.background = gradient;
}

// ====== Event Listeners ======
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name");
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});

// ====== Default Load ======
fetchWeather("New Delhi"); // Default city on load
