import express = require("express");
import request = require('request');
import configs = require('../../configs/variables');

let app = express.Router();

let clientId = configs.slack.CLIENT_ID;
let clientSecret = configs.slack.CLIENT_SECRET;

app.get('/oauth', function (req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({ "Error": "Looks like we're not getting code." });
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...
        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: { code: req.query.code, client_id: clientId, client_secret: clientSecret }, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);
            }
        })
    }


    // Route the endpoint that our slash command will point to and send back a simple response to indicate that ngrok is working
    app.post('/command', function (req, res) {
        res.send('Your ngrok tunnel is up and running!');
    });
});

export = app;
