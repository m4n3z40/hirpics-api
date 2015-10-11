'use strict';

var router = require('express').Router();

function deserializePlaceExtras(place) {
    try {
        place.administrativeLevels = JSON.parse(place.administrativeLevels);
        place.extra = JSON.parse(place.extra);
    } catch(e) {
        console.error(e);
    }

    return place;
}

router.get('/places/:placeId', (req, res) => {
    res.db.query(
        'SELECT id, googlePlaceId, formattedAddress, latitude, longitude, country, ' +
        'countryCode, city, streetName, streetNumber, zipcode, administrativeLevels, ' +
        'extras, createdAt, updatedAt ' +
        'FROM places ' +
        'WHERE id=? ' +
        'LIMIT 1',
        req.params.placeId
    ).then(
        rows => {
            if (rows.length === 0) {
                return res.status(404).json({status: 'Error', errors: ['Place not found.']});
            }

            res.json({status: 'Ok', errors: [], place: deserializePlaceExtras(rows[0])});
        },
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

router.get('/places', (req, res) => {
    res.db.query(
        'SELECT id, googlePlaceId, formattedAddress, latitude, longitude, country, ' +
        'countryCode, city, streetName, streetNumber, zipcode, administrativeLevels, ' +
        'extras, createdAt, updatedAt ' +
        'FROM places'
    ).then(
        rows => res.json({status: 'Ok', errors: [], places: rows.map(deserializePlaceExtras)}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

module.exports = router;