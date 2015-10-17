'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var multer = require('multer')({dest: './uploads/'});

var UsersApi = require('./routes/users');
var getPlacesApi = require('./routes/get-places');
var getUserPicsApi = require('./routes/get-user-pics');
var getPlacePicsApi = require('./routes/get-place-pics');
var savePicApi = require('./routes/save-pic');

var app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./utils/db').middleware());
app.use(require('./utils/geocoder').middleware());

app.use('/api', cors());
app.use('/api', UsersApi);
app.use('/api', getPlacesApi);
app.use('/api', getUserPicsApi);
app.use('/api', getPlacePicsApi);
app.use('/api', multer.single('pic'), savePicApi);

app.use('/public/pics', express.static('./pics'));

app.get('/', (req, res) => res.send('HirPics Api Server - nothing to see here.'));

var server = app.listen(process.env.PORT || 3000, () => {
    var host = server.address().address,
        port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
