'use strict';

var router = require('express').Router();

router.get('/places/all/pics', (req, res) => {
    if (!('places' in req.query)) {
        return res.status(500).json({status: 'Error', errors: ['places param required.']})
    }

    res.db.query(
        'SELECT id, userId, placeId, status, path, createdAt, updatedAt ' +
        'FROM pics ' +
        'WHERE placeId IN(?)',
        [req.query.places.split(',').map(p => p.trim())]
    ).then(
        rows => res.json({status: 'Ok', errors: [], pics: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

router.get('/places/:placeId/pics', (req, res) => {
    res.db.query(
        'SELECT id, userId, placeId, status, path, createdAt, updatedAt ' +
        'FROM pics ' +
        'WHERE placeId=?',
        req.params.placeId
    ).then(
        rows => res.json({status: 'Ok', errors: [], pics: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

module.exports = router;
