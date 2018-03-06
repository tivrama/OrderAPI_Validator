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
                if (retailerOrder.length > 1) {
                    res.send(retailerOrder);
                } else {
                    res.send(retailerOrder[0]);
                }
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

            // TODO: check if the order exists
            // 1) check that there is an order number available
            if (req.body.order_info !== undefined) {
                if (req.body.order_info.order_number !== undefined) {
                    var order = req.body.order_info.order_number
                } else {
                    var order = 1;
                }
            } else {
                var order = 1;
            }

            // 2) Check the DB with the retailer and the order number
            OrderAPISchema.find({'order': order, 'retailer': retailer}, function(err, retailerOrder) {
                if (err) {
                    console.log("Error looking up the order in the DB: ", err);
                }

                // If it does, then update
                if (retailerOrder.length < 1) {
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

                // else save as new
                } else {
                    var originalPayload = retailerOrder[0];
                    var query = { _id: originalPayload._id };
                    var update = {
                        retailer : retailer,
                        order : req.body.order_info ? req.body.order_info.order_number : 1,
                        json: saveJSON
                    }

                    OrderAPISchema.update(query, update, function (err, success) {
                        if (err) {
                            res.send(err);
                            console.log('Fail updating to server: ', err);
                        } else {
                            console.log('Success updating to server');

                            // Call function to validate JSON (Apply product type(s))
                            var validatedJSON = helper.validateJSON(req.body, product);
                            
                            // Send response
                            res.send(validatedJSON);
                        }
                    });

                }
                
            });

        });




        // frontend routes =========================================================
        // route to handle all requests
        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, './client', 'index.html'));
        });

    };
