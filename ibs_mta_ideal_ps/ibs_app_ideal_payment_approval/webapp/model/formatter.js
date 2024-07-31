sap.ui.define([], function () {
	"use strict";
	return {


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
		formadata: function (sValue) {
			//debugger
			if (sValue === "0002") {
			   return "14 days Payment Term";
		   } 
	   },

	   paymentType : function (sValue){
		debugger
		   if (sValue === "" || sValue === null || sValue === undefined) {
			   return "NA";
		   }
		   else {
			   return sValue;
		   }
	   },
	   
	   formatStateText: function (sValue) {
			//debugger
			if (sValue === 3) {
				return "Error";
			} if(sValue === 1){
				return "Information";
			}if(sValue === 2){
				return "Success";
			}if(sValue === 4){
				return "Warning";
			}if(sValue === 5){
				return "Warning";
			}
	},
	formatterAmount: function (num) {
			
		var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
			pattern: "#,##,##0.00"
		});
		return oNumberFormat.format(num);
		// num = parseInt(num,10).toFixed(2);
		// return String(num);

	},
	
	
	
	

	};
});