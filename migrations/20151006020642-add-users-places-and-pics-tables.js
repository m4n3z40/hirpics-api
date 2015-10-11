var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function (db, callback) {
    db.createTable('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unsigned: true,
            length: 11,
            notNull: true
        },
        name: {type: type.STRING, length: 140, notNull: true},
        email: {type: type.STRING, length: 140, notNull: true},
        password: {type: type.STRING, length: 128, notNull: true},
        profilePicPath: {type: type.STRING, length: 255, notNull: false},
        createdAt: {type: type.DATE_TIME, notNull: true, defaultValue: new String('CURRENT_TIMESTAMP')},
        updatedAt: {type: type.DATE_TIME, notNull: false, defaultValue: null}
    }, insertDefaultUser);

    function insertDefaultUser(err) {
        if (err) return callback(err);

        db.insert(
            'users',
            ['name', 'email', 'password'],
            ['Allan Baptista', 'allan@ignit.io', '123456'],
            createPlacesTable
        );
    }

    function createPlacesTable(err) {
        if (err) return callback(err);

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
            extras: {type: type.STRING, length: 450, notNull: true},
            createdAt: {type: type.DATE_TIME, notNull: true, defaultValue: new String('CURRENT_TIMESTAMP')},
            updatedAt: {type: type.DATE_TIME, notNull: false, defaultValue: null}
        }, createPicsTable);
    }

    function createPicsTable(err) {
        if (err) return callback(err);

        db.createTable('pics', {
            id: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unsigned: true,
                length: 11,
                notNull: true
            },
            userId: {
                type: type.INTEGER, unsigned: true, length: 11, notNull: true, foreignKey: {
                    name: 'pics_user_id_fk',
                    table: 'users',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT'
                    },
                    mapping: 'id'
                }
            },
            placeId: {
                type: type.INTEGER, unsigned: true, length: 11, notNull: true, foreignKey: {
                    name: 'pics_places_id_fk',
                    table: 'places',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'RESTRICT'
                    },
                    mapping: 'id'
                }
            },
            googlePlaceId: {type: type.STRING, length: 80, notNull: true},
            status: {type: type.STRING, length: 140, notNull: false},
            path: {type: type.STRING, length: 255, notNull: true},
            latitude: {type: type.DECIMAL, length: [10, 8], notNull: true},
            longitude: {type: type.DECIMAL, length: [11, 8], notNull: true},
            createdAt: {type: type.DATE_TIME, notNull: true, defaultValue: new String('CURRENT_TIMESTAMP')},
            updatedAt: {type: type.DATE_TIME, notNull: false, defaultValue: null}
        }, callback);
    }
};

exports.down = function (db, callback) {
    db.dropTable('pics', dropPlacesTable);

    function dropPlacesTable(err) {
        if (err) return callback(err);

        db.dropTable('places', dropUsersTable);
    }

    function dropUsersTable(err) {
        if (err) return callback(err);

        db.dropTable('users', callback);
    }
};
