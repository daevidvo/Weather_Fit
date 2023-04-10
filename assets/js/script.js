var cityButtonList = document.querySelector('#cityButtonList')
var weatherCardSection = document.querySelector('#weatherCardSection')



function clearSearch(){
    var cityName = document.querySelector('#searchText').value

    document.querySelector('#searchText').value = '';

    removeOldInfo();


    geoFunc(cityName);
}

function geoFunc(cityName){
    fetch('http://api.openweathermap.org/geo/1.0/direct?q='+cityName+'&limit=1&appid=4b8fc9e50a57f1de38a6a899538e2356')
    .then(function (r){
        if(r.ok){
            return r.json();
        }
    })
    .then(function(data){
        forecastFunc(data[0])
        currentWeatherFunc(data[0])
    })
}

function forecastFunc(data){
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
            for (let x=0;x<5;x=x+1){
                var weatherCard = document.createElement('div')
                weatherCard.setAttribute('class', 'card m-1 weatherCard')
                weatherCard.setAttribute('style', 'width: 18rem;')
    
                var weatherCardInnerDiv = document.createElement('div')
                weatherCardInnerDiv.setAttribute('class', 'card-body')
    
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
                weatherCardHumid.textContent = 'Humidity: ' + data.list[x*8].main.humidity
    
                weatherCardInnerDiv.append(weatherCardDate, weatherCardTemp, weatherCardWind, weatherCardHumid)
                weatherCard.append(weatherCardInnerDiv)
                weatherCardSection.append(weatherCard)
            }
        }
        
    })
}

function cityButtonFunc(data){
    var button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('class', 'btn btn-secondary cityButton')
    button.setAttribute('data-city', data.city.name)
    button.textContent = data.city.name

    localStorage.setItem(data.city.name, data.city.name)

    cityButtonList.append(button)
}

function currentWeatherFunc(data){
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+data.lat+'&lon='+data.lon+'&appid=4b8fc9e50a57f1de38a6a899538e2356&units=imperial')
    .then(function (r){
        if(r.ok){
            return r.json();
        }
    })
    .then(function(data){
        if ($('.currentWeatherCard').children().length > 0) {
            return;
        } else {
        var currentWeatherCard = document.querySelector('.currentWeatherCard') 

        var currentWeatherDiv = document.createElement('div')
        currentWeatherDiv.setAttribute('class', 'card-body text-dark')

        var currentWeatherHeader = document.createElement('h5')
        currentWeatherHeader.setAttribute('class', 'card-title')
        currentWeatherHeader.textContent = 'Currently, the Weather for ' + data.name + ' Is:'

        var currentWeatherDate = document.createElement('h6')
        currentWeatherDate.setAttribute('class', 'card-title')
        currentWeatherDate.textContent = dayjs.unix(data.dt).format('MM/DD/YYYY')

        var currentWeatherTemp = document.createElement('p')
        currentWeatherTemp.setAttribute('class', 'card-text')
        currentWeatherTemp.textContent = 'Temp: ' + data.main.temp + '\u00B0F'

        var currentWeatherWind = document.createElement('p')
        currentWeatherWind.setAttribute('class', 'card-text')
        currentWeatherWind.textContent = 'Wind: ' + data.wind.speed + 'MPH'

        var currentWeatherHumid = document.createElement('p')
        currentWeatherHumid.setAttribute('class', 'card-text')
        currentWeatherHumid.textContent = 'Humidity: ' + data.main.humidity

        currentWeatherDiv.append(currentWeatherHeader, currentWeatherDate, currentWeatherTemp, currentWeatherWind, currentWeatherHumid)
        currentWeatherCard.append(currentWeatherDiv)
        }
    })

}

function reselectCityFunc(e){
    removeOldInfo();
    geoFunc(e.target.getAttribute('data-city'))
    $(e.target).remove();
}

function removeOldInfo(){
    $('#weatherCardSection').children().remove();
    $('.currentWeatherCard').children().remove();
}

function rememberCities(){
    if (localStorage){
        for (let x=0;x<localStorage.length;x=x+1){
            geoFunc(localStorage.key(x));
        }
    }
}

rememberCities();
$(cityButtonList).on('click', '.cityButton', reselectCityFunc)
$('#searchButton').on('click', function(e){
    e.preventDefault()
    clearSearch()
})
