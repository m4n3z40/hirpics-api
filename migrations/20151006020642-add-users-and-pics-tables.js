var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function (db, callback) {
    db.createTable('users', {
        columns: {
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
            password: {type: type.STRING, length: 128, notNull: true}
        },
        ifNotExists: true
    }, createPicsTable);

    function createPicsTable() {
        db.createTable('pics', {
            columns: {
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
                googlePlaceId: {type: type.STRING, length: 80, notNull: true},
                path: {type: type.STRING, length: 255, notNull: true},
                latitude: {type: type.DECIMAL, length: [10, 8], notNull: true},
                longitude: {type: type.DECIMAL, length: [11, 8], notNull: true}
            },
            ifNotExists: true
        }, callback);
    }
};

exports.down = function (db, callback) {
    db.dropTable('users', dropPicsTable);

    function dropPicsTable() {
        db.dropTable('pics', callback);
    }
};
