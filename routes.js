var path = require('path');
var request = require('request');
var helper = require('./js/helpfunctions.js');


    module.exports = function(app) {



        app.get('/api/test', function(req, res) {
            console.log('INSIDE GET!!!');
            var test = "Hello from inside /api/test - GET";
                res.send(test);
        });



        // Call to get order info and return alerts type codes and names
        app.post('/api/validator', function(req, res) {

       
        });



        // frontend routes =========================================================
        // route to handle all requests
        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, '../client', 'index.html'));
        });

    };
