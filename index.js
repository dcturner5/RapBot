var Artist = require('./artist');

/*var tupac = new Artist(['Tupac', '2pac', 'Tupac Shakur', 'Makaveli', '2Pac'], function() {
    console.log(tupac.name);
    console.log(tupac.nicknames);
    for(var i = 1; i < 10; i++) {
        tupac.research(i);
    }

    setInterval(function() {
        tupac.getRandomQuatrain(function(results) {
            for (var i = 0; i < results.length; i++) {
                console.log(results[i].content);
            }
        });
    }, 15000);
});*/

/*var biggie = new Artist(['Biggie Smalls', 'Biggie', 'Notorious B.I.G', 'Notorious', 'Frank White'], function() {
    console.log(biggie.name);
    console.log(biggie.nicknames);
    for(var i = 1; i < 10; i++) {
        //biggie.research(i);
    }

    setInterval(function() {
        biggie.getRandomQuatrain(function(results) {
            for (var i = 0; i < results.length; i++) {
                console.log(results[i].content);
            }
        });
    }, 5000);
});*/

var kanye = new Artist(['Kanye West', 'Kanye', 'Yeezy', 'Yeezus'], function() {
    console.log(kanye.name);
    console.log(kanye.nicknames);
    for(var i = 1; i < 10; i++) {
        kanye.research(i);
    }

    setInterval(function() {
        kanye.getRandomQuatrain(function(results) {
            for (var i = 0; i < results.length; i++) {
                console.log(results[i].content);
            }
        });
    }, 10000);
});

/*var jayz = new Artist(['Jay-Z', 'Jay', 'Jay Z', 'JAY Z','Shawn Carter', 'S. Carter', 'Hov', 'Hova'], function() {
    console.log(jayz.name);
    console.log(jayz.nicknames);
    for(var i = 1; i < 10; i++) {
        //jayz.research(i);
    }

    setInterval(function() {
        jayz.getRandomQuatrain(function(results) {
            for (var i = 0; i < results.length; i++) {
                console.log(results[i].content);
            }
        });
    }, 10000);
});*/
