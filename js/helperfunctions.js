var carrierList = require("../library/carriers.js").carrierList;

module.exports = {


	lookupCarrierCodes: function(code) {
		var carrierExists = "fail";
		code = code.toUpperCase();

		for (var carrier in carrierList) {
			if (carrierList[carrier] === code) {
				carrierExists = "pass";
			}
		}

		return carrierExists;
	}


};
