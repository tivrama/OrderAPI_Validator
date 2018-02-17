var helperFunctions = require('./helperfunctions');

module.exports = {


	alertCheck: function(json) {

		return "Hello in alertCheck"
	},



	returnCheck: function(json) {

		return "Hello in returnCheck"
	},


	labelCheck: function(json) {

		return "Hello in labelCheck"
	},



	shipCheck: function(json) {

		var response = {
			order_date: Date.parse(json.order_date) ? "pass" : "fail",
			origin_zip: parseInt(json.origin_zip) ? "pass" : "fail",
			dest_zip: parseInt(json.dest_zip) ? "pass" : "fail",
			carrier_code: json.carrier_code ? helperFunctions.lookupCarrierCodes(json.carrier_code) : "n/a",
			unrecognized_attributes: []
		}

		var temp = json;
		for (var attribute in json) {
			for (var schemaAttribute in response) {
				if (attribute === schemaAttribute) {
					delete temp[attribute]
				}
			}
		}
		
		for (var tempAttribute in temp) {
			response.unrecognized_attributes.push(tempAttribute);
		}

		return response;
	},



	validateJSON: function (json, product) {

		var productValidationArray = [];

		// product is a string of comma seperated values
		// Loop through the string, split by comma and push the products into an array
		var productArray = [];
		var counter = 0;

		for  (var i = 0; i < product.length; i++) {
			if (product[i] === ",") {
				var tempPrduct = product;
				productArray.push(tempPrduct.slice(counter, i));
				counter = i+1;
			}
		}
		productArray.push(product.slice(counter, product.length))


		for (var j = 0; j < productArray.length; j++) {

			if (productArray[j] === "ship") { // EDD Checkout
				var validatedShipPayload = this.shipCheck(json);
				productValidationArray.push(validatedShipPayload);
			}

			if (productArray[j] === "alert") {
				var validatedAlertPayload = this.alertCheck(json);
				productValidationArray.push(validatedAlertPayload);
			}

			if (productArray[j] === "return") {
				var validatedReturnPayload = this.returnCheck(json);
				productValidationArray.push(validatedReturnPayload);
			}

			if (productArray[j] === "label") { // 
				var validatedLabelPayload = this.labelCheck(json);
				productValidationArray.push(validatedLabelPayload);
			}
			
		}



		return productValidationArray.length > 1 ? productValidationArray : productValidationArray[0];
	}

};
