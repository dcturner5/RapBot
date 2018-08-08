var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var database;

module.exports = {
    connect: function() {
        MongoClient.connect('mongodb://localhost:27017/rapbot',
            function(err, db) {
                if(err) return console.log('Error: ' + err);
                database = db;
                console.log('Database connected');
            });
    },
    connected: function() {
        return typeof database != 'undefined';
    },
    getLines: function(artistId, cb) {
        var cursor = database.collection('lines').find({
            artistId: artistId
        });
        cursor.toArray(function(err, results) {
            if(err) return cb(err);
            cb(null, results);
        });
    },
    getRandomLine: function(artistId, cb) {
        database.collection('lines').aggregate([
            {$match: {artistId: parseInt(artistId)}},
            {$sample: {size: 1}}
        ], function(err, result) {
            if(err) return cb(err);
            cb(null, result);
        });
    },
    getQuatrain: function(artistId, quatrainId, cb) {
        var cursor = database.collection('lines').find({
            artistId: artistId,
            quatrainId: quatrainId
        });
        cursor.toArray(function(err, results) {
            if(err) return cb(err);
            return cb(null, results);
        });
    },
    getRandomQuatrain: function(artistId, cb) {
        this.getRandomLine(artistId, function(err, results) {
            if(err) return cb(err);
            if(results.length == 0) return cb('No Random Line Results');
            var cursor = database.collection('lines').find({
                artistId: parseInt(artistId),
                quatrainId: results[0].quatrainId
            });
            cursor.toArray(function(err, results) {
                if(err) return cb(err);
                cb(null, results);
            });
        });
    },
    insertLine: function(artistId, quatrainId, quatrainIndex, content, cb) {
        var cursor = database.collection('lines').find({
            artistId: artistId,
            content: content
        });
        cursor.toArray(function(err, results) {
            if(results.length == 0) {
                database.collection('lines').insert({
                    artistId: artistId,
                    quatrainId: quatrainId,
                    quatrainIndex: quatrainIndex,
                    content: content
                }, function (err, result) {
                    if (err) return cb(err, result);
                    return cb(null, result);
                });
            }
        });
    }
};