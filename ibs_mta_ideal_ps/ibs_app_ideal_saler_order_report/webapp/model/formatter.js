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

		getStatus: function (sValue) {
		
			switch (sValue) {
			case "01":
				return "Version in process";
			case "02":
				return "Active";
			case "03":
				return "In release";
			case "04":
				return "Partially released";
			case "05":
				return "Release completed";
			case "08":
				return "Rejected";
			case "11":
				return "In Distribution";
			case "12":
				return "Error in Distribution";
			case "13":
				return "Distributed";
			case "26":
				return "In external approval";
			case "14":
				return "In Preparation";
			default:
				return "Unknown Status";
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

		formatStateText: function (sValue) {
		
			if (sValue === 3) {
				return "Success";
			} if(sValue === 1){
				return "Information";
			}if(sValue === 2){
				return "Error";
			}
			if(sValue === 4){
				return "Error";
			}
			if(sValue === 5){
				return "Warning";
			}
			if(sValue === 7){
				return "Error";
			}
			if(sValue === 7){
				return "Error";
			}
		},
			formatterAmount: function (num) {
	
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					pattern: "#,##,##0.00"
				});
				return oNumberFormat.format(num);
			},

			formadata: function (sValue) {
	        
				 if (sValue === "0002") {
					return "Milestone Payments";
				} 
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
			nodeStateFormat : function(sValue){
				if(sValue === "1"){
					return "Positive"
				}else if(sValue === "2"){
					return "Negative"
				}else if(sValue === "3"){
					return "Positive"
				}else if(sValue === "5"){
					return "Positive"
				}else if(sValue === "6"){
					return "Negative"
				}else{
					return "Neutral"
				}
			},
			nodeTextFormat : function(oDate){
				if (oDate !== "" && oDate !== null && oDate !== undefined) {
					// if (oDate.split() === undefined) {		
						var DateInstance = new Date(oDate);
						var date = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: 'yyyy-MM-dd\' at \'hh:mm a'
						});
						return date.format(DateInstance);
		
				}
				return "NA";
			},
			nodeTitleFormat : function(sValue,rValue,nValue){
				if(nValue === "1"){
					return "Created by " + sValue + " - " + rValue;
				}else if(nValue === "2"){
					return "Rejected by " + sValue + " - " + rValue;
				}else if(nValue === "3"){
					return "Approved by " + sValue + " - " + rValue;
				}else if(nValue === "5"){
					return "Material Added by " + sValue + " - " + rValue;
				}
				else if(nValue === "6"){
					return "Material Deleted by " + sValue + " - " + rValue;
				}
				else{
					return "Approved by " + sValue + " - " + rValue + " pending for further approval";
				}
			},
			laneIconFormat : function(sValue){
				if(sValue === "1"){
					return "sap-icon://approvals"
				}else if(sValue === "2"){
					return "sap-icon://clear-all"
				}else if(sValue === "3"){
					return "sap-icon://accept"
				}else if(sValue === "5"){
					return "sap-icon://accept"
				}else if(sValue === "6"){
					return "sap-icon://clear-all"
				}else{
					return "sap-icon://pending"
				}
			},
			laneTextFormat : function(sValue){
				if(sValue === "1"){
					return "Created"
				}else if(sValue === "2"){
					return "Rejected"
				}else if(sValue === "3"){
					return "Approved"
				}else if(sValue === "5"){
					return "Material Added"
				}else if(sValue === "6"){
					return "Material Deleted"
				}else{
					return "In Approval"
				}
			},
			getStatus: function (sValue) {
			
				switch (sValue) {
				case "01":
					return "Version in process";
				case "02":
					return "Active";
				case "03":
					return "In release";
				case "04":
					return "Partially released";
				case "05":
					return "Release completed";
				case "08":
					return "Rejected";
				case "11":
					return "In Distribution";
				case "12":
					return "Error in Distribution";
				case "13":
					return "Distributed";
				case "26":
					return "In external approval";
				case "14":
					return "In Preparation";
				default:
					return "Unknown Status";
				}
			},
	};
});