var carrierList = require("../library/library").carrierList;
var countryList = require("../library/library.js").countryList;

module.exports = {


	checkNonEmptyString: function(string, required) {
		if (typeof(string) === "string" && string !== "") {
			return "Pass"
		} else {
			return required ? "Fail - invalid string" : "Warning - no value found or not in String format"
		}
	},



	checkValidNumber: function(number, required) {
		if (typeof(number) === "number") {
			if (number > 0) {
				return "Pass";
			} else {
				return "Cannot pass '0' or negative value"
			}
		} else {
			return required ? "Fail - invalid number" : "Warning - no value found or not in number format"
		}	
	},



	checkValidBoolean: function(boolean, required) {
		if (typeof(boolean) === "boolean") {
			return "Pass";
		} else {
			return required ? "Fail - invalid boolean" : "Warning - no value found"
		}	
	},

	checkValidStringBoolean: function(stringBoolean, required) {

		if (typeof(stringBoolean) === "string") {
			stringBoolean = stringBoolean.toLowerCase();
		}
	    
		switch (stringBoolean) {
		    case true:
		        return "Pass"
		        break;
		    case false:
		        return "Pass"
		        break;
		    case "true":
		    	return "Pass"
		    	break;
		    case "false":
		    	return "Pass"
		    	break;
		    default:
		}

		if (required) {
			return "Fail - invalid boolean"
		} else {
			return "Warning - invalid boolean";
		}
	},



	checkValidImage: function(image, required) {
		if (typeof(image) === "string" && image !== "") {
			uri = image.split('?')[0];
			var parts = uri.split('.');
			var extension = parts[parts.length-1];		
			var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp']
			if (imageTypes.indexOf(extension) !== -1) {
				return "Pass";   
			} else {
				return "Fail - not a valid image type"
			}

		} else {
			return required ? "Fail - invalid string" : "Warning - no value found"
		}
	},



	validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
	    return re.test(String(email).toLowerCase());
	},

	checkValidEmail: function(email, required) {
		if (typeof(email) === "string" && email !== "") {
			var checkFormat = this.validateEmail(email);
			return checkFormat ? "Pass" : "Fail - invalid email"
		} else {
			return required ? "Fail - invalid email" : "Fail - no value found"
		}
	},

	checkValidPhone: function(phone) {
		return phone.match(/\d/g).length===10
	},



	checkAddress: function(address) {
		var validatedAddress = {
			street_1: undefined,
			street_2: undefined,
			city: undefined,
			state: undefined,
			zip: undefined,
			country: undefined
		};

		for (var attribute in address) {
			if (attribute === "street_1") {
				validatedAddress.street_1 = this.checkNonEmptyString(address[attribute], true)
			}
			if (attribute === "street_2") {
				validatedAddress.street_2 = this.checkNonEmptyString(address[attribute])
			}
			if (attribute === "city") {
				validatedAddress.city = this.checkNonEmptyString(address[attribute], true)
			}
			if (attribute === "state") {
				validatedAddress.state = this.checkNonEmptyString(address[attribute], true)
			}
			if (attribute === "zip") {
				validatedAddress.zip = this.checkNonEmptyString(address[attribute], true)
			}
			if (attribute === "country") {
				validatedAddress.country = this.checkNonEmptyString(address[attribute])
			}
		}

		// Loop through validatedAddress and look for missed fields
		for (var attribute in validatedAddress) {
			if (validatedAddress[attribute] === undefined) {
				switch(attribute) {
				    case "street_1":
				        validatedAddress.street_1 = "Fail - No 'street_1'"
				        break;
				    case "street_2":
				        validatedAddress.street_2 = "Warning - No 'street_2'"
				        break;
				    case "city":
				    	validatedAddress.city = "Fail - No 'city'"
				    	break;
				    case "state":
				    	validatedAddress.state = "Fail - No 'state'"
				    	break
				    case "zip":
				    	validatedAddress.zip = "Fail - No 'zip'"
				    	break
				    case "country":
				    	validatedAddress.country = "Warning - No 'country'"
				    	break
				    default:
				}
			}
		}

		return validatedAddress;
	},



	lookupCarrierCodes: function(code) {
		var carrierExists = "Fail - Not a valid carrier moniker";
		code = code.toUpperCase();

		for (var carrier in carrierList) {
			if (carrierList[carrier] === code) {
				carrierExists = "Pass";
				return carrierExists;
			}
		}

		return carrierExists;
	},

	lookupCountryCodes: function(code) {
		var countryExists = "Fail - Not a valid country code";
		code = code.toUpperCase();

		for (var country in countryList) {
			if (countryList[country] === code) {
				countryExists = "Pass";
				return countryExists;
			}
		}

		return countryExists;
	}


};
