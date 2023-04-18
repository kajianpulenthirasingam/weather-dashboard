// Get DOM elements
var cityInputEl = document.querySelector("#city-input");
var searchBtnEl = document.querySelector("#search-btn");
var currentWeatherContainerEl = document.querySelector("#current-weather-container");
var futureWeatherContainerEl = document.querySelector("#future-weather-container");
var searchHistoryListEl = document.querySelector("#search-history-list");

// Set API key and base URL for OpenWeatherMap API
var apiKey = "aa8b1fb7acbe25c7994fefd91f38c82c";
var baseUrl = "https://api.openweathermap.org/data/2.5/";

// Create array to store search history
let searchHistory = [];

// Retrieve search history from local storage, if available
if (localStorage.getItem("searchHistory")) {
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  renderSearchHistory();
}

// Add event listener to search button
searchBtnEl.addEventListener("click", function (event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

// Add event listener to search history list
searchHistoryListEl.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    var city = event.target.textContent;
    getWeatherData(city);
  }
});

// Function to get weather data from OpenWeatherMap API
function getWeatherData(city) {
  // Build API URL for current weather data
  var currentWeatherUrl = `${baseUrl}weather?q=${city}&units=metric&appid=${apiKey}`;

  // Build API URL for forecast weather data
  var forecastWeatherUrl = `${baseUrl}forecast?q=${city}&units=metric&appid=${apiKey}`;

  // Fetch current weather data
  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      // Fetch forecast weather data
      fetch(forecastWeatherUrl)
        .then((response) => response.json())
        .then((forecastData) => {
          // Render current and forecast weather data
          renderCurrentWeather(data);
          renderForecastWeather(forecastData);
          // Add city to search history
          addToSearchHistory(city);
        })
        .catch((error) => {
          console.error("Error fetching forecast weather data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
    });
}

// Function to render current weather data
function renderCurrentWeather(data) {
  // Clear current weather container
  currentWeatherContainerEl.innerHTML = "";

  // Create elements for city name, date, icon, temperature, humidity, and wind speed
  var cityNameEl = document.createElement("h3");
  cityNameEl.textContent = `${data.name} (${new Date().toLocaleDateString()})`;
  var iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  var iconEl = document.createElement("img");
  iconEl.setAttribute("src", iconUrl);
  var temperatureEl = document.createElement("p");
  temperatureEl.textContent = `Temperature: ${data.main.temp} °C`;
  var humidityEl = document.createElement("p");
  humidityEl.textContent = `Humidity: ${data.main.humidity} %`;
  var windSpeedEl = document.createElement("p");
  windSpeedEl.textContent = `Wind Speed: ${data.wind.speed} m/s`;

  // Append elements to current weather container
currentWeatherContainerEl.appendChild(cityNameEl);
currentWeatherContainerEl.appendChild(iconEl);
currentWeatherContainerEl.appendChild(temperatureEl);
currentWeatherContainerEl.appendChild(humidityEl);
currentWeatherContainerEl.appendChild(windSpeedEl);
}

// Function to render forecast weather data
function renderForecastWeather(data) {
    // Clear forecast weather container
    futureWeatherContainerEl.innerHTML = "";
  
    // Create elements for forecast weather cards
    for (let i = 0; i < data.list.length; i++) {
      // Check if forecast time is at 12:00 PM
      if (data.list[i].dt_txt.includes("12:00:00")) {
        // Create elements for card
        var cardEl = document.createElement("div");
        cardEl.classList.add("card");
        var cardBodyEl = document.createElement("div");
        cardBodyEl.classList.add("card-body");
        var dateEl = document.createElement("h5");
        dateEl.classList.add("card-title");
        dateEl.textContent = new Date(data.list[i].dt_txt).toLocaleDateString();
        var iconUrl = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", iconUrl);
        var temperatureEl = document.createElement("p");
        temperatureEl.classList.add("card-text");
        temperatureEl.textContent = `Temp: ${data.list[i].main.temp} °C`;
        var humidityEl = document.createElement("p");
        humidityEl.classList.add("card-text");
        humidityEl.textContent = `Humidity: ${data.list[i].main.humidity} %`;
  
        // Append elements to card body
        cardBodyEl.appendChild(dateEl);
        cardBodyEl.appendChild(iconEl);
        cardBodyEl.appendChild(temperatureEl);
        cardBodyEl.appendChild(humidityEl);
  
        // Append card body to card
        cardEl.appendChild(cardBodyEl);
  
        // Append card to forecast weather container
        futureWeatherContainerEl.appendChild(cardEl);
      }
    }
  }
  
// Function to add city to search history
function addToSearchHistory(city) {
    // Check if city already exists in search history
    if (!searchHistory.includes(city)) {
    // Add city to search history array
    searchHistory.push(city);
    // Render updated search history list
    renderSearchHistory();

// Save search history to local storage
localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
}

// Function to render search history list
function renderSearchHistory() {
// Clear search history list
searchHistoryListEl.innerHTML = "";

// Create list items for each city in search history array
for (let i = 0; i < searchHistory.length; i++) {
var liEl = document.createElement("li");
liEl.textContent = searchHistory[i];
searchHistoryListEl.appendChild(liEl);
}
}

// Initialize search history list
renderSearchHistory();

// Add event listener to clear search history button
var clearBtnEl = document.querySelector("#clear-btn");
clearBtnEl.addEventListener("click", function () {
// Clear search history array
searchHistory = [];

// Render updated search history list
renderSearchHistory();

// Remove search history from local storage
localStorage.removeItem("searchHistory");
});