var helperFunctions = require('./helperfunctions');

module.exports = {

	matchShipmentsToItems: function(shipments, items) {

	},



	checkItemsArray: function(itemsArray) {
		// 2 sections here: loop through the array, call the checker on each items object
		var itemsValidation = [];

		var itemValidation = function (itemObj) {
			var validatedItem = {
				item_id: undefined,
				sku: undefined,
				name: undefined,
				description: undefined,
				quantity: undefined,
				unit_price: undefined,
				item_image: undefined,
				is_final_sale: undefined,
				is_gift: undefined		
			};

			for (var attribute in itemObj) {

				if (attribute === "sku") {
					validatedItem.sku = helperFunctions.checkNonEmptyString(itemObj[attribute]);
				}
				if (attribute === "item_id") {
					validatedItem.item_id = helperFunctions.checkNonEmptyString(itemObj[attribute]);
				}
				if (attribute === "name") {
					validatedItem.name = helperFunctions.checkNonEmptyString(itemObj[attribute], true);
				}
				if (attribute === "description") {
					validatedItem.description = helperFunctions.checkNonEmptyString(itemObj[attribute]);
				}
				if (attribute === "quantity") {
					validatedItem.quantity = helperFunctions.checkValidNumber(itemObj[attribute], true);
				}
				if (attribute === "unit_price") {
					validatedItem.unit_price = helperFunctions.checkValidNumber(itemObj[attribute], true);
				}
				if (attribute === "item_image") {
					validatedItem.item_image = helperFunctions.checkValidImage(itemObj[attribute], true);
				}
				if (attribute === "is_final_sale") {
					validatedItem.is_final_sale = helperFunctions.checkValidBoolean(itemObj[attribute]);
				}
				if (attribute === "is_gift") {
					validatedItem.is_gift = helperFunctions.checkValidBoolean(itemObj[attribute]);
				}
			}

			// Section for sku and item_id
			if (validatedItem.sku === undefined) {
				validatedItem.sku = "Warning - no value found";
			}
			if (validatedItem.sku[0] === "F" || validatedItem.sku[0] === "W") {
				if (validatedItem.item_id === undefined) {
					validatedItem.sku = "Fail - either 'sku' or 'item_id' must have a value";
					validatedItem.item_id = "Fail - either 'sku' or 'item_id' must have a value";
				} else if (validatedItem.item_id[0] === "F" || validatedItem.item_id[0] === "W") {
					validatedItem.sku = "Fail - either 'sku' or 'item_id' must have a value";
					validatedItem.item_id = "Fail - either 'sku' or 'item_id' must have a value";
				}
			}

			// Loop through validatedItem and look for missed fields
			for (var attribute in validatedItem) {
				if (validatedItem[attribute] === undefined) {
					switch(attribute) {
					    case "name":
					        validatedItem.name = "Fail - No 'name'"
					        break;
					    case "description":
					        validatedItem.description = "Warning - No 'description'"
					        break;
					    case "quantity":
					    	validatedItem.quantity = "Fail - No 'quantity'"
					    	break;
					    case "unit_price":
					    	validatedItem.unit_price = "Fail - No 'unit_price'"
					    	break
					    case "item_image":
					    	validatedItem.item_image = "Fail - No 'item_image'"
					    	break
					    case "is_final_sale":
					    	validatedItem.is_final_sale = "Warning - No 'is_final_sale'"
					    	break
					    case "is_gift":
					    	validatedItem.is_gift = "Warning - No 'is_gift'"
					    	break
					    default:
					}
				}
			}

			return validatedItem;
		}

		for (var i = 0; i < itemsArray.length; i++) {
			itemsValidation.push(itemValidation(itemsArray[i]))
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
			shipmentsValidation.push(shipmentValidation(shipmentsArray[i]))
		}
		return shipmentsValidation
	},



	checkBillingObject: function(billing) {
		if (billing.billed_to === undefined) {
			return "Fail - 'billed_to' object is not found"
		}

		var validatedAddress = {
			first_name: undefined,
			last_name: undefined,
			email: undefined,
			address: undefined
		};

		var billingObj = billing.billed_to;
		for (var attribute in billingObj) {
			if (attribute === "first_name") {
				validatedAddress.first_name = helperFunctions.checkNonEmptyString(billingObj[attribute], true);
			}
			if (attribute === "last_name") {
				validatedAddress.last_name = helperFunctions.checkNonEmptyString(billingObj[attribute], true);
			}
			if (attribute === "email") {
				validatedAddress.email = helperFunctions.checkValidEmail(billingObj[attribute], true);
			}
			if (attribute === "address") {
				validatedAddress.address = helperFunctions.checkAddress(billingObj[attribute], true);
			}
		}

		// Loop through validatedAddress and look for missed fields
		for (var attribute in validatedAddress) {
			if (validatedAddress[attribute] === undefined) {
				switch(attribute) {
				    case "first_name":
				        validatedAddress.first_name = "Fail - No 'first_name'"
				        break;
				    case "last_name":
				        validatedAddress.last_name = "Fail - No 'last_name'"
				        break;
				    case "email":
				    	validatedAddress.email = "Fail - No 'email'"
				    	break;
				    case "address":
				    	validatedAddress.address = "Fail - No 'address'"
				    	break
				    default:
				}
			}
		}

		return validatedAddress;
	},



	checkCustomerObject: function(customer) {
		var validatedAddress = {
			customer_id: undefined,
			first_name: undefined,
			last_name: undefined,
			email: undefined,
			address: undefined
		};

		for (var attribute in customer) {

		}

		return validatedAddress;
	},


	basicOrderAPICheck: function(json) {

		var passFailCheckList = {
			order_number: undefined,
			order_date: undefined,
			order_items: undefined,
			shipments: undefined,
			billing: undefined,
			customer: undefined
		};
		// Look for parent level attributes validate
		for (var attribute in json){
			if (attribute === 'order_number') {
				passFailCheckList.order_number = helperFunctions.checkNonEmptyString(json[attribute], true);
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
				passFailCheckList.billing = this.checkBillingObject(json[attribute]);
			}

			if ( attribute === 'customer') {
				passFailCheckList.customer = this.checkCustomerObject(json[attribute]);
			}
		}

		for (var parentAttributes in passFailCheckList) {
			if (passFailCheckList[parentAttributes] === undefined) {

				switch(parentAttributes) {
				    case "order_number":
				        passFailCheckList.order_number = "FAIL - No 'order_number'"
				        break;
				    case "order_date":
				        passFailCheckList.order_date = "Fail - No 'order_date'"
				        break;
				    case "order_items":
				    	passFailCheckList.order_items = "Fail - No 'order_items'"
				    	break;
				    case "shipments":
				    	passFailCheckList.shipments = "Warning - No 'shipments' object"
				    	break
				    case "billing":
				    	passFailCheckList.billing = "Fail - No 'billing' object"
				    	break
				    case "customer":
				    	passFailCheckList.customer = "Warning - No 'customer' object"
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
		orderAPIvalidation.match_shipments_with_items = this.matchShipmentsToItems(json.order_info.shipments, json.order_info.order_items);

		return orderAPIvalidation;
	},



	returnCheck: function(json) {
		// Check that json contais an object called order_info
		if (!json.order_info) {
			return {Error: "No 'order_info' object"};
		}

		var orderAPIvalidation = this.basicOrderAPICheck(json.order_info);
		orderAPIvalidation.match_shipments_with_items = this.matchShipmentsToItems(json.order_info.shipments, json.order_info.order_items);
		return orderAPIvalidation;
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
