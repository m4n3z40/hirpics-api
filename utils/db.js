'use strict';

var mysql = require('mysql');
var Promise = require('bluebird');

var dbPool = mysql.createPool(require('../config/db'));

function getConnection() {
    return new Promise(function(resolve, reject) {
        dbPool.getConnection(function (err, connection) {
            if (err) {
                console.error('Could not connect to the database: ' + err.message);

                return reject(err);
            }

            console.log('Connected to the database. ID ' + connection.threadId);

            connection.on('error', function(err) {
                console.error('Error in connection with ID ' + connection.threadId + ': ' + err.message);
            });

            resolve(connection);
        });
    });
}

function query(query, params) {
    return getConnection().then(function (connection) {
        return new Promise(function(resolve, reject) {
            connection.query(query, params, function(err, result) {
                connection.release();

                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });
    });
}

function middleware() {
    return function(req, res, next) {
        res.db = res.db || {};

        res.db.query = query;

        next();
    };
}

module.exports = {
    getConnection: getConnection,
    query: query,
    middleware: middleware
};
