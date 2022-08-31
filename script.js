var searchForm = document.querySelector("#searchForm");
var searchedCities = document.querySelector("#searchedCities");
var searchEl = document.querySelector("#search");
var fiveDayEl = document.querySelector("#fiveDays");
var appid = "485bbc753e29e9770f09ca55c32c6d79";

var toJSON = function (response) {
  return response.json();
};

var displayWeather = function (data, city) {
  console.log(data);
  var currentEl = document.querySelector("#current");
  var h2El = document.createElement("h2");
  var tempEl = document.createElement("p");
  h2El.textContent = city.name;
  tempEl.textContent = "TEMP: " + data.current.temp;
  currentEl.appendChild(h2El);
  currentEl.appendChild(tempEl);

  console.log("DAILY", data.daily.slice(1, 6));
  var fiveDays = data.daily.slice(1, 6);

  fiveDayEl.innerHTML = null;
  for (var day of fiveDays) {
    console.log("DAY", day);
    var date = new Date(day.dt * 1000).toLocaleDateString();
    var temp = day.temp.day;
    var uvi = day.uvi.day;
    var icon = day.weather[0].icon;
    var colEl = document.createElement("div");
    var cardEl = document.createElement("div");
    var dateEl = document.createElement("p");
    var tempEl = document.createElement("p");
    var uviEl = document.createElement("p");
    var imgEl = document.createElement("img");
    colEl.className = "col-12 col-md";
    cardEl.className = "card p-3 m-3";

    dateEl.textContent = date;
    tempEl.textContent = temp;
    uviEl.textContent = uvi;

    imgEl.width = 90;
    imgEl.height = 90;
    imgEl.alt = icon;
    imgEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

    fiveDayEl.append(colEl);
    colEl.append(cardEl);
    cardEl.append(dateEl);
    cardEl.append(imgEl);
    cardEl.append(tempEl);
    cardEl.append(uviEl);
  }
};

var displayButtons = function () {
  var cities = JSON.parse(localStorage.getItem("cities")) || [];
  searchedCities.innerHTML = null;
  for (var city of cities) {
    var buttonEl = document.createElement("button");
    buttonEl.textContent = city;
    buttonEl.className = "btn btn-success mb-4";
    searchedCities.appendChild(buttonEl);
  }
};

var getOneCall = function (city) {
  var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&appid=${appid}&units=imperial&exclude=hourly,minutely`;

  fetch(oneCall)
    .then(toJSON)
    .then((data) => displayWeather(data, city));
};

var localStorageSave = function (city) {
  var cities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.push(city);
  var sets = Array.from(new Set(cities));
  var data = JSON.stringify(sets);
  localStorage.setItem("cities", data);
  displayButtons();
};

var getGEO = function (locations) {
  var city = locations[0];
  console.log("LAT", city.lat);
  console.log("LON", city.lon);
  localStorageSave(city.name);

  getOneCall(city);
};

var handleSearch = function (event) {
  event.preventDefault();

  var q = document.querySelector("#q");
  var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q.value}&appid=${appid}`;

  fetch(geoURL).then(toJSON).then(getGEO);
};

var handleCity = function (event) {
  event.preventDefault();
  if (event.target.matches("button")) {
    var q = event.target.textContent;
    var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${appid}`;

    fetch(geoURL).then(toJSON).then(getGEO);
  }
};

searchEl.addEventListener("click", handleSearch);
searchedCities.addEventListener("click", handleCity);

displayButtons();
