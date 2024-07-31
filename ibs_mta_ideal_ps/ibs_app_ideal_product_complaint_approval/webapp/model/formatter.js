sap.ui.define([], function () {
	"use strict";
	return {

		getNumber: function (sValue) {
		
			var formattedValue = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 1,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: "."
			}).format(sValue);
			return formattedValue
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

		formatStateText: function (sValue) {
		
			if (sValue === 3) {
				return "Success";
			} if(sValue === 1){
				return "Information";
			}if(sValue === 2){
				return "Error";
			}if(sValue === 4){
				return "Error";
			}
		},
			formatterAmount: function (num) {
	
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					pattern: "#,##,##0.00"
				});
				return oNumberFormat.format(num);
			},

			

			coloumnEnable: function (sValue) {
			
				if (sValue === 3) {
					 return false;
				} if(sValue === 1){
					return true;
				}if(sValue === 2){
					return true;
				}
			},

			stockFramte: function (num) {
	
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					pattern: "#,##,##0"
				});
				return oNumberFormat.format(num);
			},
	};
});