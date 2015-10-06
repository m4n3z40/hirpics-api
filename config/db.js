'use strict';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

var jsonConfig = require('./database')[IS_PRODUCTION ? 'prod' : 'dev'];

var config = Object.assign({}, jsonConfig, {
    connectionLimit: 100,
    debug: true
});

if (IS_PRODUCTION) {
    config.debug = false;
}

module.exports = config;
