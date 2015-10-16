'use strict';

var router = require('express').Router();

router.get('/users/:userId', (req, res) => {
    res.db.query(
        'SELECT id, name, email, profilePicPath, createdAt, updatedAt ' +
        'FROM users ' +
        'WHERE id=? ' +
        'LIMIT 1',
        req.params.userId
    ).then(
        rows => {
            if (rows.length === 0) {
                return res.status(404).json({status: 'Error', errors: ['User not found.']});
            }

            res.json({status: 'Ok', errors: [], user: rows[0]});
        },
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

router.get('/users', (req, res) => {
    res.db.query('SELECT id, name, email, profilePicPath, createdAt, updatedAt FROM users').then(
        rows => res.json({status: 'Ok', errors: [], users: rows}),
        err => res.status(500).json({status: 'Error', errors: [err.message]})
    );
});

router.post('/users', (req, res) => {
    let user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        profilePicPath: req.body.profilePicPath,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    console.log(user);

    res.db.query('INSERT INTO users set ?', user).then(result => {
        user.id = result.insertId;

        res.json({status: 'Ok', errors: [], user: user});
    })
    .catch(err => res.status(500).json({status: 'Error', errors: [err.message]}));
});

module.exports = router;