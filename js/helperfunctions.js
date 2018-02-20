var carrierList = require("../library/carriers.js").carrierList;

module.exports = {


	checkNonEmptyString: function(string, required) {
		if (typeof(string) === "string" && string !== "") {
			return "Pass"
		} else {
			return required ? "Fail - invalid string" : "Warning - no value found"
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
			return required ? "Fail - invalid number" : "Warning - no value found"
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

	lookupCarrierCodes: function(code) {
		var carrierExists = "fail";
		code = code.toUpperCase();

		for (var carrier in carrierList) {
			if (carrierList[carrier] === code) {
				carrierExists = "Pass";
			}
		}

		return carrierExists;
	}


};
