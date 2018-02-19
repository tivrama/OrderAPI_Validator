var helperFunctions = require('./helperfunctions');

module.exports = {

	checkItemsArray: function(itemsArray) {
		// 2 sections here: loop through the array, call the checker on each items object
		var itemsValidation = [];

		var itemValidation = function (itemObj) {
			var validatedItem = {};
			for (var attribute in itemObj) {
				// TODO
			}
			return validatedItem;
		}

		for (var i = 0; i < itemsArray.length; i++) {
			itemsValidation.unshift(itemValidation(itemsArray[i]))
		}
		return itemsValidation;
	},

	checkShipmentsArray: function(shipmentsArray) {
		// 2 sections here: loop through the array, call the checker on each items object
		var shipmentsValidation = [];

		var shipmentValidation = function (shipmentObj) {
			var validatedShipment = {};
			for (var attribute in shipmentObj) {
				// TODO
			}
			return validatedShipment;
		}

		for (var i = 0; i < shipmentsArray.length; i++) {
			shipmentsValidation.unshift(shipmentValidation(shipmentsArray[i]))
		}
		return shipmentsValidation
	},

	basicOrderAPICheck: function(json) {

		var passFailCheckList = {
			order_number: null,
			order_date: null,
			order_items: null,
			shipments: null,
			billing: null,
			customer: null
		};
		// Look for parent level attributes validate
		for (var attribute in json){
			if (attribute === 'order_number') {
				passFailCheckList.order_number = helperFunctions.checkNonEmptyString(json[attribute]);
			}

			if (attribute === 'order_date') {
				passFailCheckList.order_date = Date.parse(json[attribute]) ? "Pass" : "Fail - invalid date"
			}

			if (attribute === 'order_items') {
				if (Array.isArray(json[attribute])) {
					if (json[attribute].length > 0) {
						// passFailCheckList.order_items = 
						passFailCheckList.order_items = this.checkItemsArray(json[attribute]);
					} else {
						passFailCheckList.order_items = "Fail - Contains no items";
					}
				} else {
					passFailCheckList.order_items = "Fail - Should be an array of item objects";
				}
			}

			if (attribute === 'shipments') {
				if (Array.isArray(json[attribute])) {
					if (json[attribute].length > 0) {
						passFailCheckList.shipments = this.checkShipmentsArray(json[attribute]);
					} else {
						passFailCheckList.shipments = "Warning - Contains no shipments";
					}
				} else {
					passFailCheckList.shipments = "Fail - Should be an array of shipment objects";
				}
			}

			if ( attribute === 'billing') {
				// TODO
			}

			if ( attribute === 'customer') {
				// TODO
			}
		}

		for (var parentAttributes in passFailCheckList) {
			if (passFailCheckList[parentAttributes] === null) {

				switch(parentAttributes) {
				    case "order_number":
				        passFailCheckList.order_number = "Fail - No order_number"
				        break;
				    case "order_date":
				        passFailCheckList.order_date = "Fail - No order_date"
				        break;
				    case "order_items":
				    	passFailCheckList.order_items = "Fail - No order_items"
				    	break;
				    case "shipments":
				    	passFailCheckList.shipments = "Warning - No shipments object"
				    	break
				    case "billing":
				    	passFailCheckList.billing = "Warning - No billing object"
				    	break
				    case "customer":
				    	passFailCheckList.customer = "Warning - No customer object"
				    	break
				    default:
				}
			}
		}
		return passFailCheckList;
	},


	alertCheck: function(json) {
		// Check that json contais an object called order_info
		if (!json.order_info) {
			return {Error: "No 'order_info' object"};
		}

		var orderAPIvalidation = this.basicOrderAPICheck(json.order_info);

		return orderAPIvalidation;
	},



	returnCheck: function(json) {
		// Check that json contais an object called order_info
		if (!json.order_info) {
			return {Error: "No 'order_info' object"};
		}

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
