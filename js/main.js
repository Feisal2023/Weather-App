
const apiKey = 'RrbajbxUVvjc18kYLSTFSMBm41IDtNV0';

const listCard = document.querySelector('.list-card');
const list = document.querySelector('.list');
const searchCity = document.querySelector('#searchCity');
const cityName = document.querySelector('#cityName');
const weatherText = document.querySelector('#weatherText');
const degree = document.querySelector('#degree');
const imageTime = document.querySelector('#imageTime')

const getCityName = async (city) => {
  const url = 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete';
  const query = `?apikey=${apiKey}&q=${city}`;
  const response = await fetch(url + query);
  const data = await response.json();
  return data;
}

// getCityName("Nairobi");

searchCity.addEventListener('keyup', (e) => {
if(e.target.value.length === 0) {
  list.classList.add('d-none');
} else {
  list.innerHTML = '';
  getCityName(e.target.value.trim().toLowerCase())
  .then( data => {
    data.forEach(cities => {
      list.innerHTML += `
      <h4 class="class-target">${cities.LocalizedName}</h4> <hr>
      `
      list.classList.remove('d-none');
    })
  }).catch(error => {
    console.log(error);
  })
}

})


list.addEventListener('click', (event) => {
  updateTheUi(event.target.innerText.toLowerCase());

})

// get city code 
const getCityCode = async (city) => {
  const url = 'http://dataservice.accuweather.com/locations/v1/cities/search';
  const query = `?apikey=${apiKey}&q=${city}`;
  const response = await fetch(url + query);
  const data = await response.json();
  return data[0];
}


const updateTheUi = (city) => {
getCityCode(city)
.then(data => {
  cityName.innerHTML = `
  ${data.LocalizedName}, ${data.Country.LocalizedName}
  `;
   searchCity.value = '';
 return getWeatherInfo(data.Key);
 
}).then( data => {
  weatherText.innerHTML = `
  ${data.WeatherText}
  `;
  degree.innerHTML = `
  ${data.Temperature.Metric.Value} &deg; C
  `;
  if(data.IsDayTime) {
    imageTime.setAttribute('src', 'img/day.jpg')
  } else {
    imageTime.setAttribute('src', 'img/Night.jpg')
  }
  localStorage.setItem('city', city);
 
})
list.classList.add('d-none');
}

// get  weather info
const getWeatherInfo = async (cityCode) => {
  const url = 'http://dataservice.accuweather.com/currentconditions/v1/';
  const query = `${cityCode}?apikey=${apiKey}`;
  const response = await fetch(url + query);
  const data = await response.json();
  return data[0];
}

if(localStorage.getItem('city').length > 0) {
  updateTheUi(localStorage.getItem('city'));
}