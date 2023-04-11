var cityButtonList = document.querySelector('#cityButtonList') //selector to add each city's buttons later
var weatherCardSection = document.querySelector('#weatherCardSection') //selector to add current weather information later

function clearSearch(){ //function to clear the search bar and passes along the city name to the function that locates the city's latitude and longitude information
    var cityName = document.querySelector('#searchText').value 

    document.querySelector('#searchText').value = ''; //clears the search bar

    removeOldInfo(); //removes the old weather information if there are any

    geoFunc(cityName);
}

function geoFunc(cityName){
    fetch('https://api.openweathermap.org/geo/1.0/direct?q='+cityName+'&limit=1&appid=4b8fc9e50a57f1de38a6a899538e2356')
    .then(function (r){
        if(r.status === 200){
            return r.json();
        } else {
            document.querySelector('#searchText').value = 'Please Type in a City'; //if the user doesn't type in anything, then this will display in the search bar
        }
    })
    .then(function(data){
        forecastFunc(data[0]) //gives the data information to the 5-day forecast function 
        currentWeatherFunc(data[0]) //gives the data information to the current weather function 
    })
}

function forecastFunc(data){ //function to call the forecast information along with displaying the information
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+data.lat+'&lon='+data.lon+'&appid=4b8fc9e50a57f1de38a6a899538e2356&units=imperial')
    .then(function (r){
        if(r.ok){
            return r.json();
        }
    })
    .then(function(data){
        cityButtonFunc(data)
        if ($(weatherCardSection).children().length > 0) { //checks to see if there is more than 1 city's five day forecast in the section. If there isn't, then it will show the data. This is here to stop showing multiple city forecasts' on refresh
            return;
        } else {
            for (let x=0;x<5;x=x+1){ //goes through the data and creates the 5 day weather forecast cards. every day's information is based on current iteration number.
                var weatherCardOuterDiv = document.createElement('div')
                weatherCardOuterDiv.setAttribute('class', 'card m-1 weatherCard')
                weatherCardOuterDiv.setAttribute('style', 'width: 18rem;')
    
                var weatherCardInnerDiv = document.createElement('div')
                weatherCardInnerDiv.setAttribute('class', 'card-body')
                
                var weatherCardImg = document.createElement('img')
                weatherCardImg.setAttribute('class', 'card-img-top w-25 p-3')
                
                weatherCardImg.setAttribute('src', `./assets/images/${data.list[x*8].weather[0].main}.svg`) //have to multiply x by 8 so that we can get information every 24 hours. In the api call, the weather is separated in 3 hour increments so 3*8=24 hour increments.
                weatherCardImg.setAttribute('alt', 'card image cap')
    
                var weatherCardDate = document.createElement('p')
                weatherCardDate.setAttribute('class', 'card-text')
                weatherCardDate.textContent = dayjs(data.list[x*8].dt_txt.split(' ')[0]).format('MM/DD/YYYY')
    
                var weatherCardTemp = document.createElement('p')
                weatherCardTemp.setAttribute('class', 'card-text')
                weatherCardTemp.textContent = 'Max Temp: ' + data.list[x*8].main.temp_max + '\u00B0F'
                
                var weatherCardWind = document.createElement('p')
                weatherCardWind.setAttribute('class', 'card-text')
                weatherCardWind.textContent = 'Wind: ' + data.list[x*8].wind.speed + 'MPH'
                
                var weatherCardHumid = document.createElement('p')
                weatherCardHumid.setAttribute('class', 'card-text')
                weatherCardHumid.textContent = 'Humidity: ' + data.list[x*8].main.humidity + '%'
    
                weatherCardInnerDiv.append(weatherCardImg, weatherCardDate, weatherCardTemp, weatherCardWind, weatherCardHumid)
                weatherCardOuterDiv.append(weatherCardInnerDiv)
                weatherCardSection.append(weatherCardOuterDiv)
            }
        }
    })
}

function cityButtonFunc(data){ //function to store and create the city buttons on the left side of the page.
    var button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('class', 'btn btn-secondary cityButton')
    button.setAttribute('data-city', data.city.name) //makes a data attribute with the city name
    button.textContent = data.city.name

    localStorage.setItem(data.city.name, data.city.name) //saves the user queried city in localStorage

    cityButtonList.append(button) //appends the city button to the list below the search bar
}

