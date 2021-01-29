const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const foreUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=daily,minutely&appid=7f53f9671a4f0dee71197203651f1380`;
    request({ url: foreUrl, json: true }, (error, response) => {
        if (error) {
            callback('unable to connect weather service , try another time :)', undefined)
        }
        else if (response.body.cod === 400) {
            callback('unable to find coordinates ,try another search ', undefined);
        }
        else{
            callback(undefined,{
                temp:((response.body.current.temp-273.15).toFixed(0)),
                main:response.body.current.weather[0].description,
                icon:response.body.current.weather[0].icon,
                temp3:((response.body.hourly[2].temp-273.15).toFixed(0)),
                temp6:((response.body.hourly[5].temp-273.15).toFixed(0)),
                temp9:((response.body.hourly[8].temp-273.15).toFixed(0)),
                temp12:((response.body.hourly[11].temp-273.15).toFixed(0))
            })
        }

        
    });
}
module.exports=forecast;