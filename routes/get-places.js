'use strict';

var router = require('express').Router();

const PLACE_COLUMNS = [
    'id',
    'googlePlaceId',
    'formattedAddress',
    'latitude',
    'longitude',
    'country',
    'countryCode',
    'city',
    'streetName',
    'streetNumber',
    'zipcode',
    'admLevel1Short',
    'admLevel1Long',
    'admLevel2Short',
    'admLevel2Long',
    'premise',
    'subpremise',
    'neighborhood',
    'establishment',
    'lastPicPath',
    'picsCount',
    'createdAt',
    'updatedAt'
];

function convertDistanceToKm(place) {
    if (place.distance) {
        // Converting to km
        place.distance = Math.sqrt(place.distance) * 1.609344;
    }

    return place;
}

function handlerErrors(res, err) {
    res.status(500).json({status: 'Error', errors: [err.message]});
}

router.get('/places/:placeId', (req, res) => {
    res.db.query(
        'SELECT ' + PLACE_COLUMNS.join(',') + ' ' +
        'FROM places ' +
        'WHERE id=? ' +
        'LIMIT 1',
        req.params.placeId
    ).then(
        rows => {
            if (rows.length === 0) {
                return res.status(404).json({status: 'Error', errors: ['Place not found.']});
            }

            res.json({status: 'Ok', errors: [], place: rows[0]});
        },
        err => handlerErrors(res, err)
    );
});

router.get('/places', (req, res) => {
    res.db.query(
        'SELECT ' + PLACE_COLUMNS.join(',') + ' ' +
        'FROM places'
    ).then(
        rows => res.json({status: 'Ok', errors: [], places: rows}),
        err => handlerErrors(res, err)
    );
});

router.get('/places/nearest/:lat/:lon/:maxDistance?', (req, res) => {
    let lat = Number(req.params.lat),
        lon = Number(req.params.lon),
        distanceRadius = (Number(req.params.maxDistance) || 20) * 0.62137119, //Miles
        maxResults = 20;

    res.db.query(
        'SELECT ' + PLACE_COLUMNS.join(',') + ', (' +
        'POW(69.1 * (latitude - (' + lat + ')), 2) + ' +
        'POW(69.1 * ((' + lon + ') - longitude) * COS(latitude / 57.3), 2) ' +
        ') AS distance ' +
        'FROM places HAVING distance < ' + (distanceRadius * distanceRadius)+ ' ' +
        'ORDER BY distance ' +
        'LIMIT ' + maxResults
    ).then(
        rows => res.json({status: 'Ok', errors: [], places: rows.map(convertDistanceToKm)}),
        err => handlerErrors(res, err)
    );
});

module.exports = router;