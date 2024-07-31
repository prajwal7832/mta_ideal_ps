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
			
			if (Number(oSource.getValue()) === 0) {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid account number");
			}
			else if(reg === false){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid account number");
			}
			else if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			}
			return reg;
		},
		_validateMobileNum: function (oEvent,sEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[- +()]*[0-9][- +()0-9]*$/.test(oSource.getValue());
			var sValue = Number(oEvent.getSource().getValue());
			
			if(reg === true && oSource.getValue().length < 10 && sEvent === "onChange"){
				reg = false;
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter 10 Digit Mobile Number.");
			} 
			else if(sValue === 0){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid Mobile Number.");
			}
			else if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			}
			else if(reg === false){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid Mobile Number.");
			}
			 
			return reg;
		},

		_validateEmail: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^\s*[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}\s*$/.test(oSource.getValue());
			// var reg = /^\s*[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}\s*$/.test(oSource.getValue());

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

		_numberValidation: function (oEvent,sEvents) {
			var oSource = oEvent.getSource();
			var reg = /^[0-9]+$/.test(oSource.getValue());

			if(reg === true && sEvents === "TelephoneNoVal" && oSource.getValue().length < 15){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter 15 digits telephone number.");
			}
			else if(sEvents === "TelephoneNoVal" && Number(oSource.getValue()) === 0){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid Mobile Number.");
			}
			else if(reg === false) {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter only numbers");
			}
			else if(sEvents === "TelephoneNoVal" && oSource.getValue.length >= 15){
				oSource.setValueState(sap.ui.core.ValueState.None);
			}
			else if (reg === true && oSource.getValue() !== "") {
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
			// var reg = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(oSource.getValue());
			
			if(Number(oSource.getValue()) === 0){
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid GST No e.g 12AACCI6012B8Z0");
			}
			else if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} 
			else {
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

			if(reg === true && (oSource.getValue().length < 15 || oSource.getValue().length > 15)){
				reg = false;
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter 15 digits vat number");
			}
			else if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
				// if ((oSource.getValue() !== "" || oSource.getValue() !== null) && oSource.getValue().indexOf(" ") >= 0) {
				// 	oSource.setValue(oSource.getValue().replaceAll(" ", ""));
				// }
			} else if(reg === false) {
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
				reg = false;
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

			// if (!isNaN(postalCodeLength)) {
			// 	if (oSource.getValue().length !== postalCodeLength && oSource.getValue().length !== 0) {
			// 		oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid postal code with " + postalCodeLength +
			// 			" digits");
			// 		oEvent.getSource().setValue("");
			// 	}
			// } else {
			// 	oSource.setValueState(sap.ui.core.ValueState.None);
			// }
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
		validateIncorrectFields:function(sValue,array_s2){
			if(sValue.faxNo){
				array_s2.push({
					"section": 1,
					"description": "Please enter Valid Fax No",
					"subtitle": "Optional Field",
					"type": "information",
					"subsection":"retailerProfile"
				});
			}
			return array_s2;
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
			if(sValue[i].STREET_NO === "" || sValue[i].STREET_NO === null || sValue[i].STREET_NO === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please enter Street No in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].ADDRESS_LINE_1 === "" || sValue[i].ADDRESS_LINE_1 === null || sValue[i].ADDRESS_LINE_1 === undefined){
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

			if(sValue[i].COUNTRY === "" || sValue[i].COUNTRY === null || sValue[i].COUNTRY === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please select a Country in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].REGION === "" || sValue[i].REGION === null || sValue[i].REGION === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please select a Region in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].CITY === "" || sValue[i].CITY === null || sValue[i].CITY === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please select a City in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].POSTAL_CODE === "" || sValue[i].POSTAL_CODE === null || sValue[i].POSTAL_CODE === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please enter Postal Code in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].MOBILE_NO === "" || sValue[i].MOBILE_NO === null || sValue[i].MOBILE_NO === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please enter Mobile No in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			// if(sValue[i].TELEPHONE_NO === "" || sValue[i].TELEPHONE_NO === null){
			// 	array_s1.push({
			// 		"section": 2,
			// 		"description": "Please enter Telephone No in Row "+ (i+1) +" of address details table",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"addressDetails"
			// 	});
			// }

			if(sValue[i].EMAIL_ID === "" || sValue[i].EMAIL_ID === null || sValue[i].EMAIL_ID === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please enter Retailer Email ID in Row "+ (i+1) +" of address details table",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
			}

			if(sValue[i].CONTACT_PERSON === "" || sValue[i].CONTACT_PERSON === null || sValue[i].CONTACT_PERSON === undefined){
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
			if(sValue.RETAILER_NAME === "" || sValue.RETAILER_NAME === null || sValue.RETAILER_NAME === undefined){
				array_s1.push({
					"section": 1,
					"description": "Please enter Retailer Name",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"retailerProfile",
					"text":"idName"
				});
			}

			if(sValue.RETAILER_TYPE === "" || sValue.RETAILER_TYPE === null || sValue.RETAILER_TYPE === undefined){
				array_s1.push({
					"section": 1,
					"description": "Please select a Retailer Type",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"retailerProfile",
					"text":"idRetailerType"
				});
			}

			if(sValue.RETAILER_CLASS === "" || sValue.RETAILER_CLASS === null || sValue.RETAILER_CLASS === undefined){
				array_s1.push({
					"section": 1,
					"description": "Please select Retailer Classification",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"retailerProfile",
					"text":"idRetailserClass"
				});
			}

			if(sValue.PAY_TERM === "" || sValue.PAY_TERM === null || sValue.PAY_TERM === undefined){
				array_s1.push({
					"section": 1,
					"description": "Please select Payment Terms",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"retailerProfile",
					"text":"idPaymentTerms"
				});
			}

			// Section 2

			if(sValue.NAME_OF_BANK === "" || sValue.NAME_OF_BANK === null || sValue.NAME_OF_BANK === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please enter Bank Name",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bankDetails",
					"text":"idNameOfBank"
				});
			}
			if(sValue.BANK_ACC_NO === "" || sValue.BANK_ACC_NO === null || sValue.BANK_ACC_NO === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please enter Account number",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bankDetails",
					"text":"idAccountNo"
				});
			}
			if(sValue.IFSC_CODE === "" || sValue.IFSC_CODE === null || sValue.IFSC_CODE === undefined){
				array_s1.push({
					"section": 2,
					"description": "Please enter IFSC Code",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bankDetails",
					"text":"idIfsc"
				});
			}
			// if(sValue.UPI_ID === "" || sValue.UPI_ID === null || sValue.UPI_ID === undefined){
			// 	array_s1.push({
			// 		"section": 2,
			// 		"description": "Please enter UPI ID",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"bankDetails",
			// 		"text":"idUPI"
			// 	});
			// }

			// Section 3

			if(sValue.REGISTERED_TAX_ID === "" || sValue.REGISTERED_TAX_ID === null || sValue.REGISTERED_TAX_ID === undefined){
				array_s1.push({
					"section": 3,
					"description": "Please enter Registered Tax ID",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"taxDetailsObjSub",
					"text":"idGstNo"
				});
			}

			// if(sValue.PAN_NO === "" || sValue.PAN_NO === null || sValue.PAN_NO === undefined){
			// 	array_s1.push({
			// 		"section": 3,
			// 		"description": "Please enter PAN number",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"taxDetailsObjSub",
			// 		"text":"idPan"
			// 	});
			// }

			// if(sValue.VAT_NO === "" || sValue.VAT_NO === null){
			// 	array_s1.push({
			// 		"section": 3,
			// 		"description": "Please enter vat number",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"taxDetailsObjSub"
			// 	});
			// }
			// Section 4
			
			if(sValue.FILE_NAME === "" || sValue.FILE_NAME === null || sValue.FILE_NAME === undefined){
				array_s1.push({
					"section": 4,
					"description": "Upload the file",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"idAttachments",
					"text":"fileUploader"
				});
			}
			return array_s1;
		}

	};
});