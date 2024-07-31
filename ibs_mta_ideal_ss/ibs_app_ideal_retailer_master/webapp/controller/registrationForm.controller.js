// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealretailermaster.controller.registrationForm", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/ibs/ibsappidealretailermaster/model/validation",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
],

    function (Controller,JSONModel,validation,MessageBox,BusyIndicator,MessagePopover,MessageItem,Filter,
        FilterOperator) {
        "use strict";
        var submitBtnVisibleArr,retailerDataModel,appModulePath,that,context,oView,blankJsonModel,visibleRowCountArr;

        return Controller.extend("com.ibs.ibsappidealretailermaster.controller.registrationForm", {
            onInit: function (oEvent) {
                that = this;
                context = this;
                visibleRowCountArr = [];
                submitBtnVisibleArr = [];
                oView = context.getView();
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteregistrationForm").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched:function(){
                var getHeaderData = this.getOwnerComponent().getModel("nullRegAddressData").getProperty("/HeaderData/0/");
                
                blankJsonModel = new JSONModel(getHeaderData);
                oView.setModel(blankJsonModel, "blankJson");

                that.nullAddressProp = Object.assign({},this.getOwnerComponent().getModel("nullRegAddressData").getProperty("/retailerAddress/0"));  
                var getRetailerSampleData = this.getOwnerComponent().getModel("nullRegAddressData").getProperty("/retailerSampleAddress");
                
                oView.getModel("blankJson").setProperty("/retailerAddress",getRetailerSampleData);
                oView.getModel("blankJson").setProperty("/retailerAddressDataLength",getRetailerSampleData);
                oView.byId("trAddId").setVisibleRowCount(getRetailerSampleData.length);
                visibleRowCountArr = getRetailerSampleData;
                
                this.readCountrySet();
                this.readRetailerType();
                this.readAddressType();
            },
            readCountrySet:function(){
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/CountryMaster";
                this.postAjaxs(url,"GET","null","countryDataModel");
            },
            readAddressType:function(){
                debugger
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/AddressTypeMaster";
                this.postAjaxs(url,"GET","null","addreessTypeModel");
            },
            readRegionMaster:function(sValue){
                debugger
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RegionMaster?$filter=LAND1 eq '"+ sValue +"'";
                this.postAjaxs(url,"GET","null","regionMasterDataModel");
            },
            readRetailerType:function(){
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerTypeMaster";
                this.postAjaxs(url,"GET","null","RetailerTypeMaster");
            },
            readCityMaster:function(sValue){
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/CityMaster?$filter=REGION_CODE eq '"+ sValue +"'";
                this.postAjaxs(url,"GET","null","CityMasterModel");
            },
            _validateEmail:function(oEvent){
                var emailInpId = oEvent.getSource().getId();
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                selectedObj[index].EMAIL_ID = oValue;
                var emailVal = validation._validateEmail(oEvent);
                this.commonValidation(oValue,emailInpId,emailVal);
            },

            // Header Profile Fields

            handleRetailerName:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.RETAILER_NAME = oValue;
                var nameId = oEvent.getSource().getId();
                var nameVal = validation._charactersValidation(oEvent);
                this.commonValidation(oValue,nameId,nameVal);
            },
            handleRetailerType:function(oEvent){
                debugger
                var oValue = oEvent.getSource().getSelectedKey();
                var retailerTypeId = oEvent.getSource().getId();
                var oSelectedItem = oEvent.getSource().getSelectedItem();
                oEvent.getSource().setValueState("None");

                // if(oSelectedItem === null){
                //     oValue = oEvent.getSource().getLastValue();
                //     this.getView().byId("idRetailderType").setSelectedKey(oValue);
                // }
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.RETAILER_TYPE = oValue;
                this.commonValidation(oValue,retailerTypeId,"null");
            },
            handleRetailerClass:function(oEvent){
                var oValue = oEvent.getSource().getSelectedKey();
                var oSelectedItem = oEvent.getSource().getSelectedItem();
                oEvent.getSource().setValueState("None");

                // if(oSelectedItem === null){
                //     oValue = oEvent.getSource().getLastValue();
                //     this.getView().byId("idRetailserClass").setSelectedKey(oValue);
                // }
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.RETAILER_CLASS = oValue;
                var retailerClassId = oEvent.getSource().getId();
                this.commonValidation(oValue,retailerClassId,"null");
            },
            handlePaymentTerms:function(oEvent){
                var oValue = oEvent.getSource().getSelectedKey();
                var oSelectedItem = oEvent.getSource().getSelectedItem();
                oEvent.getSource().setValueState("None");

                // if(oSelectedItem === null){
                //     oValue = oEvent.getSource().getLastValue();
                //     this.getView().byId("idPaymentTerms").setSelectedKey(oValue);
                // }
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.PAY_TERM = oValue;
                var paymentTermsId = oEvent.getSource().getId();
                this.commonValidation(oValue,paymentTermsId,"null");
            },
            handleNameOfBank:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getData();
                oEvent.getSource().setValueState("None");
                selectedObj.NAME_OF_BANK = oValue;
                var nameOfBankId = oEvent.getSource().getId();
                this.commonValidation(oValue,nameOfBankId,"null");
            },
            _validateAccountNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.BANK_ACC_NO = oValue;
                var accountNoId = oEvent.getSource().getId();
                var accountNoVal = validation._validateAccountNumber(oEvent);
                this.commonValidation(oValue,accountNoId,accountNoVal);
            },
            _validateIfscCode :function(oEvent){
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.IFSC_CODE = oValue;

                var ifscCodeId = oEvent.getSource().getId();
                var ifscCodeVal = validation._ifscValidation(oEvent);
                this.commonValidation(oValue,ifscCodeId,ifscCodeVal);
            },
            handleUpi:function(oEvent){
                var upiId = oEvent.getSource().getId();
                var oValue = oEvent.getSource().getValue();
                oEvent.getSource().setValueState("None");
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.UPI_ID = oValue;
                var upiVal = validation.validateUpi(oEvent);
                this.commonValidation(oValue,upiId,upiVal);
            },
            _validateGstNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.REGISTERED_TAX_ID = oValue;
                var gstNoId = oEvent.getSource().getId();
                if(Number(oValue) === 0){
                    oEvent.getSource().setValue("");
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid GSTN/Vat No");
                }
                else{
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.None)
                }
                // var gstNoVal = validation._gstValidation(oEvent);

                this.commonValidation(oValue,gstNoId,"null");
            },
            _validatePanNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.PAN_NO = oValue;
                var panNoId = oEvent.getSource().getId();
                var panNoVal = validation._panNoValidation(oEvent);
                this.commonValidation(oValue,panNoId,panNoVal);
            },
            _validateVatNo : function(oEvent){
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getData();
                selectedObj.VAT_NO = oValue;
                var vatNoId = oEvent.getSource().getId();
                var vatNoVal = validation.VATRegNumValidation(oEvent);
                this.commonValidation(oValue,vatNoId,vatNoVal);
            },

            // Table Fields

            handleStreetNo:function(oEvent){
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                selectedObj[index].STREET_NO = oValue;
            },
            handleAddressLine1:function(oEvent){
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                selectedObj[index].ADDRESS_LINE_1 = oValue;
            },
            handleAddressLine2:function(oEvent){
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                selectedObj[index].ADDRESS_LINE_2 = oValue;
            },
            handleAddressLine3:function(oEvent){
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                selectedObj[index].ADDRESS_LINE_3 = oValue;
            },
            handleCountryDialog: function (oEvent) {
                debugger
                this.selectedRowCountry = oEvent.getSource();
                that.countryIndex = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                that.countryPath = oEvent.getSource().getBindingContext("blankJson").getPath();
                if (!this.countryDialog) {
                    this.countryDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealretailermaster.view.Fragments.countryDialog", this);
                    this.getView().addDependent(this.countryDialog);
                }
    
                this.countryDialog.open();
                if(sap.ui.getCore().byId("cntry_listId").getBinding("items") !== undefined){
                    sap.ui.getCore().byId("cntry_listId").getBinding("items").filter();
                }
            },
            handleCountrySelection :function(oEvent){
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");

                var countryCode = oEvent.getSource().getSelectedItem().getBindingContext("countryDataModel").getObject().LAND1;
                var countyDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryDataModel").getObject().LANDX;
                selectedObj[that.countryIndex].COUNTRY = countryCode;
                selectedObj[that.countryIndex].COUNTRY_DESC = countyDesc;
                selectedObj[that.countryIndex].CITY_DESC = "";
                selectedObj[that.countryIndex].REGION_DESC = "";
                this.getView().getModel("blankJson").setProperty(that.countryPath+"/COUNTRY_DESC",countyDesc);
                this.selectedRowCountry.setValueState("None");
                oEvent.getSource().removeSelections();
                this.closeCountryDialog();
            },
            handleCountrySearch: function (oEvent) {
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];

                var oFilter = new Filter();
                if (sQuery) {
                    oFilter = new Filter([
                        new Filter("LANDX", sap.ui.model.FilterOperator.Contains, sQuery),
                        new Filter("LAND1", sap.ui.model.FilterOperator.Contains, sQuery)
                    ], false);
                }
                pFilter.push(oFilter);
                var listItem = sap.ui.getCore().byId("cntry_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            closeCountryDialog:function(){
                sap.ui.getCore().byId("countrySrchId").setValue("");
                this.countryDialog.close();
            },
            handleRegionDialog: function (oEvent) {
                debugger
                this.selectedRowRegion = oEvent.getSource();
                that.regionIndex = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                that.regionPath = oEvent.getSource().getBindingContext("blankJson").getPath();
                var country = this.getView().getModel("blankJson").getProperty("/retailerAddress")[that.regionIndex].COUNTRY;

                if(country !== null || country !== ""){
                    this.readRegionMaster(country);
                }

                if (country === null || country === "") {
                    oEvent.getSource().getParent().getCells()[5].setValueState("Error");
                    oEvent.getSource().getParent().getCells()[5].setValueStateText("Please Select Country");
                    // MessageBox.information("Please Select Country");
                    // return;
                }
                else{
                    if (!this.regionDialog) {
                        this.regionDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealretailermaster.view.Fragments.regionDialog", this);
                        this.getView().addDependent(this.regionDialog);
                    }
                    jQuery.sap.delayedCall(100, this, function () {
                        this.regionDialog.open();
                        if(sap.ui.getCore().byId("region_listId").getBinding("items") !== undefined){
                            sap.ui.getCore().byId("region_listId").getBinding("items").filter();
                        }
                    });  
                }  
            },
            handleRegionSearch: function (oEvent) {
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                var oFilter = new Filter();
                
                 if (sQuery) {
                        oFilter = new Filter([
                            new Filter("BEZEI", sap.ui.model.FilterOperator.Contains, sQuery),
                            new Filter("BLAND", sap.ui.model.FilterOperator.Contains, sQuery)
                        ], false);
                }
                pFilter.push(oFilter);
                var listItem = sap.ui.getCore().byId("region_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            handleRegion:function(oEvent){
                debugger
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");

                var regionCode = oEvent.getSource().getSelectedItem().getBindingContext("regionMasterDataModel").getObject().BLAND;
                var regionDesc = oEvent.getSource().getSelectedItem().getBindingContext("regionMasterDataModel").getObject().BEZEI;
                selectedObj[that.regionIndex].REGION = regionCode;
                selectedObj[that.regionIndex].REGION_DESC = regionDesc;
                selectedObj[that.regionIndex].CITY_DESC = "";
                this.getView().getModel("blankJson").setProperty(that.regionPath+"/REGION_DESC",regionDesc);
                this.selectedRowRegion.setValueState("None");
                this.closeRegionDialog();
                oEvent.getSource().removeSelections();
            },
            closeRegionDialog:function(){
                sap.ui.getCore().byId("regionSrchId").setValue("");
                this.regionDialog.close();
            },        
            handleCityDialog:function(oEvent){
                this.selectedRowCity = oEvent.getSource();
                that.cityIndex = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                that.cityPath = oEvent.getSource().getBindingContext("blankJson").getPath();
                
                var region = this.getView().getModel("blankJson").getProperty("/retailerAddress")[that.cityIndex].REGION;

                if(region !== null || region !== ""){
                    this.readCityMaster(region);
                }

                if (region === null || region === "") {
                    // MessageBox.information("Please Select REGION");
                    // return;
                    oEvent.getSource().getParent().getCells()[6].setValueState("Error");
                    oEvent.getSource().getParent().getCells()[6].setValueStateText("Please Select Region");
                }
                else{
                    if (!this.cityDialog) {
                        this.cityDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealretailermaster.view.Fragments.cityDialog", this);
                        this.getView().addDependent(this.cityDialog);
                    }
                    this.cityDialog.open();
                    if(sap.ui.getCore().byId("city_listId").getBinding("items") !== undefined){
                        sap.ui.getCore().byId("city_listId").getBinding("items").filter();
                    }
                }
            },
            handleCitySearch:function(oEvent){
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                var oFilter = new Filter();
                if (sQuery) {
                    oFilter = new Filter([
                        new Filter("CITY_DESC", sap.ui.model.FilterOperator.Contains, sQuery),
                        new Filter("CITY_CODE", sap.ui.model.FilterOperator.Contains, sQuery)
                    ], false);
                }
                pFilter.push(oFilter);
                var listItem = sap.ui.getCore().byId("city_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            handleCity:function(oEvent){
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");

                var cityCode = oEvent.getSource().getSelectedItem().getBindingContext("CityMasterModel").getObject().CITY_CODE;
                var cityDesc = oEvent.getSource().getSelectedItem().getBindingContext("CityMasterModel").getObject().CITY_DESC;
                selectedObj[that.cityIndex].CITY = cityCode;
                selectedObj[that.cityIndex].CITY_DESC = cityDesc;
                this.getView().getModel("blankJson").setProperty(that.cityPath+"/CITY_DESC",cityDesc);
                this.selectedRowCity.setValueState("None");
                this.closeCityDialog();
                oEvent.getSource().removeSelections();
            },
            closeCityDialog:function(oEvent){
                sap.ui.getCore().byId("citySrchId").setValue("");
                this.cityDialog.close();
            },
            handleAddressType:function(oEvent){
                var isBillingAddressAvl =true;
                var addressTypeVal = oEvent.getSource().getSelectedKey();
                var retailerAddressData = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                var sPath = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);

                retailerAddressData[sPath].ADDRESS_TYPE = addressTypeVal;

                if(retailerAddressData.length > 1){
                    for(var i=0;i<retailerAddressData.length;i++){
                        // isBillingAddressAvl = retailerAddressData.filter(function (a,index) {
                        if(i !== sPath && retailerAddressData[i].ADDRESS_TYPE === addressTypeVal && 
                            retailerAddressData[i].ADDRESS_TYPE === "BL_ADDR"){
                            // if(retailerAddressData[i].ADDRESS_TYPE === "BL_ADDR"){
                                isBillingAddressAvl = false;
                            // }     
                        }                
                            // }, Object.create(null));
                        }
                    // }
                }

                if(isBillingAddressAvl === false){
                    MessageBox.error("Billing address can be added only once.");
                    var sObject = oEvent.getSource().getBindingContext("blankJson").getModel().getProperty("/retailerAddress");
                    sObject[sPath].ADDRESS_TYPE = null;
                    oEvent.getSource().setSelectedKey(null);
                    oView.getModel("blankJson").refresh(true);
                }
            },
            _validateFaxNo:function(oEvent){
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                selectedObj[index].FAX_NO = oValue;
                var faxNoId = oEvent.getSource().getId();
                var valFaxNoVal = validation._numberValidation(oEvent,"faxNoValidation");

                if((oValue.length < 10 && valFaxNoVal === true)){
                    valFaxNoVal = false;
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter minumum 10 digit of fax number.");
                    oEvent.getSource().setValue("");
                }
                else if(Number(oValue) === 0){
                    valFaxNoVal = false;
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid fax number.");
                    oEvent.getSource().setValue("");
                }
                this.commonValidation(oValue,faxNoId,valFaxNoVal);
            },
            contOfPersonVal:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                var countOfPersonId = oEvent.getSource().getId();
                var contOfPersonVal = validation._charactersValidation(oEvent);
                selectedObj[index].CONTACT_PERSON = oValue;
                this.commonValidation(oValue,countOfPersonId,contOfPersonVal);
            },
            _validateTelephoneNo:function(oEvent){
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                var valTelephoneNoId = oEvent.getSource().getId();
                selectedObj[index].TELEPHONE_NO = oValue;
                var valTelephoneNo = validation._numberValidation(oEvent,"TelephoneNoVal");
                this.commonValidation(oValue,valTelephoneNoId,valTelephoneNo);
            },
            _validateContactPerson:function(oEvent){
                var contactPersonId = oEvent.getSource().getId();
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                selectedObj[index].CONTACT_PERSON = oValue;
                var contactPersonValidation = validation._charactersValidation(oEvent);
                this.commonValidation(oValue,contactPersonId,contactPersonValidation);
            },
            _postalCodeVal:function(oEvent){
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                selectedObj[index].POSTAL_CODE = oValue;
                var postalCodeId = oEvent.getSource().getId();
                var postalCodeValidation = validation.postalCodeValidation(oEvent);
                this.commonValidation(oValue,postalCodeId,postalCodeValidation);
            },
           
            _validateMobileNo:function(oEvent){
                var index = Number(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]);
                var oValue = oEvent.getSource().getValue();
                var selectedObj = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                selectedObj[index].MOBILE_NO = oValue;
                var mobNoId = oEvent.getSource().getId();
                var valMobNo = validation._validateMobileNum(oEvent,"onChange");
                this.commonValidation(oValue,mobNoId,valMobNo);
            },

            commonValidation:function(fieldValue,fieldId,fieldVal){
                // var fieldValue = oEvent.getSource().getValue();

                if(fieldVal === "null"){
                
                    if(submitBtnVisibleArr.includes(fieldId) === false){
                        submitBtnVisibleArr.push(fieldId);
                    }
                    else if(fieldValue === ""){
                        submitBtnVisibleArr.filter(function (a,index) {
                            if(a === fieldId){
                                submitBtnVisibleArr.splice(index,1);    
                            }                
                        }, Object.create(null));
                    }
                }
                
                // else if(fieldVal === "removeSelection"){
                //     // if(submitBtnVisibleArr.includes(fieldId) === true){
                //         submitBtnVisibleArr.filter(function (a,index) {
                //             if(a.split("--")[2] === fieldId){
                //                 submitBtnVisibleArr.splice(index,1);    
                //             }                
                //         }, Object.create(null));
                //     // }
                // }
                else{
                    if(submitBtnVisibleArr.includes(fieldId) === false && fieldVal === true){
                        submitBtnVisibleArr.push(fieldId);
                    }
                    else if(submitBtnVisibleArr.includes(fieldId) === true && fieldVal === false){
                        submitBtnVisibleArr.filter(function (a,index) {
                            if(a === fieldId){
                                submitBtnVisibleArr.splice(index,1);    
                            }                
                        }, Object.create(null));
                    }
                }
            },
            onSelectRegionArrow:function(){
                
            },
            onSelectCityArrow:function(){
                
            },
            handleTypeMissmatch:function(oEvent){
            },
            handleUploadComplete:function(oEvent){
            },
            handleValueChange:function(oEvent){
                sap.ui.getCore().fileUploadArr = [];
                var uploadFileId = oEvent.getSource().getId();
                var uploadedFileData =  oEvent.getParameters("file").files[0];
                var sizeOfUploadedFile = oEvent.getParameters("file").files[0].size;
                var selectedObj = this.getView().getModel("blankJson").getData();
                oEvent.getSource().setValueState("None");

                selectedObj.FILE_MIMETYPE = oEvent.getParameters("file").files[0].type;
                selectedObj.FILE_NAME =  oEvent.getParameters("file").files[0].name
                // this.getView().getModel("retailerData").setProperty("/uploadedFileData",oEvent.getParameters("file"));
                var sizeOfFileInMb = Number((sizeOfUploadedFile / (1024*1024)).toFixed(2));

                if(sizeOfFileInMb > 5){
                    MessageBox.error("The size of file should be less than 5 Mb");
                    oEvent.getSource().setValue("");
                }
                else{
                    this.commonValidation(uploadedFileData,uploadFileId,"null");
                    this.fileDecodingMethod(uploadedFileData, "001");
                }
            },
            fileDecodingMethod: function (uploadedFileData, DocNum) {
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
                 sap.ui.getCore().fileUploadArr.push({
                  "DocumentType": DocNum,
                  "MimeType": fileMime,
                  "FileName": fileName,
                  "Content": that.base64ConversionRes,
             
                 });
                };
                reader.readAsBinaryString(uploadedFileData);
               },
            onRetailerDataFetch:function(sEvents){
                var nullAddressArr = [];
                var billingAddressAvl = [];
                var shippingAddressAvl = [];
                var retailerAddress,validationSections;
                var retailerAddressDataArr = []
                var retailerData = this.getView().getModel("blankJson").getData();
                var retailerAddressData = retailerData.retailerAddress;
                if(retailerAddressData === undefined){
                    retailerAddressData = []
                }
            
            // if(retailerAddressData.length>0){
            //     nullAddressArr = validation.validateTable(retailerAddressDataArr,[]);
            // }
            if(retailerAddressData.length === 0){
                nullAddressArr.push({
					"section": 2,
					"description": "Please add the billing and ship to address in address section",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
                validationSections = nullAddressArr;
            }
            else if(retailerAddressData.length > 0){ 
                nullAddressArr = validation.validateTable(retailerAddressData,[]);

                billingAddressAvl = retailerAddressData.filter(function (a,index) {
                    if(a.ADDRESS_TYPE === "BL_ADDR"){
                        return a;     
                    }                
                }, Object.create(null));

                shippingAddressAvl = retailerAddressData.filter(function (a,index) {
                    if(a.ADDRESS_TYPE === "SHP_ADDR"){
                            return a;     
                    }                
                }, Object.create(null));

                if(billingAddressAvl.length > 0 && shippingAddressAvl.length>0){
                for(var i=0;i<retailerAddressData.length;i++){
                    if(retailerAddressData[i].EMAIL_ID !== "" && retailerAddressData[i].EMAIL_ID !== undefined
                    && retailerAddressData[i].EMAIL_ID !== null){
                        retailerAddressData[i].EMAIL_ID = retailerAddressData[i].EMAIL_ID.toLowerCase();
                    }
                    
                        retailerAddress = {
                            "RETAILER_ID": "5000000001",
                            "SR_NO": 1,
                            "ADDRESS_TYPE": retailerAddressData[i].ADDRESS_TYPE,
                            "MOBILE_NO": retailerAddressData[i].MOBILE_NO,
                            "TELEPHONE_NO" : retailerAddressData[i].TELEPHONE_NO,
                            "EMAIL_ID": retailerAddressData[i].EMAIL_ID,
                            "FAX_NO" : retailerAddressData[i].FAX_NO,
                            "CONTACT_PERSON" : retailerAddressData[i].CONTACT_PERSON,
                            "STREET_NO": retailerAddressData[i].STREET_NO,
                            "ADDRESS_LINE_1": retailerAddressData[i].ADDRESS_LINE_1,
                            "ADDRESS_LINE_2": retailerAddressData[i].ADDRESS_LINE_2,
                            "ADDRESS_LINE_3": retailerAddressData[i].ADDRESS_LINE_3,
                            "COUNTRY": retailerAddressData[i].COUNTRY,
                            "REGION": retailerAddressData[i].REGION,
                            "CITY": retailerAddressData[i].CITY,
                            "POSTAL_CODE": retailerAddressData[i].POSTAL_CODE
                        }
                        retailerAddressDataArr.push(retailerAddress);
                    }
                    // nullAddressArr = validation.validateTable(retailerAddressDataArr,[]);
                }
                else if(billingAddressAvl.length === 0 && shippingAddressAvl.length === 0){
                    nullAddressArr.push({
                        "section": 2,
                        "description": "Please add the billing and ship to address in address section.",
                        "subtitle": "Mandatory Field",
                        "type": "Warning",
                        "subsection":"addressDetails"
                    });
                }
                else if(billingAddressAvl.length === 0 && shippingAddressAvl.length>0){
                    nullAddressArr.push({
                        "section": 2,
                        "description": "Please add the billing address in address section.",
                        "subtitle": "Mandatory Field",
                        "type": "Warning",
                        "subsection":"addressDetails"
                    });
                }
                else if(billingAddressAvl.length > 0 && shippingAddressAvl.length === 0){
                    nullAddressArr.push({
                        "section": 2,
                        "description": "Please add the ship to address in address section.",
                        "subtitle": "Mandatory Field",
                        "type": "Warning",
                        "subsection":"addressDetails"
                    });
                }
                validationSections = nullAddressArr;
            }
            else if(retailerAddressData.length === 0){
                var nullAddressArr = [];
                nullAddressArr.push({
					"section": 2,
					"description": "Please add the billing and ship address in address section",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"addressDetails"
				});
                validationSections = nullAddressArr;
            }

                this.onSubmitData(retailerAddressDataArr,validationSections,sEvents);
           },
           onSubmitData:function(retailerAddress,validateHeaderData,sEvents){
                var array_s1 = [];
                var validationSections = [];

                var retailerData = this.getView().getModel("blankJson").getData();
                var validationSections = validation.validateSections(retailerData,array_s1);
                    
                var chngDate = new Date().toISOString().split("T")[0];

                if(validationSections.length > 0 && validateHeaderData.length > 0){
                    $.merge(validateHeaderData,validationSections);
                    this.validateForm(validateHeaderData);
                }
                else if(validationSections.length === 0 && validateHeaderData.length > 0){
                    this.validateForm(validateHeaderData);
                }
                else if(validationSections.length > 0 && validateHeaderData.length === 0){
                    this.validateForm(validationSections);
                }
                else{
                    var oButton = this.getView().byId("messagePopoverBtn");
                    oButton.setVisible(false);
                    var upiId = retailerData.UPI_ID;
                    var panNo = retailerData.PAN_NO
                    // if(upiId !== null || upiId !== undefined){
                    //     upiId = retailerData.UPI_ID.toLowerCase();
                    // }
                    if(upiId === undefined){
                        upiId = null;
                    }
                    var createRetailer =
                    {
                        "Action": "CREATE",
                        "retailerDetails": [
                            {
                                "DISTRIBUTOR_ID": "1100013",
                                "RETAILER_ID":"5000000001",
                                "NAME_OF_BANK": retailerData.NAME_OF_BANK.toUpperCase() || null,
                                "BANK_ACC_NO": retailerData.BANK_ACC_NO || null,
                                "IFSC_CODE": retailerData.IFSC_CODE.toUpperCase() || null,
                                "UPI_ID": upiId,
                                "REGISTERED_TAX_ID":retailerData.REGISTERED_TAX_ID.toUpperCase() || null,
                                "PAN_NO": retailerData.PAN_NO,
                                // "VAT_NO": retailerData.VAT_NO,
                                "RETAILER_NAME":retailerData.RETAILER_NAME.toUpperCase() || null,
                                "RETAILER_TYPE": Number(retailerData.RETAILER_TYPE) || null,
                                "BLOCKED": "N",
                                "CHANGE_DATE": chngDate,
                                "RETAILER_CLASS": retailerData.RETAILER_CLASS || null,
                                "PAY_TERM": Number(retailerData.PAY_TERM) || null,
                                "FIELD_1": "",
                                "FIELD_2": "",
                                "FIELD_3": "",
                                "FIELD_4": "",
                                "FIELD_5": ""
                            }
                        ],
                        "retailerAddress" : retailerAddress,
                        "retailerAttachments": [
                            {
                                "DISTRIBUTOR_ID": "1100013",
                                "RETAILER_ID":"5000000001",
                                "FILE_ID": 1,
                                "FILE_CONTENT": sap.ui.getCore().fileUploadArr[0].Content,
                                "FILE_MIMETYPE": retailerData.FILE_MIMETYPE,
                                "FILE_TYPE": retailerData.FILE_MIMETYPE,
                                "FILE_NAME": retailerData.FILE_NAME
                            }
                        ],
                        "userDetails": {
                            "USER_ROLE": "CM",
                            "USER_ID": "darshan.l@intellectbizware.com"
                        }
                    }
                    var url = appModulePath+"/OData/v4/ideal-retailer-registration/registerRetailer";
                    var data = JSON.stringify(createRetailer);
                    if(sEvents === "onBackNavigation"){
                        BusyIndicator.show(0);
                        that.postAjaxs(url,"POST",data,"null");
                    }
                    else{
                        MessageBox.confirm("Do you want to save ?", {

                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            // initialFocus: sap.m.MessageBox.Action.CANCEL,
                            onClose: function (oAction) {
                                if (oAction === 'YES') {
                                    BusyIndicator.show(0);
                                    that.postAjaxs(url,"POST",data,"null");
                                } else {
                                    // Do something
                                }

                            }
                        });
                    }
                }
            },
            validateForm: function (checkFields) {
                if(this.oMP){
                    this.oMP.close();
                }
                
                if (checkFields.length > 0) {
                    var checkFieldsJson = new JSONModel();
                    checkFieldsJson.setData(checkFields);
                    oView.setModel(checkFieldsJson, "checkFieldsJson");
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
            createMessagePopover: function () {
                var that = this;
                this.oMP = new MessagePopover({
                    activeTitlePress: function (oEvent) {var oItem = oEvent.getParameter("item").getProperty("key");
                    context.getView().byId("ObjectPageLayout").setSelectedSection(context.getView().byId(oItem));
                    if(oEvent.getParameter("item").getProperty("text")!== ''){
                        context.getView().byId(oEvent.getParameter("item").getProperty("text")).setValueState(sap.ui.core.ValueState.Error).
                        setValueStateText(oEvent.getParameter("item").getProperty("title"));
                    }
                    },
                    items: {
                        path: "checkFieldsJson>/",
                        template: new MessageItem({
                            title: "{checkFieldsJson>description}",
                            activeTitle: true,
                            subtitle: "{checkFieldsJson>subtitle}",
                            type: "{checkFieldsJson>type}",
                            key: "{checkFieldsJson>subsection}",
                            text: "{checkFieldsJson>text}"
                        })
                    },
                    groupItems: true
                });
                this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
            },
            handleMessagePopoverPress: function (oEvent) {
                if (!this.oMP) {
                    this.createMessagePopover();
                }
                this.oMP.toggle(oEvent.getSource());
            },
            postAjaxs: function (url, type, data, model) {
            
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    data: data,
                    success: function (data, response) {
                        
                        BusyIndicator.hide();
                        if(type === "POST"){
                            BusyIndicator.hide();
                            MessageBox.success(data.value, {

                                initialFocus: sap.m.MessageBox.Action.CANCEL,
                                onClose: function (sButton) {
                                    if (sButton === MessageBox.Action.OK) {
                                        // BusyIndicator.show(0);
                                        that.navigateToMaster();
                                    } else if (sButton === MessageBox.Action.CANCEL) {
                                        // Do something
                                    }            
                                }
                            });
                        }
                        else if(type === "GET"){
                            BusyIndicator.hide();
                            var oModel = new JSONModel();
                            oModel.setSizeLimit(data.value.length);
					        oModel.setData(data.value);
                            that.getView().setModel(oModel,model);
                        }
                    },
                    error: function (error) {
                        BusyIndicator.hide();
                        var oXMLMsg, oXML;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error.message;
                        } else {
                            oXMLMsg = error.responseText;
                        }
    
                        MessageBox.error(oXMLMsg);
                    }
                });
            },
            handleAddress:function(){
                var nullAddressData = this.getOwnerComponent().getModel("nullRegAddressData").getProperty("/retailerAddress/0");
                var getAddressData =  oView.getModel("blankJson").getProperty("/retailerAddressDataLength");
                if(getAddressData.length === 0){
                    var nullObject = {ADDRESS_TYPE: "",STREET_NO: null,ADDRESS_LINE_1: null,
                    ADDRESS_LINE_2: null,ADDRESS_LINE_3: null,COUNTRY: null,REGION: null,CITY: null,POSTAL_CODE: null,
                    MOBILE_NO: null,TELEPHONE_NO: null,EMAIL_ID: null,CONTACT_PERSON: null,FAX_NO:null,SR_NO: 0,
                    COUNTRY_DESC:null,REGION_DESC:null,CITY_DESC:null,countryValueState:"None",regionValueState:"None",
                    cityValueState:"None",postalCodeValueState:"None",contPersonValueState:"None",mobNoValueState:"None",telPhoneValueState:"None",
                    emailIdValueState:"None",faxNoValueState:"None"};
                }
                else if(getAddressData.length > 0){
                    const copyDefaultData = Object.assign({}, nullAddressData);
                    var nullObject = Object.assign(copyDefaultData,{ADDRESS_TYPE: ""},{STREET_NO: null},
                    {ADDRESS_LINE_1: null},{ADDRESS_LINE_2: null},{ADDRESS_LINE_3: null},{COUNTRY: null},{REGION: null},
                    {CITY: null},{POSTAL_CODE: null},{MOBILE_NO: null},{TELEPHONE_NO: null},{EMAIL_ID: null},
                    {CONTACT_PERSON: null},{FAX_NO:null},{SR_NO: 0},{COUNTRY_DESC:null},{REGION_DESC:null},{CITY_DESC:null},
                    {countryValueState:"None"},{regionValueState:"None"},{cityValueState:"None"},{postalCodeValueState:"None"},{contPersonValueState:"None"},
                    {mobNoValueState:"None"},{telPhoneValueState:"None"},{emailIdValueState:"None"},{faxNoValueState:"None"});
                    // oView.getModel("blankJson").getProperty("/retailerAddressDataLength").push(nullObject);
                }
                visibleRowCountArr.push(nullObject);
                oView.getModel("blankJson").setProperty("/retailerAddress",visibleRowCountArr);
                oView.byId("trAddId").setVisibleRowCount(visibleRowCountArr.length);

            },
            _onTableValueChange:function(){
            },
            handleDeleteAddress: function (oEvent) {
                var retailerAddressFieldsArr = this.getView().getModel("blankJson").getProperty("/retailerAddress");
                
                var dupShippingAddress= retailerAddressFieldsArr.filter(function (a,index) {
                    if(a["ADDRESS_TYPE"] === "SHP_ADDR"){ 
                        return a;  
                    }                
                }, Object.create(null));
                var addressType = oEvent.getSource().getBindingContext("blankJson").getProperty("ADDRESS_TYPE");

                if(addressType === "BL_ADDR"){
                    MessageBox.information("Billing address is mandatory");
                }
                else if(addressType === "SHP_ADDR" && dupShippingAddress.length === 1){
                    MessageBox.information("Ship To Address is mandatory");
                }
                else{
                    oView.getModel("blankJson").setProperty("/retailerAddressDataLength",[]);
                    var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
                    oView.getModel("blankJson").getProperty("/retailerAddress").splice(index, 1);
                    var addressArrData = oView.getModel("blankJson").getProperty("/retailerAddress");

                    if(addressArrData.length > 0){
                        oView.getModel("blankJson").getProperty("/retailerAddressDataLength").push(addressArrData);
                    }
                    else if(addressArrData.length === 0){
                        this.getOwnerComponent().getModel("nullRegAddressData").setProperty("/retailerAddress/0",that.nullAddressProp);
                    }
                    oView.getModel("blankJson").refresh(true);
                    oView.byId("trAddId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/retailerAddress").length);
                }
            },
            onBack:function(){
                var addressDataLength = this.getView().getModel("blankJson").getProperty("/retailerAddressDataLength");
                var valTableFields = validation.validateTable(this.getView().getModel("blankJson").getProperty("/retailerAddress"),[]);
               
                if((addressDataLength.length > 0 && (valTableFields.length < 18 || valTableFields.length > 18)) || submitBtnVisibleArr.length > 0){
                    MessageBox.confirm("Data will be lost. Do you want to save?", {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        initialFocus: sap.m.MessageBox.Action.NO,
                        onClose: function (sButton) {
                            if (sButton === MessageBox.Action.YES) {
                                that.onRetailerDataFetch("onBackNavigation");
                            } else if (sButton === MessageBox.Action.NO) {
                               that.navigateToMaster();
                            }

                        }
                    });
                }
                else{
                    that.navigateToMaster();
                }
            },
            navigateToMaster:function(){
                var param = {};
                var oSemantic = "ideal_view_change";
                var hash = {};
                    var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                    var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                    semanticObject: oSemantic,
                    action: "display"
                    }
                    ,
                    params: param
                    })) || ""; // generate the Hash to display a Supplier
        
                  
                        oCrossAppNavigator.toExternal({
                            target: {
                            shellHash: hash
                            }
                            });
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
            }
        });
    });