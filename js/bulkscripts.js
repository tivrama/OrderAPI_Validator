var scripts = require('./scripts.js');


module.exports = {

	validateJSONs: function (json, product) {

		// validate the json first
		var validatedJSON = scripts.validateJSON(json, product);

		return this.consolidatedJSON(validatedJSON, json.order_info.order_number);

	},


	consolidatedJSON: function(json, orderNumber) {

		var results = {
			[orderNumber]: "Pass"
		};

		var scalesOfJustice = {
			pass: 0,
			fail: 0,
			warn: 0
		}

		var recursiveCheck = function(currentAttribute) {

			if (typeof currentAttribute === "string") {

				if (currentAttribute[0] === 'F') {				
					return scalesOfJustice.fail++;
				} else if (currentAttribute[0] === 'W') {
					return scalesOfJustice.warn++;
				
				} else {
					return scalesOfJustice.pass++;
				}
			}
			if (Array.isArray(currentAttribute)) {				
				for (var i = 0; i < currentAttribute.length; i++) {
					recursiveCheck(currentAttribute[i]);
				}
			} else {
				for (var key in currentAttribute) {	
					recursiveCheck(currentAttribute[key]);
				}
			}
		}

		recursiveCheck(json);

		if (scalesOfJustice.fail > 0) {
			results[orderNumber] = "Fail"
		} else if (scalesOfJustice.warn > 0) {
			results[orderNumber] = "Warning"
		}

		return results

	}

};