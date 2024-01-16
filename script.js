// main weather information
const locationName = document.querySelector('.location span');
const weatherIcon = document.querySelector('.icon img');
const temperature = document.querySelector('.temperature');
const conditionName = document.querySelector('.condition');
// additional weather information
const humidity = document.querySelector('.humidity span');
const wind = document.querySelector('.wind span');
const visibility = document.querySelector('.visibility span');
// search
const search = document.querySelector('.search-column');
const searchInput = document.querySelector('.search-column input');
const searchIcon = document.querySelector('.search-icon');
// loading icon
const loader = document.querySelector('.loader');

// async/await function
async function fetchData(url){
  try {
    // display loader
    searchIcon.style.display = 'none';
    loader.style.display = 'block';
    
    const response = await fetch(url);
    const data = await response.json();
    const weatherCondition = data.weather[0].main;
    
    // location
    locationName.textContent = `${data.name}, ${data.sys.country}`;
    
    // temperature
    temperature.innerHTML = `${Math.round(data.main.temp - 273)}°<span>C</span>`;
    
    // weather condition and weather icon
    if (weatherCondition === 'Clouds'){
      conditionName.textContent = 'Clouds';
      weatherIcon.src = 'img/cloudy.png'
      
    } else if (weatherCondition === 'Clear'){
      conditionName.textContent = 'Clear Sky';
      
      const now = new Date().getHours();
      if (now >= 6 && now < 18){
        weatherIcon.src = 'img/clear-sky.png';
      } else {
        weatherIcon.src = 'img/clear-night.png';
      };
      
    } else if (['Mist','Smoke','Haze','Dust','Fog','Sandstorm','Ash'].includes(weatherCondition)){
      conditionName.textContent = 'Fog';
      weatherIcon.src = 'img/fog.png';
      
    } else if (weatherCondition === 'Thunderstorm'){
      conditionName.textContent = 'Thunderstorm';
      weatherIcon.src = 'img/thunderstorm.png';
      
    } else if (weatherCondition === 'Drizzle'){
      conditionName.textContent = 'Drizzle';
      weatherIcon.src = 'img/drizzle.png';
      
    } else if (weatherCondition === 'Rain'){
      conditionName.textContent = 'Rain';
      weatherIcon.src = 'img/rain.png';
      
    } else if (weatherCondition === 'Snow'){
      conditionName.textContent = 'Snow'
      weatherIcon.src = 'img/snow.png';
    }
    
    // humidity
    humidity.textContent = `Humidity ${data.main.humidity}%`;
    
    // wind speed
    wind.textContent = `Wind Speed ${Math.round(data.wind.speed)} m/s`;
    
    // visibility
    visibility.textContent = `Visibility ${data.visibility.toLocaleString('id-ID',{minimumFractionDigits: 0})} m`;
    
    // hide loader
    searchIcon.style.display = 'flex'
    loader.style.display = 'none';
    
  } catch (error) {
    // hide loader
    searchIcon.style.display = 'flex';
    loader.style.display = 'none';
    
    alert('Location not found');
    console.log('ignore the error that appears, this is normal because the user is looking for a location that does not exist on the server');
  };
};

// getuserlocation function
function getUserLocation(){
  // display loader
  searchIcon.style.display = 'none';
  loader.style.display = 'block';
  
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition,showError,{timeout: 10000});
  } else {
    console.error('Browser does not support');
  };
};

// showposition function
function showPosition(position){
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7fe29d295e757adbce5609da714be6d1`;
  
  fetchData(url);
  
  searchIcon.addEventListener('click',() => {
    if (searchInput.value){
      const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=7fe29d295e757adbce5609da714be6d1`;
      fetchData(searchUrl);
      
    } else {
      alert('The search field cannot be empty');
    };
  });
  
  // search
  searchInput.addEventListener('keyup',e => {
    if (searchInput.value === ''){
      fetchData(url);
    };
    
    if (e.key === 'Enter' && searchInput.value){
      const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=7fe29d295e757adbce5609da714be6d1`;
      fetchData(searchUrl);
      
    } else if (e.key === 'Enter' && searchInput.value === ''){
      alert('The search field cannot be empty');
    };
  });
};

// showerror function
function showError(error){
  // hide loader
  searchIcon.style.display = 'flex';
  loader.style.display = 'none';
  
  switch (error.code) {
    case 1:
      alert('Turn on location/GPS and refresh this website');
      break;
    case 2:
      alert('Location not found/Your API Key invalid');
      break;
    case 3:
      alert('Timeout, please refresh');
      break;
  };
};

getUserLocation();