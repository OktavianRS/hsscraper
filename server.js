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


app.get('/win-rate', function (req, res) {

    url = 'https://hsreplay.net/analytics/query/list_decks_by_win_rate/?GameType=RANKED_STANDARD&RankRange=ALL&TimeRange=LAST_30_DAYS';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request

        if (!error) {
            res.json(response);
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
            res.json(response);
        }
    })

})

app.get('/cards', function (req, res) {

    url = 'https://api.hearthstonejson.com/v1/18336/enUS/cards.json';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request

        if (!error) {
            res.json(response);
        }
    })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;