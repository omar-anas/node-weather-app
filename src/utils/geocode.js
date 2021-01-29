const request = require('request');

const geocode = (address, callback) => {
    const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1Ijoib21hcmFuYXMiLCJhIjoiY2tqdm96eHFwMGFoODJubHNlYXc1M2RvZyJ9.yNRHae29ReXX0Orj8oiILA&limit=2`;
    request({ url: geoUrl, json: true }, (error, response) => {
        if (error) {
            callback('unable to connect weather service , try another time :)', undefined)
        }
        else if (response.body.features.length === 0) {
            callback('unable to find location ,try another search ', undefined);
        }
        else {
            callback(undefined, {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            });


        }
    })

}

module.exports=geocode;