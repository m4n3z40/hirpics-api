'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./utils/db').middleware());
app.use(require('./utils/geocoder').middleware());

app.get('/', function (req, res) {
    res.send('HirPics Api Server - nothing to see here.');
});

var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
