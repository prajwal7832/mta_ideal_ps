sap.ui.define([], function () {
	"use strict";
	return {
		_charactersValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[A-Za-z,\s]+$/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter only alphabets");
			}
			return reg;
		},
		_validateAccountNumber:function(oEvent){
			var oSource = oEvent.getSource();
			var reg = /^[0-9]{10,18}$/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid account number");
			}
			return reg;
		},
		_validateMobileNum: function (oEvent,sEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[- +()]*[0-9][- +()0-9]*$/.test(oSource.getValue());
			var sValue = Number(oEvent.getSource().getValue());
			
			if(reg === true && oSource.getValue().length < 10 && sEvent === "onChange"){
				reg === false;
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter 10 Digit Mobile Number.");
			} 
			else if(sValue === 0){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please Enter Valid Mobile Number.");
			}
			else if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			}
			else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid Mobile Number.");
			}

			return reg;
		},

		_validateEmail: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^\s*[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}\s*$/.test(oSource.getValue());
			
			if (reg === true && (oSource.getValue() !== "" || oSource.getValue() !== null)) {
				var email = oSource.getValue();
				email = email.trim();
				oSource.setValue(email.toLowerCase());
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid email address");
			}
				return reg;
		},

		// _numberValidation: function (oEvent) {
		// 	var oSource = oEvent.getSource();
		// 	var reg = /^[0-9]+$/.test(oSource.getValue());
		// 	if (reg === true) {
		// 		oSource.setValueState(sap.ui.core.ValueState.None);
		// 	} else {
		// 		oEvent.getSource().setValue("");
		// 		oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter only numbers");
		// 	}
		// 	return reg;
		// },
		_numberValidation: function (oEvent,sEvents) {
			var oSource = oEvent.getSource();
			var reg = /^[0-9]+$/.test(oSource.getValue());

			if(reg === true && sEvents === "TelephoneNoVal" && oSource.getValue().length < 15){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter 15 digits telephone number.");
			}
			else if(sEvents === "TelephoneNoVal" && Number(oSource.getValue()) === 0){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please Enter valid telephone number.");
			}
			else if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} 
			else if(reg === false) {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please Enter only numbers");
			}
			else if(sEvents === "TelephoneNoVal" && oSource.getValue.length >= 15){
				oSource.setValueState(sap.ui.core.ValueState.None);
			}
			return reg;
		},
		_ifscValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid IFSC Code e.g SBIN0011234");
			}
			
			return reg;
		},
		_gstValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(oSource.getValue());
			
			if(Number(oSource.getValue()) === 0){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid GST No e.g 12AACCI6012B8Z0");
			}
			else if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid GST No e.g 12AACCI6012B8Z0");
			}
			return reg;
		},
		_panNoValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid PAN Details e.g ABCDE1234E");
			}
			return reg;
		},
		benificiaryNameValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[A-Za-z0-9? ,_-]+$/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
			}
			return reg;
		},
        VATRegNumValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[0-9]+$/.test(oSource.getValue());
			// var reg = /^\s*([0-9a-zA-Z -]*)\s*$/.test(oSource.getValue());
			if(reg === true && oSource.getValue().length < 15 || oSource.getValue().length > 15){
				reg === false;
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter 15 digits vat number.");
			}
			else if(reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
				if ((oSource.getValue() !== "" || oSource.getValue() !== null) && oSource.getValue().indexOf(" ") >= 0) {
					oSource.setValue(oSource.getValue().replaceAll(" ", ""));
				}
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid vat number.");
			}			
			return reg;
		},

		alphaNumaricVaidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^\s*([0-9a-zA-Z]*)\s*$/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
			}

			if(oSource.getValue() === ""){
				reg === false;
			}
			return reg;
		},

		postalCodeValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[0-9]{6}$/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid postal code. e.g 500211");
				// return;
			}

			return reg;
		},
		validateUpi:function(oEvent){
			var oSource = oEvent.getSource();
			var reg = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/.test(oSource.getValue());

			if(reg === false){
				oSource.setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid UPI ID");
			}
			else{
				oSource.setValueState(sap.ui.core.ValueState.None).setValueStateText("");
			}
			return reg;
		},
		floatValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[0-9]*\.?[0-9]*$/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid percentage");
			}
		},
		
		validateProfileDetails:function(sValue,array_s1){
			var sValidationId = /^[0-9]+$/;
			sValue.filter(function (a,index) {
			// if(a["DISTRIBUTOR ID"] === undefined || a["RETAILER ID"] === undefined){
			// 	if(a["DISTRIBUTOR ID"] === undefined || a["DISTRIBUTOR ID"] === "" 
			// 	|| a["DISTRIBUTOR ID"] === ""){
			// 		array_s1.push({
			// 			"section": 1,
			// 			"description": "Please enter distributor ID in the row " + (index+1) + " of retailer profile section",
			// 			"subtitle": "Mandatory Field",
			// 			"type": "Warning",
			// 			"key":"retailerProfile"
			// 		});
			// 	}
                if(a["RETAILER ID"] === undefined || a["RETAILER ID"] === "" 
				|| a["RETAILER ID"] === ""){
					array_s1.push({
						"section": 1,
						"description": "Please enter retailer ID in the row " + (index+1) + " of retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
			// }
			// else if(sValidationId.test(a["DISTRIBUTOR ID"]) === false || sValidationId.test(a["RETAILER ID"]) === false){
			// 	if(sValidationId.test(a["DISTRIBUTOR ID"]) === false){
			// 		array_s1.push({
			// 			"section": 1,
			// 			"description": "Please enter only numbers in distributor ID section of the row " + (index+1) + " in retailer profile section",
			// 			"subtitle": "Mandatory Field",
			// 			"type": "Warning",
			// 			"key":"retailerProfile"
			// 		});
			// 	}
				else if(sValidationId.test(a["RETAILER ID"]) === false){
					array_s1.push({
						"section": 1,
						"description": "Please enter only numbers in Retailer ID section of the row " + (index+1) + " in retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
			// }
			else{
				if(a["ACCOUNT NUMBER"] === undefined || a["ACCOUNT NUMBER"] === "" 
				|| a["ACCOUNT NUMBER"] === ""){
					array_s1.push({
						"section": 1,
						"description": "Please enter account number for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
				else{
					var reg = /^[0-9]{10,18}$/.test(a["ACCOUNT NUMBER"]);
					if(reg === false){
						array_s1.push({
							"section": 1,
							"description": "Please enter valid account number for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
							"subtitle": "Mandatory Field",
							"type": "Error",
							"key":"retailerProfile"
						});
					}
					else if(Number(a["ACCOUNT NUMBER"]) === 0){
						array_s1.push({
							"section": 1,
							"description": "Please enter valid account number for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
							"subtitle": "Mandatory Field",
							"type": "Error",
							"key":"retailerProfile"
						});
					}
				}
				if(a["BANK NAME"] === undefined || a["BANK NAME"] === "" 
				|| a["BANK NAME"] === ""){
					array_s1.push({
						"section": 1,
						"description": "Please enter bank name for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
				
				if(a["IFSC CODE"] === undefined || a["IFSC CODE"] === "" 
				|| a["IFSC CODE"] === ""){
					array_s1.push({
						"section": 1,
						"description": "Please enter IFSC code for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
				else{
					var reg = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(a["IFSC CODE"]);
					if(reg === false){
						array_s1.push({
							"section": 1,
							"description": "Please enter valid Ifsc code for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
							"subtitle": "Mandatory Field",
							"type": "Error",
							"key":"retailerProfile"
						});
					}
				}
				if(a["PAN NO"] === undefined || a["PAN NO"] === "" 
				|| a["PAN NO"] === ""){
					// array_s1.push({
					// 	"section": 1,
					// 	"description": "Please enter PAN code for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
					// 	"subtitle": "Mandatory Field",
					// 	"type": "Warning",
					// 	"key":"retailerProfile"
					// });
				}
				else{
					var reg = /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(a["PAN NO"]);

					if(reg === false){
						array_s1.push({
							"section": 1,
							"description": "Please enter valid pan number for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
							"subtitle": "Optional Field",
							"type": "Error",
							"key":"retailerProfile"
						});
					}
				}
				if(a["PAYMENT TERMS"] === undefined || a["PAYMENT TERMS"] === "" 
				|| a["PAYMENT TERMS"] === ""){
					array_s1.push({
						"section": 1,
						"description": "Please enter payment terms for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
				if(a["REGISTERED TAX ID"] === undefined || a["REGISTERED TAX ID"] === "" 
				|| a["REGISTERED TAX ID"] === "" || Number(a["REGISTERED TAX ID"]) === 0){
					array_s1.push({
						"section": 1,
						"description": "Please enter registered tax ID for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
				// else {
				// 	if()
				// }
				if(a["RETAILER CLASSIFICATION"] === undefined || a["RETAILER CLASSIFICATION"] === "" 
				|| a["RETAILER CLASSIFICATION"] === ""){
					array_s1.push({
						"section": 1,
						"description": "Please enter retailer classification for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
				if(a["RETAILER NAME"] === undefined || a["RETAILER NAME"] === "" 
				|| a["RETAILER NAME"] === ""){
					array_s1.push({
						"section": 1,
						"description": "Please enter retailer name for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
				else{
					var reg = /^[A-Za-z\s]+$/.test(a["RETAILER NAME"]);
					if(reg === false){
						array_s1.push({
							"section": 1,
							"description": "Please enter valid retailer name for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
							"subtitle": "Mandatory Field",
							"type": "Error",
							"key":"retailerProfile"
						});
					}
				}
				if(a["RETAILER TYPE"] === undefined || a["RETAILER TYPE"] === "" 
				|| a["RETAILER TYPE"] === ""){
					array_s1.push({
						"section": 1,
						"description": "Please enter retailer type for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"retailerProfile"
					});
				}
				
				if(a["UPI ID"] === undefined || a["UPI ID"] === "" 
				|| a["UPI ID"] === ""){
					// array_s1.push({
					// 	"section": 1,
					// 	"description": "Please enter upi ID for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
					// 	"subtitle": "Mandatory Field",
					// 	"type": "Warning",
					// 	"key":"retailerProfile"
					// });
				}
				else{
					var reg = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/.test(a["UPI ID"]);

					if(reg === false){
						array_s1.push({
							"section": 1,
							"description": "Please enter valid UPI ID for Retailer ID "+a["RETAILER ID"]+" in retailer profile section",
							"subtitle": "Optional Field",
							"type": "Error",
							"key":"retailerProfile"
						});
					}
				}
			}
			   
			}, Object.create(null));

			return array_s1;
		},
		validateProfileAddress:function(sValue,array_s1){
			var sValidationId = /^[0-9]+$/;
			sValue.filter(function (a,index) {
				// if(a["DISTRIBUTOR ID"] === undefined || a["RETAILER ID"] === undefined){
				// 	if(a["DISTRIBUTOR ID"] === undefined || a["DISTRIBUTOR ID"] === "" 
				// 	|| a["DISTRIBUTOR ID"] === ""){
				// 		array_s1.push({
				// 			"section": 1,
				// 			"description": "Please enter distributor ID of the row " + (index+1) + " in retailer address section",
				// 			"subtitle": "Mandatory Field",
				// 			"type": "Warning",
				// 			"key":"addressDetails"
				// 		});
				// 	}
					if(a["RETAILER ID"] === undefined || a["RETAILER ID"] === "" 
					|| a["RETAILER ID"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter retailer ID of the row " + (index+1) + " in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
				// }
				// else if(sValidationId.test(a["DISTRIBUTOR ID"]) === false || sValidationId.test(a["RETAILER ID"]) === false){
				// 	if(sValidationId.test(a["DISTRIBUTOR ID"]) === false){
				// 		array_s1.push({
				// 			"section": 1,
				// 			"description": "Please enter only numbers in distributor ID section of the row " + (index+1) + " in retailer profile section",
				// 			"subtitle": "Mandatory Field",
				// 			"type": "Warning",
				// 			"key":"addressDetails"
				// 		});
				// 	}
					else if(sValidationId.test(a["RETAILER ID"]) === false){
						array_s1.push({
							"section": 1,
							"description": "Please enter only numbers in Retailer ID section of the row " + (index+1) + " in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
				// }
				else{
					if(a["ADDRESS TYPE"].split("-")[1] === undefined || a["ADDRESS TYPE"].split("-")[1] === "" 
					|| a["ADDRESS TYPE"].split("-")[1] === null){
						array_s1.push({
							"section": 1,
							"description": "Please select address type for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
					if(a["STREET NO"] === undefined || a["STREET NO"] === "" 
					|| a["STREET NO"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter street no for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
					
					if(a["ADDRESS LINE 1"] === undefined || a["ADDRESS LINE 1"] === "" 
					|| a["ADDRESS LINE 1"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter address line 1 for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
					if(a["COUNTRY"] === undefined || a["COUNTRY"] === "" 
					|| a["COUNTRY"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter country for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}

					if(a["REGION"] === undefined || a["REGION"] === "" 
					|| a["REGION"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter region for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
					if(a["CITY"] === undefined || a["CITY"] === "" 
					|| a["CITY"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter city for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
					if(a["POSTAL CODE"] === undefined || a["POSTAL CODE"] === "" 
					|| a["POSTAL CODE"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter postal code for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
					else{
						var reg = /^[0-9]{6}$/.test(a["POSTAL CODE"]);
						if(reg === false){
							array_s1.push({
								"section": 1,
								"description": "Please enter valid postal code for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
								"subtitle": "Mandatory Field",
								"type": "Error",
								"key":"addressDetails"
							});
						}
					}
					
					if(a["MOBILE NO"] === undefined || a["MOBILE NO"] === "" 
					|| a["MOBILE NO"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter mobile number for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
					else{
						var reg = /^[- +()]*[0-9][- +()0-9]*$/.test(a["MOBILE NO"]);
						var sValue = Number(a["MOBILE NO"]);
						if(sValue === 0){
							reg = false;
						}
			
						if(reg === true &&  a["MOBILE NO"].length < 10){
							array_s1.push({
								"section": 1,
								"description": "Please enter 10 digit mobile number for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
								"subtitle": "Mandatory Field",
								"type": "Warning",
								"key":"addressDetails"
							});
						} 
						else if(reg === false){
							array_s1.push({
								"section": 1,
								"description": "Please enter valid mobile number for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
								"subtitle": "Mandatory Field",
								"type": "Error",
								"key":"addressDetails"
							});
						}
					}
					
					if(a["EMAIL ID"] === undefined || a["EMAIL ID"] === "" 
					|| a["EMAIL ID"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter email ID for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
					else{
						var reg = /^\s*[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}\s*$/.test(a["EMAIL ID"]);
						if(reg === false){
							array_s1.push({
								"section": 1,
								"description": "Please enter valid email ID for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
								"subtitle": "Mandatory Field",
								"type": "Error",
								"key":"addressDetails"
							});
						}
						else if(reg === true){
							a["EMAIL ID"] = a["EMAIL ID"].trim();
							a["EMAIL ID"] = a["EMAIL ID"].toLowerCase();
						}
			
					}
					if(a["CONTACT PERSON"] === undefined || a["CONTACT PERSON"] === "" 
					|| a["CONTACT PERSON"] === null){
						array_s1.push({
							"section": 1,
							"description": "Please enter contact person for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
							"subtitle": "Mandatory Field",
							"type": "Warning",
							"key":"addressDetails"
						});
					}
					else{
						var reg = /^[A-Za-z,\s]+$/.test(a["CONTACT PERSON"]);
						if(reg === false){
							array_s1.push({
								"section": 1,
								"description": "Please enter only alphabets in contact person field for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
								"subtitle": "Mandatory Field",
								"type": "Warning",
								"key":"addressDetails"
							});
						}
					}
					if(a["FAX NO"]=== undefined || a["FAX NO"] === "" 
					|| a["FAX NO"] === null){

					}
					else{
						var reg = /^[0-9]+$/.test(a["FAX NO"]);

						if(reg === false){
							array_s1.push({
								"section": 1,
								"description": "Please enter valid Fax Number for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
								"subtitle": "Optional Field",
								"type": "Warning",
								"key":"addressDetails"
							});
						}
						else if(Number(a["FAX NO"]) === 0){
							if(reg === false){
								array_s1.push({
									"section": 1,
									"description": "Please enter valid Fax Number for Retailer ID "+a["RETAILER ID"]+" in retailer address section",
									"subtitle": "Optional Field",
									"type": "Warning",
									"key":"addressDetails"
								});
							}
						}
					}
				}
				   
				}, Object.create(null));
	
				return array_s1;
		},
		validateTable:function(sValue,array_s1){
			for(var i=0;i<sValue.length;i++){
			
			if(sValue[i].ADDRESS_TYPE === "" || sValue[i].ADDRESS_TYPE === null || sValue[i].ADDRESS_TYPE === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please select address type in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}
			if(sValue[i].STREET_NO === "" || sValue[i].STREET_NO === null){
				array_s1.push({
					"section": 2,
					"description": "Please enter Street No in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].ADDRESS_LINE_1 === "" || sValue[i].ADDRESS_LINE_1 === null){
				array_s1.push({
					"section": 2,
					"description": "Please enter Address Line 1 in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}
			// if(sValue[i].ADDRESS_LINE_2 === "" || sValue[i].ADDRESS_LINE_2 === null){
			// 	array_s1.push({
			// 		"section": 2,
			// 		"description": "Please enter Address Line 2 in Row "+ (i+1) +" of address details table",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"addressDetails"
			// 	});
			// }
			// if(sValue[i].ADDRESS_LINE_3 === "" || sValue[i].ADDRESS_LINE_3 === null){
			// 	array_s1.push({
			// 		"section": 2,
			// 		"description": "Please enter Address Line 3 in Row "+ (i+1) +" of address details table",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"addressDetails"
			// 	});
			// }

			if(sValue[i].COUNTRY === "" || sValue[i].COUNTRY === null){
				array_s1.push({
					"section": 2,
					"description": "Please select a Country in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].REGION === "" || sValue[i].REGION === null){
				array_s1.push({
					"section": 2,
					"description": "Please select a Region in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].CITY === "" || sValue[i].CITY === null){
				array_s1.push({
					"section": 2,
					"description": "Please select a City in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].POSTAL_CODE === "" || sValue[i].POSTAL_CODE === null){
				array_s1.push({
					"section": 2,
					"description": "Please enter Postal Code in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].MOBILE_NO === "" || sValue[i].MOBILE_NO === null){
				array_s1.push({
					"section": 2,
					"description": "Please enter Mobile No in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}
			else{
				if(Number(sValue[i].MOBILE_NO) === 0){
					array_s1.push({
						"section": 2,
						"description": "Please enter valid Mobile No in Row "+ (i+1) +" of address details table",
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"subsection":"addressDetails"
					});
				}
			}

			if(sValue[i].TELEPHONE_NO === "" || sValue[i].TELEPHONE_NO === null){
				// array_s1.push({
				// 	"section": 2,
				// 	"description": "Please enter Telephone No in Row "+ (i+1) +" of address details table",
				// 	"subtitle": "Mandatory Field",
				// 	"type": "Warning",
				// 	"subsection":"addressDetails"
				// });
			}
			else{
				if(Number(sValue[i].TELEPHONE_NO) === 0){
					array_s1.push({
						"section": 2,
						"description": "Please enter valid Telephone No in Row "+ (i+1) +" of address details table",
						"subtitle": "Optional Field",
						"type": "Warning",
						"subsection":"addressDetails"
					});
				}
			}

			if(sValue[i].EMAIL_ID === "" || sValue[i].EMAIL_ID === null){
				array_s1.push({
					"section": 2,
					"description": "Please enter Retailer Email ID in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].CONTACT_PERSON === "" || sValue[i].CONTACT_PERSON === null){
				array_s1.push({
					"section": 2,
					"description": "Please enter Contact Person in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			// if(sValue[i].FAX_NO === "" || sValue[i].FAX_NO === null){
			// 	array_s1.push({
			// 		"section": 2,
			// 		"description": "Please enter Fax No in Row "+ (i+1) +" of address details table",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"addressDetails"
			// 	});
			// 	}
			}
			return array_s1;
		},
		validateSections:function(sValue,array_s1){
			if(sValue.RETAILER_NAME === "" || sValue.RETAILER_NAME === null){
				array_s1.push({
					"section": 1,
					"description": "Please enter Retailer Name",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"retailerProfile",
					"text": "idName"
				});
			}

			if(sValue.RETAILER_TYPE === "" || sValue.RETAILER_TYPE === null){
				array_s1.push({
					"section": 1,
					"description": "Please select a Retailer Type",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"retailerProfile",
					"text": "idRetailderType"
				});
			}

			if(sValue.RETAILER_CLASS === "" || sValue.RETAILER_CLASS === null){
				array_s1.push({
					"section": 1,
					"description": "Please select Retailer Classification",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"retailerProfile",
					"text": "idRetailserClass"
				});
			}

			if(sValue.PAY_TERM === "" || sValue.PAY_TERM === null){
				array_s1.push({
					"section": 1,
					"description": "Please select Payment Terms",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"retailerProfile",
					"text": "idPaymentTerms"
				});
			}

			// Section 2

			if(sValue.NAME_OF_BANK === "" || sValue.NAME_OF_BANK === null){
				array_s1.push({
					"section": 2,
					"description": "Please enter bank name",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bankDetails",
					"text": "idNameOfBank"
				});
			}
			if(sValue.BANK_ACC_NO === "" || sValue.BANK_ACC_NO === null){
				array_s1.push({
					"section": 2,
					"description": "Please enter Account number",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bankDetails",
					"text": "idAccountNo"
				});
			}
			if(sValue.IFSC_CODE === "" || sValue.IFSC_CODE === null){
				array_s1.push({
					"section": 2,
					"description": "Please enter IFSC Code",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bankDetails",
					"text": "idIfsc"
				});
			}
			// if(sValue.UPI_ID === "" || sValue.UPI_ID === null){
			// 	array_s1.push({
			// 		"section": 2,
			// 		"description": "Please enter UPI ID",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"bankDetails",
			// 		"text": "idUpi"
			// 	});
			// }

			// Section 3

			if(sValue.REGISTERED_TAX_ID === "" || sValue.REGISTERED_TAX_ID === null){
				array_s1.push({
					"section": 3,
					"description": "Please enter Registered Tax ID",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"taxDetailsObjSub",
					"text": "idGstNo"
				});
			}

			// Section 4
			
			if(sValue.FILE_NAME === "" || sValue.FILE_NAME === null){
				array_s1.push({
					"section": 4,
					"description": "Please Upload the file",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"idAttachments"
				});
			}
			return array_s1;
		},
		retailerProfileVal:function(sValue,sRetailerDataArr){

			for(var i=0;i<sValue.length;i++){
				sRetailerDataArr.push({
					"section": 1,
					"description": "Please add the retailer profile data for Retailer ID : "+sValue[i]["RETAILER ID"],
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"key":"retailerProfile"
				});
			}
			return sRetailerDataArr;
		},
		retailerAddressVal:function(sValue,sRetailerAddressArr,sEvents){
			if(sEvents === "BL_ADDR"){
				for(var i=0;i<sValue.length;i++){
					sRetailerAddressArr.push({
						"section": 1,
						"description": "Please add the retailer billing address data for Retailer ID : "+sValue[i]["RETAILER ID"],
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"addressDetails"
					});
				}
			}

			if(sEvents ==="SHP_ADDR"){
				for(var i=0;i<sValue.length;i++){
					sRetailerAddressArr.push({
						"section": 1,
						"description": "Please add the retailer ship to address data for Retailer ID : "+sValue[i]["RETAILER ID"],
						"subtitle": "Mandatory Field",
						"type": "Warning",
						"key":"addressDetails"
					});
				}
			}
			return sRetailerAddressArr;
		}

	};
});