function currentWeatherFunc(data){ //function to display what the current weather is using the geo data from the geoFunc()
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+data.lat+'&lon='+data.lon+'&appid=4b8fc9e50a57f1de38a6a899538e2356&units=imperial')
    .then(function (r){
        if(r.ok){
            return r.json();
        }
    })
    .then(function(data){ 
        if ($('.currentWeatherCard').children().length > 0) { // checks to see if there is something currently in the weather card. If there isn't, then it will fill in the information. Have to do this if we want information to persist throughout refreshes and sessions.
            return;
        } else { //create all of the icons, cards, and weather information
        var currentWeatherCard = document.querySelector('.currentWeatherCard') 

        var currentWeatherDiv = document.createElement('div')
        currentWeatherDiv.setAttribute('class', 'card-body text-dark')

        var currentWeatherImg = document.createElement('img')
        currentWeatherImg.setAttribute('class', 'card-img-top w-25 p-2 mx-auto')
        currentWeatherImg.setAttribute('src', `./assets/images/${data.weather[0].main}.svg`)
        currentWeatherImg.setAttribute('alt', 'card image cap')

        var currentWeatherHeader = document.createElement('h5')
        currentWeatherHeader.setAttribute('class', 'card-title')
        currentWeatherHeader.textContent = 'Currently, the Weather for ' + data.name + ' is:'

        var currentWeatherDate = document.createElement('h6')
        currentWeatherDate.setAttribute('class', 'card-title')
        currentWeatherDate.textContent = dayjs.unix(data.dt).format('MM/DD/YYYY') //have to do unix here because of the way the current date is formatted through the openweather api

        var currentWeatherTemp = document.createElement('p')
        currentWeatherTemp.setAttribute('class', 'card-text')
        currentWeatherTemp.textContent = 'Temp: ' + data.main.temp + '\u00B0F'

        var currentWeatherWind = document.createElement('p')
        currentWeatherWind.setAttribute('class', 'card-text')
        currentWeatherWind.textContent = 'Wind: ' + data.wind.speed + 'MPH'

        var currentWeatherHumid = document.createElement('p')
        currentWeatherHumid.setAttribute('class', 'card-text')
        currentWeatherHumid.textContent = 'Humidity: ' + data.main.humidity + '%'

        currentWeatherDiv.append(currentWeatherHeader, currentWeatherDate, currentWeatherTemp, currentWeatherWind, currentWeatherHumid)
        currentWeatherCard.append(currentWeatherImg, currentWeatherDiv) //wanted to append the currentWeatherImg first before the div so that it's on top of the current weather information.
        }
    })

}

function reselectCityFunc(e){ //function that listens for the city button presses on the left side of the screen and displays the information again.
    removeOldInfo(); //removes the old information about current weather and five day weather forecast.
    geoFunc(e.target.getAttribute('data-city')) //calls on the data-city attribute to get the city name again.
    $(e.target).remove(); //have to remove the button or else it would duplicate once it goes through the geoFunc again. I could rework how the functions are organized but this will have to do for now.
}

function removeOldInfo(){ //removes the current city weather information along with the five day weather forecast. Call this function whenever we're switching cities
    $('#weatherCardSection').children().remove();
    $('.currentWeatherCard').children().remove();
}

function rememberCities(){ //function to recall button list on the left side along with displaying information on reloads.
    if (localStorage){ //checks to see if there is something in localStorage that the function could use.
        for (let x=0;x<localStorage.length;x=x+1){ //if there is something, then it will iterate through the list for the length of the localStorage items and add them to the current information displayed.
            geoFunc(localStorage.key(x));
        }
    }
}

rememberCities(); //executes the function to recall information in localStorage on loads
$(cityButtonList).on('click', '.cityButton', reselectCityFunc) //event listener on the parent element of the cityButtons and delegated to the specific button themselves.
$('#searchButton').on('click', function(e){ //event listener for the submit of the city search bar
    e.preventDefault() //prevents the form from submitting and reloading the page
    clearSearch() //clears the search bar whenever the user submits something
})