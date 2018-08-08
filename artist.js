var Genius = require('node-genius');
var request = require('request');
var cheerio = require('cheerio');
var ObjectId = require('mongodb').ObjectId;

var config = require('./config');
var storage = require('./storage');

var geniusClient = new Genius(config.access_token);
storage.connect();

function Artist(names, cb) {
    this.id = -1;
    this.name = '';

    /**
     * Gets random line by the artist from local machine storage
     */
    this.getRandomLine = function(cb) {
        storage.getRandomLine(this.id, function(err, result) {
            if(result.length != 0) result = result[0];
            cb(result);
        })
    };

    /**
     * Gets a set of four lines in random order by the artist from local machine storage
     * Intended result is to have a set of lines that rhyme or go together naturally
     */
    this.getRandomQuatrain = function(cb) {
        storage.getRandomQuatrain(this.id, function(err, results) {
            if(err) {
                console.log(err);
                return cb([]);
            }
            cb(results);
        });
    };

    /**
     * Extracts lyrics by the artist using Genius API and stores them by quatrain in local machine storage
     * Only needs to be called ONCE, then just read from storage
     * Page number is used to split the number of songs researched into reasonable, smaller segments
     */
    this.research = function(page) {
        //Iterate through a constant number of songs to find artist lyrics
        const PER_PAGE = 50;
        geniusClient.getArtistSongs(this.id, {page: page, per_page: PER_PAGE}, function (error, results) {
            var songs = JSON.parse(results).response.songs;
            for (var i = 0; i < songs.length; i++) {
                geniusClient.getSong(songs[i].id, function (error, result) {
                    //Parse song page into an array of lyrics
                    var song = JSON.parse(result).response.song;
                    request({uri: song.url}, function (error, response, body) {
                        var $ = cheerio.load(body);
                        var lyrics = $('.lyrics').text();
                        lyrics = lyrics.split('\n');

                        //Sanitize all lyrics in the array and filter out non-lyric lines
                        var validLyrics = [];
                        var deleteLine = false;
                        try {
                            for (var j = 0; j < lyrics.length; j++) {
                                var lyric = lyrics[j].trim();
                                lyric = lyric.replace('?', '');
                                var valid = true;
                                if (lyric == '') {
                                    valid = false;
                                }
                                if (lyric.indexOf('[') != -1 && lyric.indexOf(']') != -1) {
                                    //Genius is not always consistent with artist names, so this checks all possible nicknames given
                                    //and changes the wrong names to the proper Genius name
                                    for(var k = 0; k < this.nicknames.length; k++) {
                                        var nickname = this.nicknames[k];
                                        if(lyric.indexOf(nickname) != -1) {
                                            lyric = lyric.replace(nickname, this.name);
                                        }
                                    }

                                    //If line is not a lyric and just info about the verse, filter it out
                                    if (lyric.indexOf(this.name) == -1 && lyric.indexOf('Verse') == -1) deleteLine = true;
                                    else deleteLine = false;
                                    valid = false;
                                }
                                if (deleteLine) {
                                    valid = false;
                                }

                                //Push lyric to a new list of valid lyrics if the line passes filters
                                if (valid) validLyrics.push(lyric);
                            }
                        }
                        catch(e) {

                        }

                        //Organize lyrics into quatrains and write to local machine storage
                        for(var j = 0; j < validLyrics.length / 4; j++) {
                            var quatrainId = new ObjectId();
                            for(var k = 0; k < 4; k++) {
                                if(j * 4 + k < validLyrics.length) {
                                    storage.insertLine(this.id, quatrainId, k, validLyrics[j * 4 + k], function (err, result) {
                                        if (err) console.log(err);
                                    });
                                }
                            }
                        }
                    }.bind(this));

                }.bind(this));
                console.log((i + 1) + ' SONGS RESEARCHED');
            }
        }.bind(this));
    };

    /**
     * Gets basic Genius data of artist based on name parameter
     * Called when initializing a new Artist object
     */
    this.getGeniusData = function(name, cb) {
        geniusClient.search(name, function (error, results) {
            if(error) return cb(error, {});
            var hits = JSON.parse(results).response.hits;
            for (var i = 0; i < hits.length; i++) {
                if(hits[i].type == 'song') {
                    return cb(null, hits[i].result.primary_artist);
                }
            }
        });
    };

    //Initialize Genius data for Artist
    this.getGeniusData(names[0], function(err, result) {
        if(err) console.log(err);
        this.id = result.id;
        this.name = result.name;
        var index = names.indexOf(this.name);
        if(index != -1) names.splice(index, 1);
        this.nicknames = names;
        cb();
    }.bind(this));
}

module.exports = Artist;
