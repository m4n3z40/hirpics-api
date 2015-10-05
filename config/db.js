'use strict';

var config = {
    connectionLimit: 100,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'hirpics',
    port: 3307,
    debug: true
};

if (process.env.NODE_ENV === 'production') {
    config.debug = false;
    config.port = 3306;
}

module.exports = config;
