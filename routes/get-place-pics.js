'use strict';

var router = require('express').Router();

router.get('/places/:placeId/pics', (req, res) => {
    res.db.query(
        'SELECT id, userId, placeId, status, path, createdAt, updatedAt ' +
        'FROM pics ' +
        'WHERE placeId=?',
        req.params.placeId
    ).then(
        rows => res.json({status: 'Ok', errors: [], places: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

module.exports = router;
