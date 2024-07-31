sap.ui.define([], function () {
	"use strict";
	return {

		getNumber: function (sValue) {
		debugger
			var formattedValue = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 1,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: "."
			}).format(sValue);
			return formattedValue
		},

		formatStateText: function (sValue) {
			
		if (sValue === 3) {
			return "Success";
		} if(sValue === 1){
			return "Information";
		}if(sValue === 2){
			return "Error";
		}if(sValue === 5){
			return "Error";
		}
		},

		removeLeadingZeros: function (inputNumber) {
            
			if (/^0\d+$/.test(inputNumber)) {
				return inputNumber.replace(/^0+/, '');
			}
			return inputNumber;
		},

		formatDate: function (oDate) {
			if (oDate !== "" && oDate !== null && oDate !== undefined) {
				// if (oDate.split() === undefined) {
					var DateInstance = new Date(oDate);
					var date = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy"
					});
	 
					return date.format(DateInstance);
	 
			}
			return "NA";
		},
	   
	
	
		formatterAmount: function (num) {
			
            var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                pattern: "#,##,##0.00"
            });
            return oNumberFormat.format(num);
			// num = parseInt(num,10).toFixed(2);
			// return String(num);

        },



		document : function (sValue){
        
			if (sValue === "" || sValue === null || sValue === undefined) {
				return "NA";
			}
			else {
				return sValue;
			}
		},

		tableAmountt: function (num) {
			
            var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                pattern: "₹ #,##,##0.00"
            });
            return oNumberFormat.format(num);
			// num = parseInt(num,10).toFixed(2);
			// return String(num);

        },


		formadata: function (sValue) {
			
			if (sValue === "0002") {
			   return "Milestone Payments";
		   } 
	   },

	};
});