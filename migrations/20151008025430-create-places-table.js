var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function (db, callback) {
    db.createTable('places', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unsigned: true,
            length: 11,
            notNull: true
        },
        googlePlaceId: {type: type.STRING, length: 80, notNull: true},
        formattedAddress: {type: type.STRING, length: 255, notNull: true},
        latitude: {type: type.DECIMAL, length: [10, 8], notNull: true},
        longitude: {type: type.DECIMAL, length: [11, 8], notNull: true},
        country: {type: type.STRING, length: 45, notNull: true},
        countryCode: {type: type.STRING, length: 3, notNull: true},
        city: {type: type.STRING, length: 45, notNull: true},
        streetName: {type: type.STRING, length: 140, notNull: true},
        streetNumber: {type: type.STRING, length: 10, notNull: true},
        zipcode: {type: type.STRING, length: 10, notNull: true},
        administrativeLevels: {type: type.STRING, length: 450, notNull: true},
        extras: {type: type.STRING, length: 450, notNull: true}
    }, callback);
};

exports.down = function (db, callback) {
    db.dropTable('places', callback);
};
