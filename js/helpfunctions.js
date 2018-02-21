var helperFunctions = require('./helperfunctions');

module.exports = {

	matchShipmentsToItems: function(shipments, items) {
		// Make sure the quantities match
		// Check for duplicate tracking numbers 
		// Check for duplicate SKUs or item_ids
		var itemKeys = [];
		var trackingNumberKeys = [];

		// Look in first item and check for item_id and sku
		// Look in first shipment and check for item_id and sku
		// Default to matching item_id, secondary to matching sku
		// Loop through items and check for suplicate primary match
		// Loop through shipments and look for matching tracking numbers
		// add up shipment quantities and see if they are less quantity than itmes
		  // If less, warn "not all items shipped"
		  // If same, "Pass"
		  // If freater, "Fail"
		

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

			var validatedShipment = {
				items_info: undefined,
				carrier: undefined,
				shipped_to: undefined,
				ship_date: undefined,
				tracking_number: undefined,
			};

			for (var attribute in shipmentObj) {

				if (attribute === "items_info") {
					if (Array.isArray(shipmentObj[attribute])) {
						if (shipmentObj[attribute].length > 0) {
							var validatedItemsInfo = [];
							for (var i = 0; i < shipmentObj[attribute].length; i++) {
								validatedItemsInfo.push(itemsValidation(shipmentObj[attribute][i]));
							}
							validatedShipment.items_info = validatedItemsInfo;
						} else {
							validatedShipment.items_info = "Fail - 'items_info' array should contain info about items"
						}
					} else {
						validatedShipment.items_info = "Fail - 'items_info' should be an array"
					}
				}

				if (attribute === "carrier") {
					validatedShipment.carrier = helperFunctions.lookupCarrierCodes(shipmentObj[attribute]);
				}
				if (attribute === "shipped_to") {

					validatedShipment.shipped_to = {};
					var shippedTo = shipmentObj[attribute];

					for (var STattribute in shippedTo) {
						if (STattribute === "first_name") {
							validatedShipment.shipped_to.first_name = helperFunctions.checkNonEmptyString(shippedTo[STattribute], true);
						}
						if (STattribute === "last_name") {
							validatedShipment.shipped_to.last_name = helperFunctions.checkNonEmptyString(shippedTo[STattribute], true);
						}	
						if (STattribute === "phone") {
							validatedShipment.shipped_to.phone = helperFunctions.checkNonEmptyString(shippedTo[STattribute], true);
						}
						if (STattribute === "email") {
							validatedShipment.shipped_to.email = helperFunctions.checkValidEmail(shippedTo[STattribute], true);
						}
						if (STattribute === "address") {
							validatedShipment.shipped_to.address = helperFunctions.checkAddress(shippedTo[STattribute], true);
						}
					}

					for (var STattribute in validatedShipment.shipped_to) {
						if (validatedShipment.shipped_to[STattribute] === undefined) {
							switch(attribute) {
							    case "first_name":
							        validatedShipment.shipped_to.first_name = "Fail - No 'first_name'"
							        break;
							    case "last_name":
							        validatedShipment.shipped_to.last_name = "Fail - No 'last_name'"
							        break;
							    case "phone":
							    	validatedShipment.shipped_to.phone = "Fail - No 'phone'"
							    	break;
							    case "email":
							    	validatedShipment.shipped_to.email = "Fail - No 'email'"
							    	break
							    case "address":
							    	validatedShipment.shipped_to.address = "Fail - No 'address' object"
							    	break
							    default:
							}
						}
					}
				}
				if (attribute === "ship_date") {
					validatedShipment.ship_date = Date.parse(shipmentObj[attribute]) ? "Pass" : "Fail - Not a valid date"
				}
				if (attribute === "tracking_number") {
					validatedShipment.tracking_number = helperFunctions.checkNonEmptyString(shipmentObj[attribute], true);
				}

				// Loop through validatedShipment and look for missed fields
				for (var attribute in validatedShipment) {
					if (validatedShipment[attribute] === undefined) {
						switch(attribute) {
						    case "items_info":
						        validatedShipment.items_info = "Fail - No 'items_info' array"
						        break;
						    case "carrier":
						        validatedShipment.carrier = "Fail - No 'carrier'"
						        break;
						    case "shipped_to":
						    	validatedShipment.shipped_to = "Fail - No 'shipped_to' object"
						    	break;
						    case "ship_date":
						    	validatedShipment.ship_date = "Fail - No 'ship_date'"
						    	break
						    case "tracking_number":
						    	validatedShipment.tracking_number = "Fail - No 'tracking_number'"
						    	break
						    default:
						}
					}
				}


			}
			return validatedShipment;
		};

		var itemsValidation = function(items) {
			var validatedItem = {
				quantity: undefined,
				sku: undefined,
				item_id: undefined
			};

			for (var attribute in items) {
				if (attribute === "quantity") {
					validatedItem.quantity = helperFunctions.checkValidNumber(items[attribute], true);
				}
				if (attribute === "sku") {
					validatedItem.sku = helperFunctions.checkNonEmptyString(items[attribute]);
				}
				if (attribute === "item_id") {
					validatedItem.item_id = helperFunctions.checkNonEmptyString(items[attribute]);
				}
			}
			
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

			return validatedItem;
		};


		for (var i = 0; i < shipmentsArray.length; i++) {
			shipmentsValidation.push(shipmentValidation(shipmentsArray[i]))
		}

		return shipmentsValidation
	},




















	checkBillingObject: function(billing) {
		if (billing.billed_to === undefined) {
			return "Fail - 'billed_to' object is not found"
		}

		var validatedBilling = {
			first_name: undefined,
			last_name: undefined,
			email: undefined,
			address: undefined
		};

		var billingObj = billing.billed_to;
		for (var attribute in billingObj) {
			if (attribute === "first_name") {
				validatedBilling.first_name = helperFunctions.checkNonEmptyString(billingObj[attribute], true);
			}
			if (attribute === "last_name") {
				validatedBilling.last_name = helperFunctions.checkNonEmptyString(billingObj[attribute], true);
			}
			if (attribute === "email") {
				validatedBilling.email = helperFunctions.checkValidEmail(billingObj[attribute], true);
			}
			if (attribute === "address") {
				validatedBilling.address = helperFunctions.checkAddress(billingObj[attribute], true);
			}
		}

		// Loop through validatedBilling and look for missed fields
		for (var attribute in validatedBilling) {
			if (validatedBilling[attribute] === undefined) {
				switch(attribute) {
				    case "first_name":
				        validatedBilling.first_name = "Fail - No 'first_name'"
				        break;
				    case "last_name":
				        validatedBilling.last_name = "Fail - No 'last_name'"
				        break;
				    case "email":
				    	validatedBilling.email = "Fail - No 'email'"
				    	break;
				    case "address":
				    	validatedBilling.address = "Fail - No 'address'"
				    	break
				    default:
				}
			}
		}

		return validatedBilling;
	},



	checkCustomerObject: function(customer) {
		var validatedCustomer = {
			customer_id: undefined,
			first_name: undefined,
			last_name: undefined,
			email: undefined,
			address: undefined
		};

		for (var attribute in customer) {
			if (attribute === "customer_id") {
				validatedCustomer.customer_id = helperFunctions.checkNonEmptyString(customer[attribute], true);
			}
			if (attribute === "first_name") {
				validatedCustomer.first_name = helperFunctions.checkNonEmptyString(customer[attribute], true);
			}
			if (attribute === "last_name") {
				validatedCustomer.last_name = helperFunctions.checkNonEmptyString(customer[attribute], true);
			}
			if (attribute === "email") {
				validatedCustomer.email = helperFunctions.checkValidEmail(customer[attribute], true);
			}
			if (attribute === "address") {
				validatedCustomer.address = helperFunctions.checkAddress(customer[attribute], true);
			}
		}

		// Loop through validatedCustomer and look for missed fields
		for (var attribute in validatedCustomer) {
			if (validatedCustomer[attribute] === undefined) {
				switch(attribute) {
				    case "customer_id":
				        validatedCustomer.customer_id = "Fail - No 'customer_id'"
				        break;
				    case "first_name":
				        validatedCustomer.first_name = "Fail - No 'first_name'"
				        break;
				    case "last_name":
				        validatedCustomer.last_name = "Fail - No 'last_name'"
				        break;
				    case "email":
				    	validatedCustomer.email = "Fail - No 'email'"
				    	break;
				    case "address":
				    	validatedCustomer.address = "Fail - No 'address'"
				    	break
				    default:
				}
			}
		}

		return validatedCustomer;
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

		// TODO: Alert specific stuff like Signature Required


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
			order_date: Date.parse(json.order_date) ? "Pass" : "Fail - Not a valid date",
			origin_zip: parseInt(json.origin_zip) ? "Pass" : "Fail",
			dest_zip: parseInt(json.dest_zip) ? "Pass" : "Fail",
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
