let temp = document.getElementById("temp");
const date = document.getElementById("date-time");
const currentLocation = document.getElementById("location");
const condition = document.querySelector(".condition");
const rain = document.getElementById("rain");
const mainIcon = document.getElementById("icon");
const uvIndex = document.getElementById("uvindex");
const uvText = document.getElementById("uvtext");
const windSpeed = document.getElementById("wind");
const sunRise = document.getElementById("Sun-rise");
const sunSet = document.getElementById("Sun-set");
const humidity = document.getElementById("humidityt");
const visibility = document.getElementById("vis");
const humidityStatus = document.getElementById("humiditystatus");
const airQuality = document.getElementById("airQ");
const airQualityStatus = document.getElementById("airqulitystatus");
const visibilityStatus = document.getElementById("visibilitystatus");
const weatherCards = document.getElementById("weather-cards");
const celsiusBtn = document.querySelector(".celcius-active ");
const fahrenheitBtn = document.querySelector(".farenhight");
const hourlyBtn =document.querySelector(".hourly");
const weekBtn = document.querySelector(".week");
const tempUnit =document.querySelectorAll(".temo-unit");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");




let currentCity = ""; // Example city
let currentUnit = "c"; // Celsius unit
let hourlyOrWeekly = "hourly"; // Hourly data




// Update date and time
function getDateTime() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }

    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();

// Update time every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

function getPublicIp() {
    fetch("https://geolocation-db.com/json/")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            currentCity = data.currentCity;
            getWeatherData(data.city, currentUnit, hourlyOrWeekly);
        });
}

getPublicIp(); // Call the function to fetch the public IP address and location data

function getWeatherData(city, unit, hourlyOrWeekly) {
    const apiKey = "35BW8266EZG8KRZT77VN7NJG2";
    const apiurl = 
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=${apiKey}&contentType=json`)
        .then(response => response.json())
        .then(data => {
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp;
            } else {
                temp.innerText = celsiusToFahrenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = `perc - ${today.precip}%`;
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            humidity.innerText = today.humidity + "%";
            visibility.innerText = today.visibility;
            airQuality.innerText = today.winddir;
            measureUvIndex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibilityStatus(today.visibility);
            updateAirQualityStatus(today.winddir);
            sunRise.innerText = convertTimeTo12HourFormat(today.sunrise); // Adjusted property name here
            sunSet.innerText = convertTimeTo12HourFormat(today.sunset); // Adjusted property name here
                mainIcon.src=getIcon(today.icon);
               changeBackground(data.days ,unit ,"week");

            if(hourlyOrWeekly ==="hourly"){
                updateForecast(data.days[0].hours,unit,"day");
            }else{
                updateForecast(data.days,unit,"week");
            }
            


        })
      .catch((error) => {
        alert("city not found in our database");
      });
}

function celsiusToFahrenheit(temp) {
    
    return ((temp * 9) / 5 + 32);
}
function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvText.innerText = "Low";
    } else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
        uvText.innerText = "High";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}
function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";

    }
}
function updateVisibilityStatus(visibility) {
    if (visibility <= 0.3) {
        visibilityStatus.innerText = "Dense Fog"
    } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate";
    } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    } else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    } else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Veryn Light Mist";
    } else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

function updateAirQualityStatus(airQuality) {
    if (airQuality <= 50) {
        airQualityStatus.innerText = "Good"
    } else if (airQuality <= 100) {
        airQualityStatus.innerText = "Moderate";
    } else if (airQuality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
    } else if (airQuality <= 200) {
        airQualityStatus.innerText = "Unhealthy";
    } else if (airQuality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy";
    } else {
        airQualityStatus.innerText = "Veryn Light Mist";
    }
}
function convertTimeTo12HourFormat(time) {
    let hour = parseInt(time.split(":")[0]); // ParseInt added here
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am"; // Corrected here
    hour = hour % 12;
    hour = hour ? hour : 12;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let formattedTime = hour + ":" + minute + " " + ampm; 
    return formattedTime;
}

function getIcon(condition) {
    if (condition === "Clear") {
        return "icons/113.png";
    } else if (condition === "Partially-cloudy") {
        return "icons/116.png";
    } else if (condition === "Overcast") {
        return "icons/371.png";
    } else if (condition === "rainy") {
        return "icons/176.png";
    } else if (condition === "thndr") {
        return "icons/200.png";
    } else if (condition === "Windy") {
        return "icons/sun.png";
    }else if (condition === "clear-nigh") {
        return "icons/113.png";
    }else if (condition === "partly-cloudy-night") {
        return "icons/335.png";
    }else (condition === "Blustery") 
        return "icons/371.png";
    
}

function getDayName(date) {
    let day = new Date(date);
    let days = [
        "sunday",
        "Monday",
        "Tuseday",
        "wednesdaya",
        "Friday",
        "Sataureday",
    ];
    return days[day.getDay()];
}
function getHours(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}
function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numberCards = 0;

    if (type == "day") {
        numberCards = 24;
    } else {
        numberCards = 7;
    }
    for (let i = 0; i < numberCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHours(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit ==="f") {
            dayTemp = celsiusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C"
        if (unit === "f") {
            tempUnit = "°F";
        }
        card.innerHTML = `
                            <h2 class="day-name">${dayName}</h2>
                            <div class="card-icon" >
                            <img src="${iconSrc}" alt="" />
                            </div>
                            <div class="day-temp">
                            <h2 class="temp">${dayTemp}</h2>
                            <span class="temp-unit">${tempUnit}</span>
                            </div>
        `;
        weatherCards.appendChild(card);
        day++;
    }
}

function changeBackground(condition) {
    let img = ""; 
    if (condition === "Partly-cloudy-day") {
        img = "img/pexels-dreamypixel-552789.jpg";
    } else if (condition === "Partly-cloudy-night") {
        img = "img/pexels-philippedonn-1114690.jpg";
    } else if (condition === "rain") {
        img = "img/pexels-pixabay-531880.jpg";
    } else if (condition === "clear-night") {
        img = "img/pexels-therato-1933318.jpg";
    } else if (condition === "clear-day") {
        img = "img/pexels-8moments-1323550.jpg";
    } else {
        img = "img/pexels-wdnet-96627.jpg";
    }
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${img})`;
}
fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});
celsiusBtn.addEventListener("click", () => {
    changeUnit("c");
});

function changeUnit(unit) {
    if (currentUnit !== unit) { // Use '!==', which means not equal
        currentUnit = unit;
        tempUnit.forEach((elem) => {
            elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
            celsiusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        } else {
            celsiusBtn.classList.remove("active");
            fahrenheitBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyOrWeekly); // Use 'currentCity' instead of 'data.city'
    }
}
hourlyBtn.addEventListener("click", () =>{
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click" , () =>{
   changeTimeSpan("week") 
});
function changeTimeSpan(unit){
    if(hourlyOrWeekly !== unit){
        hourlyOrWeekly = unit;
        if(unit === "hourly"){
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");

        }else if(unit === "week"){
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyOrWeekly);
    }

}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const location = searchInput.value.trim();
    if (location) {
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyOrWeekly);
    } else {
        alert("Please enter a city name");
    }
});

