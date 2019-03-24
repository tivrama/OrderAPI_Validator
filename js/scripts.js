var helperFunctions = require('./helperfunctions');
var notificationCenterTrafficSource = require("../library/library.js").notificationCenterTrafficSource;
var locales = require("../library/library.js").locales


module.exports = {


	
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

			if (productArray[j] === "monitor") {
				var validatedMonitorPayload = this.monitorCheck(json);
				productValidationArray.push(validatedMonitorPayload);
			}

			if (productArray[j] === "label") {
				var validatedLabelPayload = this.labelCheck(json);
				productValidationArray.push(validatedLabelPayload);
			}

			if (productArray[j] === "bopis") { // TODO
				var validatedBopisPayload = this.bopisCheck(json);
				productValidationArray.push(validatedBopisPayload);
			}

			if (productArray[j] === "track") { // TODO
				var validatedBopisPayload = this.trackCheck(json);
				productValidationArray.push(validatedBopisPayload);
			}
			
			if (productArray[j] === "notificationpref_customer_post") {
				var validatedNotifyCustomerPayload = this.notifyCustomerCheckPost(json);
				productValidationArray.push(validatedNotifyCustomerPayload);
			}

			if (productArray[j] === "notificationpref_order_post") {
				var validatedNotifyOrderPayload = this.notifyOrderCheckPost(json);
				productValidationArray.push(validatedNotifyOrderPayload);
			}

			if (productArray[j] === "notificationpref_customer_put") {
				var validatedNotifyCustomerPayload = this.notifyCustomerCheckPut(json);
				productValidationArray.push(validatedNotifyCustomerPayload);
			}

			if (productArray[j] === "notificationpref_order_put") {
				var validatedNotifyOrderPayload = this.notifyOrderCheckPut(json);
				productValidationArray.push(validatedNotifyOrderPayload);
			}

		}
			
		return productValidationArray.length > 1 ? productValidationArray : productValidationArray[0];
	},







	shipCheck: function(json) {

		var response = {
			order_date: Date.parse(json.order_date) ? "Pass" : "Fail - Not a valid date",
			origin_zip: parseInt(json.origin_zip) ? "Pass" : "Fail",
			dest_zip: parseInt(json.dest_zip) ? "Pass" : "Fail",
			carrier_code: json.carrier_code ? helperFunctions.lookupCarrierCodes(json.carrier_code) : "n/a",
			origin_country: json.origin_country ? helperFunctions.lookupCountryCodes(json.origin_country) : "n/a",
			dest_country: json.dest_country ? helperFunctions.lookupCountryCodes(json.dest_country) : "n/a",
			category: json.category ? helperFunctions.checkNonEmptyString(json.category) : "n/a",
			dc_id: json.dc_id ? helperFunctions.checkNonEmptyString(json.dc_id) : "n/a",
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

	alertCheck: function(json) {
		// Check that json contais an object called order_info
		if (!json.order_info) {
			return {Error: "No 'order_info' object"};
		}

		var orderAPIvalidation = this.basicOrderAPICheck(json.order_info);
		orderAPIvalidation.match_shipments_with_items = this.matchShipmentsToItems(json.order_info.shipments, json.order_info.order_items);

		// Look for Signature Required
		if (json.order_info.shipments !== undefined) {

			for (var i = 0; i < json.order_info.shipments.length; i++) {

				if (json.order_info.shipments[i].attributes !== undefined) {

					if (json.order_info.shipments[i].attributes.signature_required !== undefined) {

						var date = Date.parse(json.order_info.shipments[i].attributes.signature_required) ? "Pass" : "Fail - Not a valid date"
						orderAPIvalidation.shipments[i].attributes = {signature_required: date}

					} else {

						orderAPIvalidation.shipments[i].attributes = "Warning - If using Signature Required notification, must pass a date in 'signature_required'"
					}
				} else {

					orderAPIvalidation.shipments[i].attributes = "Warning - If using Signature Required notification, must pass a date in 'signature_required' in the 'attributes' obj"
				}
			}
		}

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

	monitorCheck: function(json) {
		// Check that json contais an object called order_info
		if (!json.order_info) {
			return {Error: "No 'order_info' object"};
		}

		var orderAPIvalidation = this.basicOrderAPICheck(json.order_info);
		orderAPIvalidation.match_shipments_with_items = this.matchShipmentsToItems(json.order_info.shipments, json.order_info.order_items);

		// Look for item_promise_date in each item
		for (var i = 0; i < json.order_info.order_items.length; i++) {

			if (json.order_info.order_items[i].item_promise_date !== undefined) {

				var date = Date.parse(json.order_info.order_items[i].item_promise_date) ? "Pass" : "Fail - Not a valid date"
				orderAPIvalidation.order_items[i].item_promise_date = date

			} else {

				orderAPIvalidation.order_items[i].item_promise_date = "Fail - Must pass 'item_promise_date'"
			}
		}

		return orderAPIvalidation;
	},

	labelCheck: function(json) {

		var response = {
				order_number: json.order_number ? helperFunctions.checkNonEmptyString(json.order_number, true) : "Fail - No 'order_number'",
				billing_zip: json.billing_zip ? helperFunctions.checkNonEmptyString(json.billing_zip, true) : "Fail - No 'billing_zip",
				rma_number: json.rma_number ? helperFunctions.checkNonEmptyString(json.rma_number, true) : "Note - if nothing is passed, Narvar will return 'RA'",
				return_reference_number: json.return_reference_number ? helperFunctions.checkNonEmptyString(json.return_reference_number, true) : "Note - this value is used to retrieve previous posts",
				order_items: []
			}

		if (json.send_email === null) {
			response.send_email = "Warning - no confirmation email will be sent";
		} else if (json.send_email !== undefined) {
			response.send_email = helperFunctions.checkValidStringBoolean(json.send_email);
		} else {
			response.send_email = "Warning - no confirmation email will be sent";
		}

		var checkItemsInPayload = function (listOfOrderItems) {

			var checkDupeSkus = []

			for (var i = 0; i < listOfOrderItems.length; i++) {

				var currentItem = {
					sku: listOfOrderItems[i].sku ? helperFunctions.checkNonEmptyString(listOfOrderItems[i].sku, true) : "Fail - No 'sku'",
					quantity: listOfOrderItems[i].quantity ? helperFunctions.checkValidNumber(listOfOrderItems[i].quantity, true) : "Fail - must have an integer",
					return_reason: listOfOrderItems[i].return_reason ? helperFunctions.checkNonEmptyString(listOfOrderItems[i].return_reason, true) : "Warning - no return reason will be saved"
				}

				for (var j = 0; j < checkDupeSkus.length; j++) {					
					if (checkDupeSkus[j] === listOfOrderItems[i].sku) {
						currentItem.sku = "Fail - duplicate SKU: " + listOfOrderItems[i].sku
					}
				}
				checkDupeSkus.push(listOfOrderItems[i].sku);
				response.order_items.push(currentItem);
			}
		}

		checkItemsInPayload(json.order_items);

		return response;
	},


	bopisCheck: function(json) {

		return "Hello in bopisCheck"
	},

	trackCheck: function(json) {

		return "Hello in trackCheck"
	},

	notifyCustomerCheckPost: function(json) {
		// Check that json contains an object called customer_preferences
		if (!json.customer_preferences) {
			return {Error: "No 'customer_preferences' object"};
		}
		var response = this.basicNotificationCenterCheck(json.customer_preferences);

		if (json.customer_preferences.notification_pref_details === undefined || json.customer_preferences.notification_pref_details === null) {
			// this is caught in basicNotificationCenterCheck
		} else if (json.customer_preferences.notification_pref_details.length < 1) {
			response.notification_pref_details = "Fail - the array must contain a preference object"
		}

		return response;
	},

	notifyOrderCheckPost: function(json) {
		// Check that json contains an object called order_preferences
		if (!json.order_preferences) {
			return {Error: "No 'order_preferences' object"};
		}

		var response = this.basicNotificationCenterCheck(json.order_preferences);

		response = this.basicNotifyOrderCheck(json.order_preferences, response)

		if (json.order_preferences.notification_pref_details === undefined || json.order_preferences.notification_pref_details === null) {
			// this is caught in basicNotificationCenterCheck
			return response;
		} else if (json.order_preferences.notification_pref_details.length < 1) {
			response.notification_pref_details = "Fail - the array must contain a preference object"
		}

		return response;
	},

	notifyCustomerCheckPut: function(json) {
		if (!json.customer_preferences) {
			return {Error: "No 'customer_preferences' object"};
		}
		var response = this.basicNotificationCenterCheck(json.customer_preferences);

		if (json.customer_preferences.modified_datetime) {
			response.modified_datetime =  Date.parse(json.customer_preferences.modified_datetime) ? "Pass" : "Fail - invalid date format"
		} else {
			response.modified_datetime = "Fail - have a valid date.  Note, date must match value returned in a Get"
		}

		if (json.customer_preferences.notification_pref_details === undefined || json.customer_preferences.notification_pref_details === null) {
			// this is caught in basicNotificationCenterCheck
			return response;
		} else if (json.customer_preferences.notification_pref_details.length < 1) {
			response.notification_pref_details = "Pass - when passing an empty array, the customer is opted out"
		}



		return response;
	},

	notifyOrderCheckPut: function(json) {
		// Check that json contains an object called order_preferences
		if (!json.order_preferences) {
			return {Error: "No 'order_preferences' object"};
		}

		var response = this.basicNotificationCenterCheck(json.order_preferences);

		response = this.basicNotifyOrderCheck(json.order_preferences, response)

		if (json.order_preferences.modified_datetime) {
			response.modified_datetime =  Date.parse(json.order_preferences.modified_datetime) ? "Pass" : "Fail - invalid date format"
		} else {
			response.modified_datetime = "Fail - have a valid date.  Note, date must match value returned in a Get"
		}

		if (json.order_preferences.notification_pref_details === undefined || json.order_preferences.notification_pref_details === null) {
			// this is caught in basicNotificationCenterCheck
			return response;
		} else if (json.order_preferences.notification_pref_details.length < 1) {
			response.notification_pref_details = "Pass - when passing an empty array, the customer is opted out"
		}


		return response;
	},



	//// NOTIFICATION CENTER API SECTION ////
	basicNotificationCenterCheck: function(json) {

		var passFailChecklist = {
			traffic_source: undefined,
			first_name: undefined,
			last_name: undefined,
			notification_pref_details: undefined,
			locale: undefined
		};

		for (var attribute in json) {

			if (attribute === 'traffic_source') {

				if (notificationCenterTrafficSource.indexOf(json[attribute]) > -1) {
					passFailChecklist.traffic_source = "Pass";
				} else {
					passFailChecklist.traffic_source = "Fail - value must be one of the following: 'MY_ACCOUNT_PAGE','ORDER_CONFIRMATION_PAGE','ORDER_CHECKOUT_PAGE'";
				}
			}

			if (attribute === 'first_name') {
				passFailChecklist.first_name = helperFunctions.checkNonEmptyString(json[attribute]);
			}
			if (attribute === 'last_name') {
				passFailChecklist.last_name = helperFunctions.checkNonEmptyString(json[attribute]);
			}

			if (attribute === 'locale') {
				if (locales.indexOf(json[attribute]) > -1) {
					passFailChecklist.locale = "Pass";
				} else {
					passFailChecklist.locale = "Fail - must have a valid locale code";
				}
			}
		}

		
		if (json.notification_pref_details === undefined || json.notification_pref_details === null) { 
			passFailChecklist.notification_pref_details = "Fail, must have notification_pref_details and be an array"
		} else if (!Array.isArray(json.notification_pref_details)) { 
			passFailChecklist.notification_pref_details = "Fail, must be an array"
		} else { 
			passFailChecklist.notification_pref_details = [];

			for (var i = 0; i < json.notification_pref_details.length; i++) {

				var contactDetails = {
					channel: undefined,
					contact: undefined
				}

				if (json.notification_pref_details[i].channel === undefined) {
					contactDetails.channel = "Fail - must have the channel set to SMS"
				} else if (json.notification_pref_details[i].channel !== "sms" ) {
					contactDetails.channel = "Fail - must have the channel set to SMS"
				} else {
					contactDetails.channel = "Pass"
				}

				if (json.notification_pref_details[i].contact === undefined) {
					contactDetails.contact = "Fail - must have the contact, which has to be a real phone number"
				} else if (!helperFunctions.checkValidPhone(json.notification_pref_details[i].contact)) {
					contactDetails.contact = "Fail - must have the channel set to SMS"
				} else {
					contactDetails.contact = "Pass"
				}

				passFailChecklist.notification_pref_details.push(contactDetails)
			}
		}


		for (var attribute in passFailChecklist) {
			if (passFailChecklist[attribute] === undefined) {

				switch (attribute) {
				    case "traffic_source":
				        passFailChecklist.traffic_source = "FAIL - No 'traffic_source'"
				        break;
				    case "first_name":
				        passFailChecklist.first_name = "Fail - No 'first_name'"
				        break;
				    case "last_name":
				    	passFailChecklist.last_name = "Fail - No 'last_name'"
				    	break;
				    case "notification_pref_details":
				    	passFailChecklist.notification_pref_details = "Fail - No 'notification_pref_details' array"
				    	break
				    case "locale":
				    	passFailChecklist.locale = "Fail - No 'locale'"
				    	break
				    default:
				}
			}
		}

		return passFailChecklist;
	},

	basicNotifyOrderCheck: function(json, payload) {

		if (json.order_id) {
			payload.order_id =  helperFunctions.checkNonEmptyString(json.order_id, true);
		} else {
			payload.order_id = "Fail - must have 'order_id'"
		}

		if (json.is_guest) {
			payload.is_guest =  helperFunctions.checkValidStringBoolean(json.is_guest, true);
		} else {
			payload.order_id = "Fail - must have 'is_guest'"
		}

		if (json.is_active) {
			payload.is_active =  helperFunctions.checkValidStringBoolean(json.is_active, true);
		} else {
			payload.order_id = "Fail - must have 'is_active'"
		}

		return payload;
	},



	//// ORDER API SECTION ////
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

	matchShipmentsToItems: function(shipments, items) {

		var itemVsShipments = {};

		// 1) check if items exist else return Fail
		if (items !== undefined) {
			if (items.length === 0) {
				return itemVsShipments.items = "Fail - there must be at lease one item"
			}
		} else {
			return itemVsShipments.items = "Fail - missing items array.  There must be at lease one item"
		}



		// 2) check if shipments exist else return Warn
		if (shipments !== undefined) {
			if (shipments.length === 0) {
				return itemVsShipments.shipments = "Warning - there is no shipments object.  It will have to be added with a Post or Put"
			}
		} else {
			return itemVsShipments.shipments = "Warning - there is no shipments object.  It will have to be added with a Post or Put"
		}


		// 3) Check for duplicate tracking numbers
		var checkTrackingNumbers = [];
		var skuORitems_id = "sku";
		for (var i = 0; i < shipments.length; i++) {

			// check if the shipments items_info items use sku/items_id, or just sku
			if (shipments[i].items_info[0].items_id !== undefined) {
				if (shipments[i].items_info[0].items_id !== "")
				skuORitems_id = "item_id";
			}

			if (checkTrackingNumbers.indexOf(shipments[i].tracking_number) > -1) {
				itemVsShipments.tracking_number = "Fail - cannot have multiple shipments with the same tracking number"
			}
			checkTrackingNumbers.push(shipments[i].tracking_number)
		}

		

		// 4) Check for duplicate SKUs or item_ids
		var checkSkuNumbers = []; 
		var matchItemAndSku = {};
		var itemSkuUniqueItem = {};

		for (var i = 0; i < items.length; i++) {

			// Build an inventory of all unique items in the order along with their quantity
			var tempSKU = items[i].sku.toString();
			if (items[i].item_id !== undefined) {
				if (skuORitems_id === "item_id") {
					var tempID = items[i].item_id;
				} else {
					var tempID = "";	
				}
			} 
			var uniqueItem = tempSKU + tempID;
			if (itemSkuUniqueItem[uniqueItem] === undefined) {
				itemSkuUniqueItem[uniqueItem] = items[i].quantity
			} else {
				itemSkuUniqueItem[uniqueItem] += items[i].quantity;
			}

			// Check for duplicate sku/item_id numbers
			if (checkSkuNumbers.indexOf(items[i].sku) > -1) {
				// Look to see if item_id is there, if not fail
				if (items[i].item_id === undefined) {
					itemVsShipments.sku = "Fail - cannot have multiple items objects with the same SKU unless there is a different item_id"
				} else {
					var sku = items[i].sku
					if (matchItemAndSku[sku] === items[i].item_id) {
						// Look up the sku and see if it already has a matching item_id
						itemVsShipments.sku = "Fail - cannot have multiple items objects with the same SKU and the same item_id"
					}
				}
			}
			checkSkuNumbers.push(items[i].sku)
			if (items[i].item_id !== undefined) {
				var sku = items[i].sku
				matchItemAndSku[sku] = items[i].item_id
			}
		}		


		// 5) Loop through shipments and subract the items shipped from itemSkuUniqueItem
		for (var i = 0; i < shipments.length; i++) {
			for (var j = 0; j < shipments[i].items_info.length; j++) {
				var tempSKU = shipments[i].items_info[j].sku.toString();
				if (skuORitems_id === "item_id") {
					var tempID = tempSKU + shipments[i].items_info[j].item_id;
				}

				itemSkuUniqueItem[tempSKU] -= shipments[i].items_info[j].quantity;
			}
		}


		// 6) Make sure there are no negative quantities of items, and any postitive has a warning
		for (var currentItem in itemSkuUniqueItem) {
			if (itemSkuUniqueItem[currentItem] < 0) {
				itemVsShipments[currentItem] = "Fail - cannot ship more " + currentItem + " than in order"
			} else if (itemSkuUniqueItem[currentItem] > 0) {
				itemVsShipments[currentItem] = "Warning - there are still " + itemSkuUniqueItem[currentItem] + " of " + currentItem + " left unshipped"
			} else {
				itemVsShipments[currentItem] = "Pass"
			}
		}

		
		  return itemVsShipments;
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
					validatedItem.sku = helperFunctions.checkNonEmptyString(items[attribute], true);
				}
				if (attribute === "item_id") {
					validatedItem.item_id = helperFunctions.checkNonEmptyString(items[attribute]);
				}
			}
			
			if (validatedItem.sku === undefined) {
				validatedItem.sku = "Fail - no value found";
			}

			if (validatedItem.quantity === undefined) {
				validatedItem.quantity = "Fail - a quantity must be passed";
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
	}

};
