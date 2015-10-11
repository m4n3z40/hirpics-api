'use strict';

var router = require('express').Router();

router.get('/users/:userId/pics', (req, res) => {
    res.db.query(
        'SELECT id, userId, placeId, status, path, createdAt, updatedAt ' +
        'FROM pics ' +
        'WHERE userId=?',
        req.params.userId
    ).then(
        rows => res.json({status: 'Ok', errors: [], pics: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

module.exports = router;
