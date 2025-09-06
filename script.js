const API_KEY = "6e5a236c0898f6d06927ea53e7ab7a06";

// DOM elements
const welcomeMessage = document.getElementById("welcomeMessage");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const weatherData = document.getElementById("weatherData");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const pressure = document.getElementById("pressure");

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityInputError = document.getElementById("cityInputError");
const searchBtnError = document.getElementById("searchBtnError");
const cityInputNew = document.getElementById("cityInputNew");
const searchBtnNew = document.getElementById("searchBtnNew");
const navSearchInput = document.getElementById("navSearchInput");
const navSearchBtn = document.getElementById("navSearchBtn");

const reviewBtn = document.getElementById('addReviewBtn');
const reviewInput = document.getElementById('reviewInput');
const reviewSection = document.getElementById('reviewSection');

const recentSearchesContainer = document.getElementById('recentSearchesContainer');

const unitToggleBtn = document.getElementById('unitToggleBtn');
let isCelsius = true;
let currentTempC = 0;
let currentFeelsLikeC = 0;
let recentSearches = [];

// Background & icon
function setCardBackground(weatherId) {
    const card = document.querySelector(".weather-card");
    if (!card) return;

    if (weatherId >= 200 && weatherId < 600) {
        card.style.background = "linear-gradient(135deg, #4e54c8, #8f94fb)";
        weatherIcon.className = "weather-icon rainy"; weatherIcon.textContent="🌧️";
    } else if (weatherId >= 600 && weatherId < 700) {
        card.style.background = "linear-gradient(135deg, #83a4d4, #b6fbff)";
        weatherIcon.className = "weather-icon snowy"; weatherIcon.textContent="❄️";
    } else if (weatherId === 800) {
        card.style.background = "linear-gradient(135deg, #ecb938ff, #423612ff)";
        weatherIcon.className = "weather-icon sunny"; weatherIcon.textContent="☀️";
    } else if (weatherId > 800) {
        card.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
        weatherIcon.className = "weather-icon cloudy"; weatherIcon.textContent="☁️";
    } else {
        card.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
        weatherIcon.className = "weather-icon"; weatherIcon.textContent="🌍";
    }
}

// Recent searches
function addRecentSearch(city){
    if(!recentSearches.includes(city)){
        recentSearches.unshift(city);
        if(recentSearches.length>5) recentSearches.pop();
        renderRecentSearches();
    }
}

function renderRecentSearches(){
    recentSearchesContainer.innerHTML="";
    recentSearches.forEach(city=>{
        const btn=document.createElement('button');
        btn.textContent=city;
        btn.addEventListener('click',()=>fetchWeather(city));
        recentSearchesContainer.appendChild(btn);
    });
}

// Fetch weather
async function fetchWeather(city){
    if(!city) return;
    welcomeMessage.style.display="none";
    errorState.style.display="none";
    weatherData.style.display="none";
    loadingState.style.display="block";

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if(!response.ok) throw new Error("City not found");
        const data = await response.json();

        cityName.textContent = `${data.name}, ${data.sys.country}`;
        currentTempC = data.main.temp;
        currentFeelsLikeC = data.main.feels_like;
        temperature.textContent = `${Math.round(currentTempC)}°C`;
        feelsLike.textContent = `${Math.round(currentFeelsLikeC)}°C`;
        description.textContent = data.weather[0].description;
        windSpeed.textContent = `${data.wind.speed} m/s`;
        humidity.textContent = `${data.main.humidity}%`;
        pressure.textContent = `${data.main.pressure} hPa`;

        setCardBackground(data.weather[0].id);

        loadingState.style.display="none";
        weatherData.style.display="block";

        addRecentSearch(city);

        // Reset to Celsius
        if(!isCelsius) unitToggleBtn.click();

    }catch(error){
        loadingState.style.display="none";
        errorState.style.display="block";
    }
}

// Event listeners
searchBtn.addEventListener("click", ()=>fetchWeather(cityInput.value));
searchBtnError.addEventListener("click", ()=>fetchWeather(cityInputError.value));
searchBtnNew.addEventListener("click", ()=>fetchWeather(cityInputNew.value));
navSearchBtn.addEventListener("click", ()=>fetchWeather(navSearchInput.value));

[cityInput, cityInputError, cityInputNew, navSearchInput].forEach(input=>{
    input.addEventListener("keypress", e=>{
        if(e.key==="Enter") fetchWeather(input.value);
    });
});

// Reviews
reviewBtn.addEventListener('click', ()=>{
    if(reviewInput.value.trim()!==''){
        const div=document.createElement('div');
        div.className='weather-detail';
        div.innerHTML=`<strong>User:</strong> ${reviewInput.value}`;
        reviewSection.appendChild(div);
        reviewInput.value='';
    }
});

// Unit toggle
unitToggleBtn.addEventListener('click', ()=>{
    if(isCelsius){
        const tempF = (currentTempC*9/5)+32;
        const feelsF = (currentFeelsLikeC*9/5)+32;
        temperature.textContent=`${Math.round(tempF)}°F`;
        feelsLike.textContent=`${Math.round(feelsF)}°F`;
        unitToggleBtn.textContent="Show in °C";
    } else {
        temperature.textContent=`${Math.round(currentTempC)}°C`;
        feelsLike.textContent=`${Math.round(currentFeelsLikeC)}°C`;
        unitToggleBtn.textContent="Show in °F";
    }
    isCelsius=!isCelsius;
});
