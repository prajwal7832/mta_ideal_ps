sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/ui/core/message/Message",
	"sap/ui/model/json/JSONModel",
	"../model/down",
	"../model/jszip",
	"../model/xlsx",
	"com/ibs/ibsappidealviewchange/model/validation",
    "com/ibs/ibsappidealviewchange/model/formatter"

], function (Controller, MessageToast, Filter, FilterOperator,BusyIndicator,MessageBox, MessagePopover, MessageItem, Message, JSONModel, down, jszip,
	xlsx,validation,formatter) {
	"use strict";
	var submitBtnActivity,context,that,oView,distributorId;
	var appModulePath;
	return Controller.extend("com.ibs.ibsappidealviewchange.controller.UploadPage", {
		formatter:formatter,
		onInit: function () {
			distributorId = "1100013";
			that = this;
			context = this;
			oView = context.getView();
			
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteUploadPage").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched:function(oEvent){
            BusyIndicator.hide();
			// this.getView().byId("submitId").setEnabled(false);
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);

            that.getView().byId("Table1").setVisibleRowCount(0);
			that.getView().byId("Table3").setVisibleRowCount(0);
			this.getView().byId("oCountLocalModel").setVisible(false);
			this.getView().byId("oCountLocalModel2").setVisible(false);

			submitBtnActivity = "null";
			this.localModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.localModel, "localModel");

			this.localModel2 = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.localModel2, "localModel2");
			this.localModel3 = new sap.ui.model.json.JSONModel();
		},
		onUpload: function (e) {
			this._import(e.getParameter("files") && e.getParameter("files")[0]);
		},
		onTableCount:function(oEvent){
			
			var getId = oEvent.getSource().getId().split("--")[2];

			if(getId === "oCountLocalModel"){
			// var oTable1Data = that.getView().getModel("localModel").getProperty("/table1Data")
			var oTable1Count = that.getView().getModel("localModel").getProperty("/oCount");
			oTable1Count = oTable1Count + 10;
			if(that.localModel.getData().length === 10){
				$.merge(that.localModel.getData(),that.arrayData[0]);

				if(oTable1Count <= that.localModel.getData().length){
				that.localModel.setData(that.localModel.getData().splice(0,oTable1Count));
				that.getView().getModel("localModel").setProperty("/table1Length",that.arrayData[0].length + 10);
				that.getView().getModel("localModel").setProperty("/oCount",oTable1Count);
				that.getView().setModel(that.localModel,"localModel");
				that.getView().byId("Table1").setVisibleRowCount(oTable1Count);
				}
				
			}
			else if(that.localModel.getData().length > 10){
				var oFirstSpliceData = that.localModel.getData().splice(0,10);
				$.merge(oFirstSpliceData,that.arrayData[0]);

				if(oTable1Count <= oFirstSpliceData.length){
				that.localModel.setData(oFirstSpliceData.splice(0,oTable1Count));
				that.getView().getModel("localModel").setProperty("/table1Length",oFirstSpliceData.length+oTable1Count);
				that.getView().getModel("localModel").setProperty("/oCount",oTable1Count);
				that.getView().setModel(that.localModel,"localModel");
				that.getView().byId("Table1").setVisibleRowCount(oTable1Count);
				}
				else if(oFirstSpliceData.length - oTable1Count){
					that.localModel.setData(oFirstSpliceData);
						// .splice(0,oFirstSpliceData.length));
					that.getView().getModel("localModel").setProperty("/table1Length",oFirstSpliceData.length);
					that.getView().getModel("localModel").setProperty("/oCount",oFirstSpliceData.length);
					that.getView().setModel(that.localModel,"localModel");
					that.getView().byId("Table1").setVisibleRowCount(oFirstSpliceData.length);
				}				
			}
			
		}
		// oCountLocalModel2
		else if(getId === "oCountLocalModel2"){
			var oTable1Count = that.getView().getModel("localModel2").getProperty("/oCount");
			oTable1Count = oTable1Count + 10;
			if(that.localModel2.getData().length === 10){
				$.merge(that.localModel2.getData(),that.arrayData[1]);

				if(oTable1Count <= that.localModel2.getData().length){
				that.localModel2.setData(that.localModel2.getData().splice(0,oTable1Count));
				that.getView().getModel("localModel2").setProperty("/table1Length",that.arrayData[1].length + 10);
				that.getView().getModel("localModel2").setProperty("/oCount",oTable1Count);
				that.getView().setModel(that.localModel2,"localModel2");
				that.getView().byId("Table3").setVisibleRowCount(oTable1Count);
				}
			}
			else if(that.localModel2.getData().length > 10){
				var oFirstSpliceData = that.localModel2.getData().splice(0,10);
				$.merge(oFirstSpliceData,that.arrayData[1]);

				if(oTable1Count <= oFirstSpliceData.length){
				that.localModel2.setData(oFirstSpliceData.splice(0,oTable1Count));
				that.getView().getModel("localModel2").setProperty("/table1Length",oFirstSpliceData.length+oTable1Count);
				that.getView().getModel("localModel2").setProperty("/oCount",oTable1Count);
				that.getView().setModel(that.localModel2,"localModel2");
				that.getView().byId("Table3").setVisibleRowCount(oTable1Count);
				}
				else if(oFirstSpliceData.length - oTable1Count){
					that.localModel2.setData(oFirstSpliceData);
						// .splice(0,oFirstSpliceData.length));
					that.getView().getModel("localModel2").setProperty("/table1Length",oFirstSpliceData.length);
					that.getView().getModel("localModel2").setProperty("/oCount",oFirstSpliceData.length);
					that.getView().setModel(that.localModel2,"localModel2");
					that.getView().byId("Table3").setVisibleRowCount(oFirstSpliceData.length);
				}				
			}
			
		}
		
		},
		handleValueChange:function(oEvent){
			sap.ui.getCore().fileUploadArr = [];
			var fileData = oEvent.getParameters("items").files[0];
			this.fileDecodingMethod(fileData,"001",fileData);
		},
		fileDecodingMethod: function (uploadedFileData, DocNum,fileData) {
			var that = this;
			var fileMime = uploadedFileData.type;
			var fileName = uploadedFileData.name;
			if (!FileReader.prototype.readAsBinaryString) {
			 FileReader.prototype.readAsBinaryString = function (fileData) {
			  var binary = "";
			  var reader = new FileReader();
			  reader.onload = function (e) {
			   var bytes = new Uint8Array(reader.result);
			   var length = bytes.byteLength;
			   for (var i = 0; i < length; i++) {
				binary += String.fromCharCode(bytes[i]);
			   }
			   that.base64ConversionRes = btoa(binary);
			   sap.ui.getCore().fileUploadArr.push({
				"DocumentType": DocNum,
				"MimeType": fileMime,
				"FileName": fileName,
				"Content": that.base64ConversionRes,
			   });
			  };
			  reader.readAsArrayBuffer(fileData);
			 };
			}
			var reader = new FileReader();
			reader.onload = function (readerEvt) {
			 var binaryString = readerEvt.target.result;
			 that.base64ConversionRes = btoa(binaryString);
			 that.templateUpload(that.base64ConversionRes,fileData);
			//  sap.ui.getCore().fileUploadArr.push({
			//   "DocumentType": DocNum,
			//   "MimeType": fileMime,
			//   "FileName": fileName,
			//   "Content": that.base64ConversionRes
			//  });
				// that.uploadFileData();
			};
			reader.readAsBinaryString(uploadedFileData);
		},
		templateUpload:function(sValue,fileData){
			var url = appModulePath +  "/OData/v4/ideal-retailer-registration/templateCreation";
			// var fileData = oEvent.getParameters("items").files[0];

			var oPayload = 
					{ 
						"templateDetails": [
							{
								"TEMPLATE_ID": 1,
								"TEMPLATE_NAME": fileData.name,
								"TEMPLATE_CONTENT": btoa(sValue),
								"TEMPLATE_MIMETYPE": fileData.type,
								"TEMPLATE_TYPE": fileData.type
								
							}
						],
						"userDetails": {
								"USER_ROLE": "CM",
								"USER_ID": "darshan.l@intellectbizware.com"
						}
					}
			var data = JSON.stringify(oPayload);
			this.postAjaxs(url,"POST",data,"uploadTemplate");
		},

		_import: function (file) {
			that.allowUploadFileArr = [];
			submitBtnActivity = "incompleteUpload";
			var retailerProfileArr = [];
			var retailerBillingAddressArr = [];
			var retailerShipToAddressArr = []
			// var mergeSectionsArr = [];
			var sQueryArr = [];
			var sQueryArr3 = [];
			var sQueryArr2 = [];
			that.table1SpliceData = [];
			that.table2SpliceData = [];

			sap.ui.core.BusyIndicator.show(0);
			jQuery.sap.delayedCall(5000, this, function () {
				that.arrayData = [];
				var excelData = {};
				if (file && window.FileReader) {
					var reader = new FileReader();
					reader.onload = function (e) {
						var data = e.target.result;
						var workbook = XLSX.read(data, {
							type: 'binary'
						});
						workbook.SheetNames.forEach(function (sheetName) {
							// Here is your object for every sheet in workbook
							excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
							that.arrayData.push(excelData);							
						});
					var checkDuplicateRetailerProfile = that.retailerDupCheck(that.arrayData[0]);
					var checkDuplicateRetailerAddress = that.retailerAddressDupCheck(that.arrayData[1]);
					var validateRetailerProfile = validation.validateProfileDetails(that.arrayData[0],[]);
					var validateRetailerAddress = validation.validateProfileAddress(that.arrayData[1],[])
					
					// if(check)

					if(that.arrayData[0].length === 0 && that.arrayData[1].length === 0){
						that.allowUploadFileArr = validation.uploadFileVal(that.arrayData[0],that,arrayData[1],[]);
					}
					else if(that.arrayData[0].length > 0 && that.arrayData[1].length === 0){
						that.allowUploadFileArr = validation.uploadFileVal(that.arrayData[0],that,arrayData[1],[]);
						if(checkDuplicateRetailerProfile.length >0){
							$.merge(that.allowUploadFileArr,checkDuplicateRetailerProfile);
						}
						if(validateRetailerProfile.length >0){
							$.merge(that.allowUploadFileArr,validateRetailerProfile);
						}
					}
					else if(that.arrayData[0].length === 0 && that.arrayData[1].length > 0){
						that.allowUploadFileArr = validation.uploadFileVal(that.arrayData[0],that,arrayData[1],[]);
						if(checkDuplicateRetailerAddress.length >0){
							$.merge(that.allowUploadFileArr,checkDuplicateRetailerAddress);
						}
						if(validateRetailerAddress.length >0){
							$.merge(that.allowUploadFileArr,validateRetailerAddress);
						}
					}
					else if(that.arrayData[0].length > 0 && that.arrayData[1].length > 0){

						for(var i=0;i<that.arrayData[0].length;i++){
							var billingAddressCheck = that.arrayData[1].filter(function (a) {
								
								// if(that.arrayData[0][i]["DISTRIBUTOR ID"] === a["DISTRIBUTOR ID"] && 
								if(that.arrayData[0][i]["RETAILER ID"]=== a["RETAILER ID"] &&
								a["ADDRESS TYPE"].split("-")[1] === "BILLING ADDRESS"){
									return a;
								}
							   
							}, Object.create(null));

							if(billingAddressCheck.length ===0){
								sQueryArr.push(that.arrayData[0][i]);
							}

							var shipToAddressCheck = that.arrayData[1].filter(function (a) {
                    
								// if(that.arrayData[0][i]["DISTRIBUTOR ID"] === a["DISTRIBUTOR ID"] && 
								if(that.arrayData[0][i]["RETAILER ID"]=== a["RETAILER ID"] &&
								a["ADDRESS TYPE"].split("-")[1] === "SHIP TO ADDRESS"){
									return a;
								}
							   
							}, Object.create(null));

							if(shipToAddressCheck.length ===0){
								sQueryArr3.push(that.arrayData[0][i]);
							}
						}
						retailerBillingAddressArr = validation.retailerAddressVal(sQueryArr,[],"BL_ADDR");
						retailerShipToAddressArr = validation.retailerAddressVal(sQueryArr3,[],"SHP_ADDR");
						

						for(var i=0;i<that.arrayData[1].length;i++){
							var result2 = that.arrayData[0].filter(function (a) {
                    
								// if(that.arrayData[1][i]["DISTRIBUTOR ID"] === a["DISTRIBUTOR ID"] && 
								if(that.arrayData[1][i]["RETAILER ID"]=== a["RETAILER ID"]){
									return a;
								}
								if(that.arrayData[1][i]["EMAIL ID"] !== undefined){
									that.arrayData[1][i]["EMAIL ID"] = that.arrayData[1][i]["EMAIL ID"].toLowerCase();
								}
							   
							}, Object.create(null));

							if(result2.length ===0){
								sQueryArr2.push(that.arrayData[1][i]);
							}
						}

						retailerProfileArr = validation.retailerProfileVal(sQueryArr2,[]);

						if(retailerProfileArr.length >0 || retailerBillingAddressArr.length>0 ||
							checkDuplicateRetailerProfile.length>0 || checkDuplicateRetailerAddress.length>0 ||
							validateRetailerProfile.length>0 || validateRetailerAddress.length>0 ||
							retailerShipToAddressArr.length > 0){

							$.merge(retailerProfileArr,retailerBillingAddressArr);

							if(retailerShipToAddressArr.length>0){
								$.merge(retailerProfileArr,retailerShipToAddressArr);
							}
							if(checkDuplicateRetailerProfile.length >0){
								$.merge(retailerProfileArr,checkDuplicateRetailerProfile);
							}
							if(checkDuplicateRetailerAddress.length >0){
								$.merge(retailerProfileArr,checkDuplicateRetailerAddress);
							}
							if(validateRetailerProfile.length >0){
								$.merge(retailerProfileArr,validateRetailerProfile);
							}
							if(validateRetailerAddress.length >0){
								$.merge(retailerProfileArr,validateRetailerAddress);
							}
							
							that.allowUploadFileArr = retailerProfileArr;
						}
						// that.validateForm(that.allowUploadFileArr);
						// call messagepopover
					}
					// Issues Cleared
					if(that.allowUploadFileArr.length === 0){
						
						// that.getView().byId("submitId").setEnabled(true);
						if(that.arrayData[0].length > 10){
							that.getView().byId("oCountLocalModel").setVisible(true);
						}
						if(that.arrayData[1].length > 10){
							that.getView().byId("oCountLocalModel2").setVisible(true);
						}
						
						// Table 1

						that.localModel = new JSONModel();
						that.localModel.setData(that.arrayData[0].splice(0,10));
						$.merge(that.table1SpliceData,that.localModel.getData());
						that.getView().setModel(that.localModel,"localModel");

						if(that.arrayData[0].length === 0){
							that.getView().getModel("localModel").setProperty("/items",that.localModel.getData());
							that.getView().byId("Table1").setVisibleRowCount(that.localModel.getData().length);
						}
						else if(that.arrayData[0].length > 0){
								that.getView().getModel("localModel").setProperty("/items",$.merge(that.table1SpliceData,that.arrayData[0]));
								that.getView().byId("Table1").setVisibleRowCount(10);
						}
						that.getView().getModel("localModel").setProperty("/oCount",10);
						that.getView().getModel("localModel").setProperty("/table1Length",that.arrayData[0].length + that.localModel.getData().length);
						
						// Table 3
						that.localModel2 = new JSONModel();
						that.localModel2.setData(that.arrayData[1].splice(0,10));
						$.merge(that.table2SpliceData,that.localModel2.getData());
						that.getView().setModel(that.localModel2,"localModel2");

						if(that.arrayData[1].length === 0){
							that.getView().getModel("localModel2").setProperty("/items",that.localModel2.getData());
							that.getView().byId("Table3").setVisibleRowCount(that.localModel2.getData().length);
						}
						else if(that.arrayData[1].length > 0){
								that.getView().getModel("localModel2").setProperty("/items",$.merge(that.table2SpliceData,that.arrayData[1]));
								that.getView().byId("Table3").setVisibleRowCount(10);
						}

						that.getView().getModel("localModel2").setProperty("/oCount",10);
						that.getView().getModel("localModel2").setProperty("/table1Length",that.arrayData[1].length + that.localModel2.getData().length);
						
						MessageBox.success("The data has been verified successfully, you can proceed for submission");

						that.localModel.refresh(true);
						that.localModel2.refresh(true);
					}
					else{
						that.validateForm(that.allowUploadFileArr);
					}
					// validation loop end
					};
					reader.onerror = function (ex) {
						sap.ui.core.BusyIndicator.hide();
						console.log(ex);
					};
					reader.readAsBinaryString(file);
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},
		retailerDupCheck:function(sValue){
			var dupRetailerProfileArr = [];
			var result1 = sValue.filter(function (a) {
				var key = distributorId + '|' + a["RETAILER ID"];
				if (!this[key]) {
					this[key] = true;
					return true;
				}
				else{
					dupRetailerProfileArr.push({
						"section": 2,
						"description": "The duplicate retailer profile data has been found of retailer ID "+a["RETAILER ID"]+".",
						"subtitle": "Duplicate Field",
						"type": "Warning",
						"subsection":"Retailer Profile"
					});
					// dupRetailerProfileArr.push("The duplicate retailer profile data has been found of retailer ID "+a["RETAILER ID"]+".");
				}
			}, Object.create(null));
			return dupRetailerProfileArr;
		},
		retailerAddressDupCheck:function(sValue){
			debugger
			var dupRetailerAddressArr = [];
			var result1 = sValue.filter(function (a) {
				if(a["ADDRESS TYPE"].split("-")[1] === "BILLING ADDRESS"){
					var key = distributorId + '|' + a["RETAILER ID"]+'|'+a["ADDRESS TYPE"].split("-")[1];
					if (!this[key]) {
						this[key] = true;
						return true;
					}
					else{
						dupRetailerAddressArr.push({
							"section": 2,
							"description": "The duplicate billing address has been found for retailer ID "+a["RETAILER ID"]+".",
							"subtitle": "Duplicate Field",
							"type": "Warning",
							"subsection":"Retailer Address"
						});
						// dupRetailerAddressArr.push("The duplicate billing address has been found for retailer ID "+a["RETAILER ID"]+".");
					}
				}
			}, Object.create(null));
			return dupRetailerAddressArr;
		},		
		onRefresh: function () {
			that.localModel.setData(null);
			that.localModel2.setData(null);

			that.getView().byId("messagePopoverBtn").setVisible(false);
			
			that.getView().byId("Table1").setVisibleRowCount(0);
			that.getView().byId("Table3").setVisibleRowCount(0);
			// that.getView().byId("Table4").setVisibleRowCount(0);
			// that.getView().byId("Table5").setVisibleRowCount(0);

			this.getView().byId("oCountLocalModel").setVisible(false);
			this.getView().byId("oCountLocalModel2").setVisible(false);
			// this.getView().byId("oCountLocalModel3").setVisible(false);
            // this.getView().byId("oCountLocalModel4").setVisible(false);

			//Komal 16.08.2022
			// that.getView().byId("rbg4").setSelectedIndex(-1);
		},

		handleMessagePopoverPress: function (oEvent) {
			if (!this.oMP) {
				this.createMessagePopover();
			}
			this.oMP.toggle(oEvent.getSource());
		},

		createMessagePopover: function () {
			this.oMP = new MessagePopover({
				activeTitlePress: function (oEvent) {
					var oItem = oEvent.getParameter("item").getProperty("key");
					that.getView().byId("iconTabBar").setSelectedKey(oItem);
				},
				items: {
					path: "message>/",
					template: new MessageItem({
						title: "{message>description}",
						activeTitle: true,
						subtitle: "{message>subtitle}",
						type: "{message>type}",
						key: "{message>key}"
					})
				},
				groupItems: true
			});
			this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
		},

		onTemplateDownload: function (oEvent) {
			var url = appModulePath + "/OData/v4/ideal-retailer-registration/TemplateAttachments(1)/$value"  //26 - previous
			var context = this;

			$.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    // data: data,
                    success: function (Data, response) {
					if (Data !== undefined) {
						// Data = atob(Data);
						context.downloadAttachment(Data, "Retailer Onboarding Template.xlsx","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
					} else {
						MessageBox.error("Template not found please contact Admin");
					}

				},
				error: function (error) {
					// var oXML = JSON.parse(error.responseText);
					// var oXMLMsg = oXML.error["message"];
					var oXML,oXMLMsg;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"];
					} else {
						oXMLMsg = error.responseText
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},

		onDownload: function (oEvent) {
			var context = this;
			var attachObj;
			var attachModel = oEvent.getSource().mBindingInfos.enabled.parts[0].model;
			attachObj = oEvent.getSource().getBindingContext(attachModel).getObject();
			context.downloadAttachment(attachObj.FILE_CONTENT, attachObj.FILE_NAME, attachObj.FILE_MIMETYPE);

		},

		downloadAttachment: function (content, fileName, mimeType) {
			// "data:application/octet-stream;base64," + 
			download("data:application/octet-stream;base64," +content, fileName, mimeType);
			var HttpRequest = new XMLHttpRequest();
			// x.open("GET", "http://danml.com/wave2.gif", true);
			HttpRequest.responseType = 'blob';
			HttpRequest.onload = function (e) {
				download(HttpRequest.response, fileName, mimeType);
			};
			HttpRequest.send();
		},

    onSubmitData:function(){
		var addressFetchArr = [];
        var retailerData = that.localModel.getData();
        var addressDetails = that.localModel2.getData();

		if(submitBtnActivity === "null" || addressDetails === null){
			MessageBox.information("Please upload the retailer details and then submit");
		}
		else{
			if(that.allowUploadFileArr.length === 0){
				for(var i=0;i<retailerData.length;i++){

					var result = addressDetails.filter(function (a) {
						
						// if(retailerData[i]["DISTRIBUTOR ID"] === a["DISTRIBUTOR ID"] && 
						if(retailerData[i]["RETAILER ID"]=== a["RETAILER ID"]){
							return a;
						}
					
					}, Object.create(null));
					$.merge(addressFetchArr,result);
				}
				if(addressFetchArr.length > 0){
					that.getView().byId("messagePopoverBtn").setVisible(false);
					var getRetailerProfileData = that.retailerProfilePayload(retailerData);
					var getRetailerAddressData = that.retailerAddressPayload(addressDetails);
					
					
					MessageBox.confirm("Do you want to save ?", {
						
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						// initialFocus: sap.m.MessageBox.Action.CANCEL,
						onClose: function (oAction) {
							if (oAction === 'YES') {
								BusyIndicator.show(0);
								that.onSubmitRetailer(getRetailerProfileData,getRetailerAddressData);
							} else {
								// Do something
							}

						}
					});
				}
			}
			else{
				that.validateForm(that.allowUploadFileArr);
			}
		}
    },
	retailerProfilePayload:function(retailerData){
		var chngDate = new Date().toISOString().split("T")[0];
		var retailerPayloadDataArr = [];
		for(var i=0;i<retailerData.length;i++){
			var retailerDataObj ={
		        "DISTRIBUTOR_ID": distributorId || null,
				// retailerData[i]["DISTRIBUTOR ID"] || null,
                "RETAILER_ID":retailerData[i]["RETAILER ID"] || null,
                "NAME_OF_BANK": retailerData[i]["BANK NAME"] || null,
                "BANK_ACC_NO": retailerData[i]["ACCOUNT NUMBER"] || null,
                "IFSC_CODE": retailerData[i]["IFSC CODE"] || null,
                "UPI_ID": retailerData[i]["UPI ID"] || null,
                "REGISTERED_TAX_ID":retailerData[i]["REGISTERED TAX ID"] || null,
                "PAN_NO": retailerData[i]["PAN NO"] || null,
                // "VAT_NO": retailerData[i]["VAT NO"] || null,
                "RETAILER_NAME" : retailerData[i]["RETAILER NAME"] || null,
                    // retailerData[i]["RETAILER NAME"],
                "RETAILER_TYPE": Number(retailerData[i]["RETAILER TYPE"].split(".")[0]) || null,
                    // retailerData[i]["RETAILER TYPE"],
                "BLOCKED": "N",
                "CHANGE_DATE": chngDate,
                        // "2024-02-12",
                "RETAILER_CLASS": retailerData[i]["RETAILER CLASSIFICATION"] || null,
                "PAY_TERM": Number(retailerData[i]["PAYMENT TERMS"]) || null,
                "FIELD_1": "",
                "FIELD_2": "",
                "FIELD_3": "",
                "FIELD_4": "",
                "FIELD_5": ""
			}
			retailerPayloadDataArr.push(retailerDataObj);
		}
		return retailerPayloadDataArr;
	},
	retailerAddressPayload:function(retailerAddressData){
		var retailerAddressDataArr = [];
		for(var i=0;i<retailerAddressData.length;i++){
			var addressDataObj = {
				"DISTRIBUTOR_ID": distributorId || null,
				"RETAILER_ID": retailerAddressData[i]["RETAILER ID"] || null,
				"SR_NO": 1,
				"ADDRESS_TYPE": retailerAddressData[i]["ADDRESS TYPE"].split("-")[0] || null,
				"MOBILE_NO": retailerAddressData[i]["MOBILE NO"] || null,
				"TELEPHONE_NO": retailerAddressData[i]["TELEPHONE NO"] || null,
				"EMAIL_ID": retailerAddressData[i]["EMAIL ID"].toLowerCase() || null,
				"FAX_NO": retailerAddressData[i]["FAX NO"] || null,
				"CONTACT_PERSON": retailerAddressData[i]["CONTACT PERSON"] || null,
				"STREET_NO": retailerAddressData[i]["STREET NO"] || null,
				"ADDRESS_LINE_1": retailerAddressData[i]["ADDRESS LINE 1"] || null,
				"ADDRESS_LINE_2": retailerAddressData[i]["ADDRESS LINE 2"] || null,
				"ADDRESS_LINE_3": retailerAddressData[i]["ADDRESS LINE 2"] || null,
				"COUNTRY": retailerAddressData[i]["COUNTRY"] || null,
				"REGION": retailerAddressData[i]["REGION"] || null,
				"CITY": retailerAddressData[i]["CITY"] || null,
				"POSTAL_CODE": retailerAddressData[i]["POSTAL CODE"] || null
			}	
			retailerAddressDataArr.push(addressDataObj)
		}
		return retailerAddressDataArr
	},
    onSubmitRetailer:function(getRetailerProfileData,getRetailerAddressData){
        var createRetailer =
                {
                    "Action": "CREATECSV",
                    "retailerDetails": getRetailerProfileData,
                    "retailerAddress" : getRetailerAddressData,
                    "retailerAttachments": [],
					"userDetails": {
							"USER_ROLE": "CM",
							"USER_ID": "darshan.l@intellectbizware.com"
					}
                }
                var url = appModulePath+"/OData/v4/ideal-retailer-registration/registerRetailer";
                var data = JSON.stringify(createRetailer);
                this.postAjaxs(url,"POST",data,"postRetailerInfo");
        },
        postAjaxs: function (url, type, data, model) {
            
            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: data,
                success: function (data, response) {
					BusyIndicator.hide();
					MessageBox.success(data.value, {
						actions: [MessageBox.Action.OK],
						onClose: function (oAction) {
							if (oAction === "OK") {
								context.onBack();
							}
						}
					});
                    // MessageBox.success(data.value);
                },
                error: function (error) {
                    BusyIndicator.hide();
                    var oXMLMsg, oXML;
                    if (context.isValidJsonString(error.responseText)) {
                        oXML = JSON.parse(error.responseText);
						if(oXML.error['code'] === "301"){
							that.dupRegisteredTaxId(oXML.error['message']);
						}
						else{
                        	oXMLMsg = oXML.error.message;
							MessageBox.error(oXMLMsg);
						}
                    } else {
                        oXMLMsg = error.responseText;
						MessageBox.error(oXMLMsg);
                    }
                }
            });
        },
		dupRegisteredTaxId:function(sValue){
			var dupRegTaxId = sValue.split(",");
			var dupRegisteredTaxIdArr = [];
			for(var i=0;i<dupRegTaxId.length;i++){
				dupRegisteredTaxIdArr.push({
					"section": 2,
					"description": "The Registered Tax ID " + dupRegTaxId[i] + " is already exists.",
					"subtitle": "Duplicate Field",
					"type": "Warning",
					"subsection":"Retailer Profile"
				});
			}
			this.validateForm(dupRegisteredTaxIdArr);
		},
		isValidJsonString: function (sDataString) {
			var value = null;
			var oArrObj = null;
			var sErrorMessage = "";
			try {
				if (sDataString === null || sDataString === "" || sDataString === undefined) {
					throw "No data found.";
				}

				value = JSON.parse(sDataString);
				if (toString.call(value) === '[object Object]' && Object.keys(value).length > 0) {
					return true;
				} else {
					throw "Error";
				}
			} catch (errorMsg) {
				if (errorMsg === "No data found.") {
					sErrorMessage = errorMsg;
				} else {
					sErrorMessage = "Invalid JSON data."
				}
				return false;
			}
			return true;
		},
		onBack:function(){
			BusyIndicator.show(0);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteMasterpage");
		},
		validateForm: function (checkFields) {
			if(this.oMP){
				this.oMP.close();
			}

			if (checkFields.length > 0) {
				var checkFieldsJson = new JSONModel();
				checkFieldsJson.setData(checkFields);
				oView.setModel(checkFieldsJson, "message");
				var oButton = this.getView().byId("messagePopoverBtn");
				oButton.setVisible(true);
				setTimeout(function () {
					this.oMP.openBy(oButton);
				}.bind(this), 50);
				this.createMessagePopover();

			} else {
				this.getView().byId("messagePopoverBtn").setVisible(false);
			}
		},

	});

});