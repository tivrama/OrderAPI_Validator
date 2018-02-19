var carrierList = require("../library/carriers.js").carrierList;

module.exports = {


	checkNonEmptyString: function(string) {
		if (typeof(string) === "string" && string !== "") {
			return "Pass";
		} else {
			return "Fail - invalid string"
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
