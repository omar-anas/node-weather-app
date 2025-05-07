const request = require('request');
const util = require('util');

// Convert request to use promises
const requestPromise = util.promisify(request);

const geocode = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
    
    try {
        const { body } = await requestPromise({
            url: geoUrl,
            json: true,
            headers: {
                'User-Agent': 'omaranas/1.0 (omar.anas61@hotmail.com)' // REQUIRED by Nominatim
            }
        });

        if (!body || body.length === 0) {
            throw new Error('Unable to find location. Try another search.');
        }

        return {
            latitude: parseFloat(body[0].lat),
            longitude: parseFloat(body[0].lon),
            location: body[0].display_name
        };
    } catch (error) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
            throw new Error('Unable to connect to geocoding service. Check your network connection.');
        }
        throw error;
    }
};

module.exports = geocode;