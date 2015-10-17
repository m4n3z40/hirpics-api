'use strict';

var router = require('express').Router();

const PIC_COLUMNS = [
    'id',
    'userId',
    'placeId',
    'status',
    'path',
    'createdAt',
    'updatedAt'
];

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

function getUserPics(req, res) {
    return res.db.query(
        'SELECT ' + PIC_COLUMNS.join(',') + ' ' +
        'FROM pics ' +
        'WHERE userId=?' +
        'ORDER BY createdAt DESC',
        req.params.userId
    );
}

router.get('/users/:userId/pics', (req, res) => {
    getUserPics(req, res).then(
        rows => res.json({status: 'Ok', errors: [], pics: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

router.get('/users/:userId/places/pics', (req, res) => {
    getUserPics(req, res).then(pics => {
        if (pics.length === 0) {
            return res.json({status: 'Ok', errors: [], pics: []})
        }

        let placesIds = pics
            .map(row => row.placeId)
            .filter((placeId, index, self) => self.indexOf(placeId) === index);

        return res.db.query(
            'SELECT ' + PLACE_COLUMNS.join(',') + ' ' +
            'FROM places ' +
            'WHERE id IN (?)',
            [placesIds]
        ).then(places => {
            var placesHash = places.reduce((hash, place) => {
                place.pics = [];

                hash[place.id] = place;

                return hash;
            }, {});

            pics.forEach(pic => placesHash[pic.placeId].pics.push(pic));

            return Object.keys(placesHash).map(key => placesHash[key]).reverse();
        });
    })
    .then(
        rows => res.json({status: 'Ok', errors: [], places: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

module.exports = router;
