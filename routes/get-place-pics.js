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

function getPlacePics(req, res) {
    return res.db.query(
        'SELECT ' + PIC_COLUMNS.join(',') + ' ' +
        'FROM pics ' +
        'WHERE placeId=? ' +
        'ORDER BY createdAt DESC',
        req.params.placeId
    );
}

router.get('/places/all/pics', (req, res) => {
    if (!('places' in req.query)) {
        return res.status(500).json({status: 'Error', errors: ['places param required.']})
    }

    res.db.query(
        'SELECT ' + PIC_COLUMNS.join(',') + ' ' +
        'FROM pics ' +
        'WHERE placeId IN(?)',
        [req.query.places.split(',').map(p => p.trim())]
    ).then(
        rows => res.json({status: 'Ok', errors: [], pics: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

router.get('/places/:placeId/pics', (req, res) => {
    getPlacePics(req, res).then(
        rows => res.json({status: 'Ok', errors: [], pics: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

router.get('/places/:placeId/pics/users', (req, res) => {
    getPlacePics(req, res).then(pics => {
        if (pics.length === 0) {
            return res.json({status: 'Ok', errors: [], pics: []})
        }

        let usersIds = pics
            .map(row => row.userId)
            .filter((userId, index, self) => self.indexOf(userId) === index);

        return res.db.query(
            'SELECT id, name, email, profilePicPath, createdAt, updatedAt ' +
            'FROM users ' +
            'WHERE id IN (?)',
            [usersIds]
        ).then(users => {
            var usersHash = users.reduce((hash, user) => {
                user.pics = [];

                hash[user.id] = user;

                return hash;
            }, {});

            pics.forEach(pic => {
                pic.user = Object.assign({}, usersHash[pic.userId]);
                delete pic.userId;
            });

            return pics;
        });
    }).then(
        rows => res.json({status: 'Ok', errors: [], pics: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

module.exports = router;
