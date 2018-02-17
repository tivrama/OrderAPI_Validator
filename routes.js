var path = require('path');
var request = require('request');
var helper = require('./js/helpfunctions.js');
var OrderAPISchema = require('./models/json.js');

    module.exports = function(app) {



        app.get('/api/retriever', function(req, res) {
            console.log('INSIDE RETRIEVER!!!');

            var retailer = req.query.retailer;
            var order = req.query.order;

            OrderAPISchema.find({'order': order, 'retailer': retailer}, function(err, retailerOrder) {
                if (err) {
                    res.send(err);
                }
                res.send(retailerOrder);
            });
        });




        // Call to get order info and return alerts type codes and names
        app.post('/api/validator', function(req, res) {

            // Get retailer moniker out of the url param => retailer=gap
            var retailer = req.query.retailer;
            var product = req.query.product ? req.query.product : "all";

            var saveJSON = JSON.stringify(req.body);

            if (/^[\],:{}\s]*$/.test(saveJSON.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                //the json is ok
                console.log("The payload is a valid JSON");

            } else {
                //the json is not ok
                res.send("The payload is not a valid JSON");
            }

            // Save json to MongoDB
            var newEntry = new OrderAPISchema({
                retailer : retailer,
                order : req.body.order_info ? req.body.order_info.order_number : 1,
                json : saveJSON
            });

            newEntry.save(function(err, resp) {
                if (err) {
                    res.send(err);
                    console.log('Fail saving to server: ', err);
                } else { 
                    console.log('Success saving to server');

                    // Call function to validate JSON (Apply product type(s))
                    var validatedJSON = helper.validateJSON(req.body, product);
                    
                    // Send response
                    res.send(validatedJSON);
                }
            });

        });




        // frontend routes =========================================================
        // route to handle all requests
        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, './client', 'index.html'));
        });

    };
