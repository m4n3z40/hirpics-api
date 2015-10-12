'use strict';

var mysql = require('mysql');
var Promise = require('bluebird');

var dbPool = mysql.createPool(require('../config/db'));

function getConnection() {
    return new Promise((resolve, reject) => {
        dbPool.getConnection((err, connection) => {
            if (err) {
                console.error('Could not connect to the database: ' + err.message);

                return reject(err);
            }

            console.log('Connected to the database. ID ' + connection.threadId);

            connection.on('error', err => {
                console.error('Error in connection with ID ' + connection.threadId + ': ' + err.message);
            });

            resolve(connection);
        });
    });
}

function queryWithConnection(connection, query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            connection.release();

            if (err) {
                return reject(err);
            }

            resolve(result);
        });
    });
}

function query(query, params) {
    return getConnection()
        .then(connection => queryWithConnection(connection, query, params));
}

function middleware() {
    return (req, res, next) => {
        res.db = res.db || {};

        res.db.getConnection = getConnection;
        res.db.queryWithConnection = queryWithConnection;
        res.db.query = query;

        next();
    };
}

module.exports = {
    getConnection: getConnection,
    queryWithConnection: queryWithConnection,
    query: query,
    middleware: middleware
};
