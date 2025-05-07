const request = require('request');
const util = require('util');

// Convert request to use promises
const requestPromise = util.promisify(request);

const forecast = async (latitude, longitude) => {
    console.log("latitude", latitude, "longitude", longitude);
    const apiKey = 'f2d1d05135884d139b640941250705'; // Your WeatherAPI key
    const foreUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=1`;
    
    try {
        const { body } = await requestPromise({ 
            url: foreUrl, 
            json: true,
            timeout: 5000
        });

        if (body.error) {
            throw new Error(`Weather service error: ${body.error.message}`);
        }
        if (!body.current || !body.forecast?.forecastday?.[0]?.hour) {
            throw new Error('Unexpected weather data format received');
        }

        const current = body.current;
        const forecastHours = body.forecast.forecastday[0].hour;

        
        
        // Get temperatures for specific hours (3, 6, 9, 12)
        const getHourTemp = (hour) => {
            const hourData = forecastHours.find(h => new Date(h.time).getHours() === hour);
            return hourData ? hourData.temp_c.toFixed(0) : 'N/A';
        };
        
        console.log(body.location?.country,  current.temp_c.toFixed(0),current.humidity,getHourTemp(6), body.forecast.forecastday[0]?.day?.condition?.text);
        return {
            location: {
                name: body.location?.name,
                region: body.location?.region,
                country: body.location?.country
            },
            current: {
                temp: current.temp_c.toFixed(0),
                feels_like: current.feelslike_c.toFixed(0),
                weather: {
                    main: current.condition.text,
                    description: current.condition.text,
                    icon: `https:${current.condition.icon.replace('64x64', '128x128')}`
                },
                humidity: current.humidity,
                wind_speed: current.wind_kph,
                wind_dir: current.wind_dir,
                uv: current.uv,
                visibility: current.vis_km
            },
            hourly: {
                temp3: getHourTemp(3),
                temp6: getHourTemp(6),
                temp9: getHourTemp(9),
                temp12: getHourTemp(12),
                next_3_hours: forecastHours.slice(0, 3).map(h => ({
                    time: h.time,
                    temp: h.temp_c.toFixed(0),
                    condition: h.condition.text
                }))
            },
            daily: {
                max_temp: body.forecast.forecastday[0]?.day?.maxtemp_c,
                min_temp: body.forecast.forecastday[0]?.day?.mintemp_c,
                condition: body.forecast.forecastday[0]?.day?.condition?.text
            }
        };
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
            throw new Error('Unable to connect to weather service. Check your network connection.');
        }
        throw error;
    }
};

module.exports = forecast;