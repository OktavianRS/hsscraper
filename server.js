var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const sortWinRateNumber = (a, b) => a.win_rate - b.win_rate;
const sortPlayRateNumber = (a, b) => a.total_games - b.total_games;
const sortPopularityRateNumber = (a, b) => a.popularity_delta - b.popularity_delta;

const getFirstTen = (array, className = null) => {
    const reversedArray = array.reverse();
    const sortedArray = [];
    for (let i = 0; i < reversedArray.length; i++) {
        if (i < 10) {
            if (className) reversedArray[i].className = className;
            sortedArray.push(reversedArray[i]);
        } else {
            break;
        }
    }
    return sortedArray;
}

const sortByHighestNumber = (object, type) => {
    var sortFunction = null;
    if (type === 'win') {
        sortFunction = sortWinRateNumber;
    } else if ('game') {
        sortFunction = sortPlayRateNumber;
    } else {
        sortFunction = sortPopularityRateNumber;
    }
    const infoObject = {
        byClass: {},
        allClasses: [],
    };
    const reformedData = {};
    const allClasses = [];
    for (const objectItem in object) {
        reformedData[objectItem] = getFirstTen(object[objectItem].sort(sortFunction), objectItem);
        allClasses.push(...reformedData[objectItem]);
    }
    infoObject.byClass = reformedData;
    infoObject.allClasses = getFirstTen(allClasses.sort(sortFunction));
    return infoObject;
};


app.get('/win-rate', function (req, res) {

    url = 'https://hsreplay.net/analytics/query/list_decks_by_win_rate/?GameType=RANKED_STANDARD&RankRange=ALL&TimeRange=LAST_30_DAYS';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
            const answer = JSON.parse(response.body).series.data;
            const winRateDecks = sortByHighestNumber(answer, 'win');
            res.json(winRateDecks);
        }
    })

})

app.get('/play-rate', function (req, res) {

    url = 'https://hsreplay.net/analytics/query/list_decks_by_win_rate/?GameType=RANKED_STANDARD&RankRange=ALL&TimeRange=LAST_30_DAYS';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
            const answer = JSON.parse(response.body).series.data;
            const playRateDecks = sortByHighestNumber(answer, 'play');
            res.json(playRateDecks);
        }
    })

})

app.get('/popularity-rate', function (req, res) {

    url = 'https://hsreplay.net/analytics/query/trending_decks_by_popularity/';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
            const answer = JSON.parse(response.body).series.data;
            const popularityRateDecks = sortByHighestNumber(answer, 'popularity');
            res.json(popularityRateDecks);
        }
    })

})

app.get('/cards', function (req, res) {

    url = 'https://omgvamp-hearthstone-v1.p.mashape.com/cards';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request({
        url: url,
        headers: {
            'X-Mashape-Key': 'MQuzRthYwvmshZn4xfYHKt2K2EP2p11GbXPjsnBfc1JjoM51Lg'
        }
    }, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
            const answer = JSON.parse(response.body);
            var responsePrepared = [];
            for (var key in answer) {
                if (answer.hasOwnProperty(key)) {
                    responsePrepared = [
                        ...responsePrepared,
                        ...answer[key],
                    ];
                }
            }
            res.json(responsePrepared);
        }
    })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;