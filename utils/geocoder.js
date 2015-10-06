var geocoderConfig = require('../config/geocoder');
var geocoder = require('node-geocoder');

var defaultInjections = [geocoderConfig.provider, geocoderConfig.adapter, geocoderConfig.extra];

function getGeocoder() {
    if (arguments.length > 0) {
        return geocoder.apply(geocoder, [].slice.call(arguments));
    }

    return geocoder.apply(geocoder, defaultInjections);
}

function middleware() {
    var geocoder;

    if (arguments.length > 0) {
        geocoder = getGeocoder(arguments[0], arguments[1], arguments[2]);
    } else {
        geocoder = getGeocoder(defaultInjections[0], defaultInjections[1], defaultInjections[2]);
    }

    return function (req, res, next) {
        res.geocoder = geocoder;

        next();
    }
}

module.exports = {
    getGeocoder: getGeocoder,
    middleware: middleware
};
