'use strict';

var fs = require('fs');
var path = require('path');
var mime = require('mime-types');
var mkdirp = require('mkdirp');

var router = require('express').Router();

function catchPossibleReqErrors(req) {
    let body = req.body,
        errors = [];

    if (!('lat' in body)) {
        errors.push(new Error('Field "lat" is required.'));
    }

    if (!('lon' in body)) {
        errors.push(new Error('Field "lon" is required.'));
    }

    if (!('userId' in body)) {
        errors.push(new Error('Field "userId" is required.'));
    }

    if (!req.file) {
        errors.push(new Error('File "pic" is required.'));
    }

    return errors.length > 0 ? errors : null;
}

function handleErrors(req, res, errors) {
    if (req.file) {
        fs.unlink(req.file.path);
    }

    console.error('Errors while saving pic: ', errors);

    res.status(500).json({status: 'Error', errors});
}

function saveNewPlace(req, res) {
    let place = req.body.place,
        admLevels = place.administrativeLevels,
        extra = place.extra;

    return res.db.query('INSERT INTO places SET ?', {
        googlePlaceId: extra.googlePlaceId || '',
        formattedAddress: place.formattedAddress || '',
        latitude: place.latitude || '',
        longitude: place.longitude || '',
        country: place.country || '',
        countryCode: place.countryCode || '',
        city: place.city || '',
        streetName: place.streetName || '',
        streetNumber: place.streetNumber || '',
        zipcode: place.zipcode || '',
        admLevel1Short: admLevels.level1short || '',
        admLevel1Long: admLevels.level1long || '',
        admLevel2Short: admLevels.level2short || '',
        admLevel2Long: admLevels.level2long || '',
        premise: extra.premise || '',
        subpremise: extra.subpremise || '',
        neighborhood: extra.neighborhood || '',
        establishment: extra.establishment || '',
        createdAt: new Date(),
        updatedAt: new Date()
    }).then(
        result => result.insertId,
        error => { throw error; }
    );
}

function getPlaceId(req, res) {
    return res.geocoder.reverse({lat: req.body.lat, lon: req.body.lon})
        .then(results => {
            req.body.place = results[0];

            return res.db.query(
                'SELECT id FROM places WHERE googlePlaceId=?',
                [req.body.place.extra.googlePlaceId]
            );
        }, error => handleErrors(req, res, [error.message]))
        .then(rows => {
            if (!rows || !rows.length) {
                console.log('Place not found, creating new one: ', req.body.place);

                return saveNewPlace(req, res);
            }

            console.log('Place already exists: place id ', rows);

            return rows[0].id;
        }, error => handleErrors(req, res, [error.message]))
}

function moveUploadedPic(file, destination) {
    let rootPath = path.join(__dirname, '..'),
        picsPath = path.join(rootPath, 'pics'),
        from = path.join(rootPath, file.path),
        fileExtension = '.' + mime.extension(file.mimetype),
        to = path.join(picsPath, destination, file.filename + fileExtension),
        toPath = to.split('/').filter(s => !s.endsWith(fileExtension)).join('/');

    return new Promise((resolve, reject) => {
        mkdirp(toPath, err => {
            if (err) {
                return reject(err);
            }

            fs.rename(from, to, err => {
                if (err) {
                    return reject(err);
                }

                resolve(to.replace(picsPath, ''));
            });
        });
    });
}

function saveNewPic(req, res, picpath) {
    let body = req.body;

    return res.db.query('INSERT INTO pics SET ?', {
        userId: body.userId,
        placeId: body.place.id,
        googlePlaceId: body.place.extra.googlePlaceId,
        status: body.status,
        path: picpath,
        latitude: body.lat,
        longitude: body.lon,
        createdAt: new Date(),
        updatedAt: new Date()
    });
}

router.post('/pics', (req, res) => {
    let fieldErrors = catchPossibleReqErrors(req);

    if (fieldErrors) {
        return handleErrors(req, res, fieldErrors.map(e => e.message));
    }

    getPlaceId(req, res)
        .then(placeId => {
            req.body.place.id = placeId;

            console.log('Saving image file: ', req.file);

            return moveUploadedPic(req.file, `place_${placeId}`);
        }, error => handleErrors(req, res, [error.message]))
        .then(picpath => {
            console.log('Saving pic data: ', req.body);

            return saveNewPic(req, res, picpath);
        }, error => handleErrors(req, res, [error.message]))
        .then(() => {
            console.log('Pic saved successfuly.');

            res.json({status: 'Ok', errors: null});
        }, error => handleErrors(req, res, [error.message]));
});

module.exports = router;
