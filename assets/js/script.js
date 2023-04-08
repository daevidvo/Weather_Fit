var cityButtonList = document.querySelector('#cityButton')
var weatherCardSection = document.querySelector('#weatherCardSection')



function clearSearch(){
    var cityName = document.querySelector('#searchText').value

    document.querySelector('#searchText').value = '';

    $('#weatherCardSection').children().remove();


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
        weatherFunc(data[0])
    })
}

function weatherFunc(data){
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+data.lat+'&lon='+data.lon+'&appid=4b8fc9e50a57f1de38a6a899538e2356&units=imperial')
    .then(function (r){
        if(r.ok){
            return r.json();
        }
    })
    .then(function(data){
        cityButtonFunc(data)
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
            weatherCardTemp.textContent = 'Temp: ' + data.list[x*8].main.temp_max + '\u00B0F'
            
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
        console.log(data)
    })
}

function cityButtonFunc(data){
    var button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('class', 'btn btn-secondary')
    button.textContent = data.city.name

    cityButtonList.append(button)
}










$('#searchButton').on('click', clearSearch)
