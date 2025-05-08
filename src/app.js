const path = require('path');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const express = require('express');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT || 3000;

//creating paths
const publicdir = path.join(__dirname, '../public');
const partials = path.join(__dirname, '../templates/partials');
const viewpath = path.join(__dirname, '../templates/views');

//setup handelpars and view locations
app.set('view engine', 'hbs');
app.set('views', viewpath);
hbs.registerPartials(partials);

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve static files
app.use('/', express.static(publicdir));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'HELP',
        name: 'omar'
    })
});

app.get('/weather', async (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'you must provide an address!' });
    }

    try {
        const geoData = await geocode(req.query.address);
        const forecastData = await forecast(geoData.latitude, geoData.longitude);

        res.send({
            location: {
                name: forecastData.location.name,
                region: forecastData.location.region,
                country: forecastData.location.country
            },
            current: {
                temp: forecastData.current.temp,
                weather: forecastData.current.weather,
                humidity: forecastData.current.humidity,
                wind_speed: forecastData.current.wind_speed,
                wind_dir: forecastData.current.wind_dir,
                uv: forecastData.current.uv,
                visibility: forecastData.current.visibility
            },
            hourly: forecastData.hourly,
            daily: forecastData.daily
        });

    } catch (error) {
        res.send({ error: error.message });
    }
});

app.get('*', (req, res) => {
    res.render('page404')
});

app.listen(port, () => {
    console.log('this server is working right now on port' + port);
});