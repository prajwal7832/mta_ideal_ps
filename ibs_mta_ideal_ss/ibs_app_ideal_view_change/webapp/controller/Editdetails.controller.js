sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
	"com/ibs/ibsappidealviewchange/model/validation",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "com/ibs/ibsappidealviewchange/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,BusyIndicator,JSONModel,MessageBox,validation,MessagePopover,
        MessageItem,Filter,FilterOperator,formatter) {
        "use strict";
        var retailerId,appModulePath,context,that,retailerModel,visibleRowCountArr,
        oRetailerOrgModel,editFieldsArr,context,oView,editFieldsArr;

        return Controller.extend("com.ibs.ibsappidealviewchange.controller.Editdetails", {
            formatter:formatter,
            onInit: function () {
                that = this;
                context = this;
                oView = context.getView();

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteEditdetails").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched:function(oEvent){
                BusyIndicator.hide();
                
                editFieldsArr = [];
                retailerModel = new JSONModel();
                oRetailerOrgModel = new JSONModel();
                visibleRowCountArr = [];
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                retailerId = oEvent.getParameter("arguments").RETAILER_ID;
                this.readAddressType();
                this.readData(retailerId);
                this.setValueState();
            },
            setValueState:function(){
                this.getView().byId("idAccountNo").setValueState("None");
                this.getView().byId("idIfsc").setValueState("None");
                this.getView().byId("idPan").setValueState("None");
                this.getView().byId("idUpi").setValueState("None");
            },
            onBack:function(){
                if(editFieldsArr.length === 0){
                    that.navigateToMaster();
                }
                else{
                    MessageBox.confirm("Changes will be lost. Do you want to save the changes ?", {
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
            },
            navigateToMaster:function(){
                if(retailerModel !== undefined){
                    retailerModel.setData(null);
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMasterpage");
            },

            // ReadEntities 

            readData:function(retailerId){
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerDetails?$filter=(RETAILER_ID eq '"+ retailerId+"')&$expand=TO_ADDRESS($expand=TO_COUNTRY,TO_REGION,TO_CITY,TO_ADDRESS_TYPE),TO_RETAILER_TYPE";
                var data = { $expand: 'TO_REGION,TO_COUNTRY,TO_RETAILER_TYPE,TO_CITY' };
                this.postAjaxs(url,"GET","null","retailerData");
            },
            readEntitySet:function(){
                this.readCountrySet();
                this.readRetailerType();
                this.readAttachments();
                // this.readRegionMaster();
                // this.readCityMaster();
            },
            readAttachments:function(){
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerAttachments?$filter=RETAILER_ID eq '"+ retailerId+"'";
                this.postAjaxs(url,"GET","null","retailerAttachmentsData");
            },
            readAddressType:function(){
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/AddressTypeMaster";
                this.postAjaxs(url,"GET","null","addreessTypeModel");
            },
            readCountrySet:function(){
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/CountryMaster";
                this.postAjaxs(url,"GET","null","countryDataModel");
            },
            readRegionMaster:function(sValue){
                BusyIndicator.show(0);
                if(sValue === undefined){
                    
                    var sSelectedCountryCode = that.getView().getModel("retailerData").getProperty("/COUNTRY");
                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/RegionMaster?$filter=LAND1 eq '"+sSelectedCountryCode+"'";
                }
                else{
                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/RegionMaster?$filter=LAND1 eq '"+ sValue +"'";
                }
                this.postAjaxs(url,"GET","null","regionMasterDataModel");
            },
            readRetailerType:function(){
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerTypeMaster";
                this.postAjaxs(url,"GET","null","RetailerTypeMaster");
            },
            readCityMaster:function(sValue){
                BusyIndicator.show(0);
                if(sValue === undefined){
                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/CityMaster";
                }
                else{
                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/CityMaster?$filter=REGION_CODE eq '"+ sValue +"'";
                }
                this.postAjaxs(url,"GET","null","CityMasterModel");
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
                            MessageBox.success(data.value, {
                                actions: [MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    if (oAction === "OK") {
                                        context.navigateToMaster();
                                    }
                                }
                            });
                        }
                        else if(type === "GET"){
                            if(model === "retailerData"){
                            retailerModel = new JSONModel(data.value[0]);
                            that.getView().setModel(retailerModel,model);
                            oView.byId("trAddId").setVisibleRowCount(data.value[0].TO_ADDRESS.length);
                            // that.retailerAddressDataObj(data.value[0]);
                            oRetailerOrgModel.setData(Object.assign({}, data.value[0]));
                            that.readEntitySet();
                            }
                            else{
                                var oModel = new JSONModel();
                                oModel.setSizeLimit(data.value.length);
					            oModel.setData(data.value);
                                that.getView().setModel(oModel,model);
                            }
                        }
                    },
                    error: function (error) {
                        
                        BusyIndicator.hide();
                        var oXMLMsg, oXML;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText;
                        }
    
                        MessageBox.error(oXMLMsg);
                    }
                });
            },
            
            handleAddAddress:function(){
                var nullAddressData = this.getOwnerComponent().getModel("nullAddressData").getProperty("/retailerAddress/0");
                var getAddressData = oView.getModel("retailerData").getProperty("/TO_ADDRESS");
                //  oView.getModel("retailerAddressData").getData();
                if(getAddressData.length === 0){
                    var nullObject = {ADDRESS_TYPE: "",STREET_NO: null,ADDRESS_LINE_1: null,
                    ADDRESS_LINE_2: null,ADDRESS_LINE_3: null,COUNTRY: null,REGION: null,CITY: null,POSTAL_CODE: null,
                    MOBILE_NO: null,TELEPHONE_NO: null,EMAIL_ID: null,CONTACT_PERSON: null,FAX_NO:null,SR_NO: 0,
                    COUNTRY_DESC:null,REGION_DESC:null,CITY_DESC:null
                    ,countryValueState:"None",regionValueState:"None",
                    cityValueState:"None",postalCodeValueState:"None",contPersonValueState:"None",mobNoValueState:"None",telPhoneValueState:"None",
                    emailIdValueState:"None",faxNoValueState:"None"};
                }
                else if(getAddressData.length > 0){
                    visibleRowCountArr = getAddressData;
                    const copyDefaultData = Object.assign({}, nullAddressData);
                    var nullObject = Object.assign(copyDefaultData,{ADDRESS_TYPE: ""},{STREET_NO: null},
                    {ADDRESS_LINE_1: null},{ADDRESS_LINE_2: null},{ADDRESS_LINE_3: null},{COUNTRY: null},{REGION: null},
                    {CITY: null},{POSTAL_CODE: null},{MOBILE_NO: null},{TELEPHONE_NO: null},{EMAIL_ID: null},
                    {CONTACT_PERSON: null},{FAX_NO:null},{SR_NO: 0},{COUNTRY_DESC:null},{REGION_DESC:null},{CITY_DESC:null}
                    ,{countryValueState:"None"},{regionValueState:"None"},{cityValueState:"None"},{postalCodeValueState:"None"},{contPersonValueState:"None"},
                    {mobNoValueState:"None"},{telPhoneValueState:"None"},{emailIdValueState:"None"},{faxNoValueState:"None"});
                    
                }

                if(editFieldsArr.includes("retailerAddressData") === false){
                    editFieldsArr.push("retailerAddressData");
                }

                    visibleRowCountArr.push(nullObject);
                    oView.getModel("retailerData").setProperty("/TO_ADDRESS",visibleRowCountArr);
                    // var oModel = new JSONModel(visibleRowCountArr);   
                    // this.getView().setModel(oModel,"retailerAddressData");
                    oView.byId("trAddId").setVisibleRowCount(visibleRowCountArr.length);
            },
            handeAddressType:function(oEvent){
                var addressTypeId = oEvent.getSource().getId();
                var isBillingAddressAvl =true;
                var addressTypeVal = oEvent.getSource().getSelectedKey();
                var retailerAddressData = this.getView().getModel("retailerData").getProperty("/TO_ADDRESS");
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/ADDRESS_TYPE";
                var sIndex = Number(oEvent.getSource().getBindingContext("retailerData").getPath().split("/")[2]);

                retailerAddressData[sIndex].ADDRESS_TYPE = addressTypeVal;

                if(retailerAddressData.length > 1){
                    for(var i=0;i<retailerAddressData.length;i++){
                        if(i !== sIndex && retailerAddressData[i].ADDRESS_TYPE === addressTypeVal && retailerAddressData[i].ADDRESS_TYPE === "BL_ADDR"){
                            isBillingAddressAvl = false;     
                        }                
                    }
                }

                if(isBillingAddressAvl === false){
                    MessageBox.error("Billing address can be added only once.");
                    var sObject = oEvent.getSource().getBindingContext("retailerData").getModel().getProperty("/TO_ADDRESS");
                    sObject[sIndex].ADDRESS_TYPE = null;
                    // "SHP_ADDR";
                    oEvent.getSource().setSelectedKey(null);
                    // oView.getModel("blankJson").refresh(true);
                    oView.getModel("retailerData").refresh(true);
                }
                else{
                    var sObject =oEvent.getSource().getBindingContext("retailerData").getModel().getProperty("/TO_ADDRESS");
                    sObject[sIndex].ADDRESS_TYPE = addressTypeVal;
                    this.commonValidation(addressTypeVal,sPath,addressTypeId,"null","tableFieldsValidation");
                }
            },
            
            // handleCountry:function(oEvent){
            //     var oValue = oEvent.getSource().getSelectedKey();
            //     var oSelectedItem = oEvent.getSource().getSelectedItem();

            //     if(oSelectedItem === null){
            //         that.sCountryCode = oValue;
            //         oValue = that.sCountryCode;
            //         this.getView().byId("idCountry").setSelectedKey(oValue);
            //     }
            //     this.getView().byId("idCity").setSelectedKey("");
            //     this.commonValidation("","idCity","removeSelection");
            //     this.getView().byId("idRegion").setSelectedKey("");
            //     this.commonValidation("","idRegion","removeSelection");

            //     this.readRegionMaster(oValue);
            //     // this.getView().getModel("retailerData").setProperty("/country",oValue);
            //     var countrySelectId = oEvent.getSource().getId();

            //     var countryPathObj = {
            //         orgValue : oRetailerOrgModel.getData().COUNTRY,
            //         editedValue : retailerModel.getData().COUNTRY
            //     }
            //     this.commonValidation(oValue,countryPathObj,countrySelectId,"null","comboBoxValidation");
            // },

            // Simple form fields

            
            handleName:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/name",oValue);
                var nameId = oEvent.getSource().getId();
                var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path.split("/")[1];
                var nameVal = validation._charactersValidation(oEvent);
                this.commonValidation(oValue,sPath,nameId,nameVal);
            },
            handleRetailerType:function(oEvent){
                var oValue = oEvent.getSource().getSelectedKey();
                oEvent.getSource().setValueState("None");
                var retailerTypeId = oEvent.getSource().getId();
                var oSelectedItem = oEvent.getSource().getSelectedItem();

                if(oSelectedItem === null){
                    oValue =that.sRetailerKey;
                    this.getView().byId("idRetailderType").setSelectedKey(oValue);
                }
                else{
                    that.sRetailerKey = oValue;
                }
                // this.getView().getModel("retailerData").setProperty("/retailerType",oValue);
                var retailerTypePathObj = {
                    orgValue : oRetailerOrgModel.getData().RETAILER_TYPE,
                    editedValue : Number(retailerModel.getData().RETAILER_TYPE)
                }
                this.commonValidation(oValue,retailerTypePathObj,retailerTypeId,"null","comboBoxValidation");
            },
            handleRetailerClass:function(oEvent){
                var oValue = oEvent.getSource().getSelectedKey();
                var oSelectedItem = oEvent.getSource().getSelectedItem();
                oEvent.getSource().setValueState("None");

                // if(oSelectedItem === null){
                //     oValue = oEvent.getSource().getLastValue();
                //     this.getView().byId("idRetailserClass").setSelectedKey(oValue);
                // }

                var retailerClassId = oEvent.getSource().getId();
                
                var retailerClassPathObj = {
                    orgValue : oRetailerOrgModel.getData().RETAILER_CLASS,
                    editedValue : retailerModel.getData().RETAILER_CLASS
                }
                this.commonValidation(oValue,retailerClassPathObj,retailerClassId,"null","comboBoxValidation");
            },
            handlePaymentTerms:function(oEvent){
                var oValue = oEvent.getSource().getSelectedKey();
                var oSelectedItem = oEvent.getSource().getSelectedItem();
                oEvent.getSource().setValueState("None");

                // if(oSelectedItem === null){
                //     oValue = oEvent.getSource().getLastValue();
                //     this.getView().byId("idPaymentTerms").setSelectedKey(oValue);
                // }
                var paymentTermsId = oEvent.getSource().getId();
                
                var paymentTermsPathObj = {
                    orgValue : oRetailerOrgModel.getData().PAY_TERM,
                    editedValue : Number(retailerModel.getData().PAY_TERM)
                }
                this.commonValidation(oValue,paymentTermsPathObj,paymentTermsId,"null","comboBoxValidation");
            },
            handleNameOfBank:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/nameOfBank",oValue);
                var nameOfBankId = oEvent.getSource().getId();
                var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path.split("/")[1];
                this.commonValidation(oValue,sPath,nameOfBankId,"null");
            },
            handleUpi:function(oEvent){
                var upiId = oEvent.getSource().getId();
                var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path.split("/")[1];
                var oValue = oEvent.getSource().getValue();
                oEvent.getSource().setValueState("None");
                var upiIdVal = validation.validateUpi(oEvent);
                // this.getView().getModel("retailerData").setProperty("/upiID",oValue);
                this.commonValidation(oValue,sPath,upiId,"null");
            },
            handleAccountNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/accountNo",oValue);
                var accountNoId = oEvent.getSource().getId();
                var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path.split("/")[1];
                var accountNoVal = validation._validateAccountNumber(oEvent);
                this.commonValidation(oValue,sPath,accountNoId,accountNoVal);
            },
            handleIfsc :function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/ifscNo",oValue);
                var ifscCodeId = oEvent.getSource().getId();
                var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path.split("/")[1];
                var ifscCodeVal = validation._ifscValidation(oEvent);
                this.commonValidation(oValue,sPath,ifscCodeId,ifscCodeVal);
            },
            handleGstNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/gstNo",oValue);
                var gstNoId = oEvent.getSource().getId();
                var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path.split("/")[1];
                // var gstNoVal = validation.alphaNumaricVaidation(oEvent);
                if(Number(oValue) === 0){
                    oEvent.getSource().setValue("");
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Valid GSTN/Vat No");
                }
                else{
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.None)
                }

                this.commonValidation(oValue,sPath,gstNoId,"null");
            },
            handlePanNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/panNo",oValue);
                var panNoId = oEvent.getSource().getId();
                var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path.split("/")[1];
                var panNoVal = validation._panNoValidation(oEvent);
                this.commonValidation(oValue,sPath,panNoId,panNoVal);
            },
            handleVatNo : function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/vatRegNo",oValue);
                var vatNoId = oEvent.getSource().getId();
                var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var vatNoVal = validation.VATRegNumValidation(oEvent);
                this.commonValidation(oValue,sPath,vatNoId,vatNoVal);
            },
            commonValidation:function(fieldValue,sPath,fieldId,fieldVal,sType){
                var oRetailerDataModel = this.getView().getModel("retailerData").getData();
                
                var orgValue,editedValue;

                if(sType === "tableFieldsValidation"){
                    // orgValue = oRetailerOrgModel.getProperty("/TO_ADDRESS"+sPath);
                    // editedValue = retailerModel.getProperty("/TO_ADDRESS"+sPath);
                    orgValue = oRetailerOrgModel.getProperty(sPath);
                    editedValue = retailerModel.getProperty(sPath);
                }
                else if(sType !== "comboBoxValidation"){
                    orgValue = oRetailerOrgModel.getProperty("/"+sPath);
                    editedValue = retailerModel.getProperty("/"+sPath);
                }
                else if(sType === "comboBoxValidation"){
                    orgValue = sPath.orgValue;
                    editedValue = sPath.editedValue;
                }

                if(fieldVal === "null"){
                
                    if(editFieldsArr.includes(fieldId) === false && (orgValue !== editedValue)){
                        editFieldsArr.push(fieldId);
                    }
                    else if(editFieldsArr.includes(fieldId) === false && sType === "tableFieldsValidation"){
                    // (sPath.split("/")[3] === "COUNTRY" ||
                    // sPath.split("/")[3] === "REGION" || sPath.split("/")[3] === "CITY")){
                        editFieldsArr.push(fieldId);
                    }
                    else if(editFieldsArr.includes(fieldId) === true && (orgValue === editedValue) 
                    && sType !== "tableFieldsValidation"){
                        editFieldsArr.filter(function (a,index) {
                            if(a === fieldId){
                                editFieldsArr.splice(index,1);    
                            }                
                        }, Object.create(null));
                    }
                    else if(fieldValue === "" || fieldValue === null){
                        editFieldsArr.filter(function (a,index) {
                            if(a === fieldId){
                                editFieldsArr.splice(index,1);    
                            }                
                        }, Object.create(null));
                    }
                }
                else if(fieldVal === true && (orgValue == editedValue)){
                    if(editFieldsArr.includes(fieldId) === false && (orgValue !== editedValue)){
                        editFieldsArr.push(fieldId);
                    }
                    else if(editFieldsArr.includes(fieldId) === false && sType === "tableFieldsValidation"){
                        editFieldsArr.push(fieldId);
                    }
                    else if(editFieldsArr.includes(fieldId) === true && (orgValue === editedValue)
                    && sType !== "tableFieldsValidation"){
                        editFieldsArr.filter(function (a,index) {
                            if(a === fieldId){
                                editFieldsArr.splice(index,1);    
                            }                
                        }, Object.create(null));
                    }
                }             
                else if(fieldVal === "removeSelection"){
                    // if(editFieldsArr.includes(fieldId) === true){
                        editFieldsArr.filter(function (a,index) {
                            if(a.split("--")[2] === fieldId){
                                editFieldsArr.splice(index,1);    
                            }                
                        }, Object.create(null));
                    // }
                }
                else{
                    editFieldsArr.push(fieldId);
                }

            },

            // Table Fields 
            
            handleStreetNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/streetNo",oValue);
                var streetNoId = oEvent.getSource().getId();
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                this.commonValidation(oValue,sPath,streetNoId,"null","tableFieldsValidation");
            },
            handleAddressLine1:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/address1",oValue);
                var addressLine1Id = oEvent.getSource().getId();
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                this.commonValidation(oValue,sPath,addressLine1Id,"null","tableFieldsValidation");
            },
            handleAddressLine2:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/address2",oValue);
                var addressLine2Id = oEvent.getSource().getId();
                // var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                
                this.commonValidation(oValue,sPath,addressLine2Id,"null","tableFieldsValidation");
            },
            handleAddressLine3:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/address3",oValue);
                var addressLine3Id = oEvent.getSource().getId();
                // var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                
                this.commonValidation(oValue,sPath,addressLine3Id,"null","tableFieldsValidation");
            },
           
            handleCountryDialog: function (oEvent) {
                this.selectedRowCountry = oEvent.getSource();
                that.countryId = oEvent.getSource().getId();
                that.countryIndex = parseInt(oEvent.getSource().getBindingContext("retailerData").getPath().split("/")[2]);
                that.countryPath = oEvent.getSource().getBindingContext("retailerData").getPath();
                if (!this.countryDialog) {
                    this.countryDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealviewchange.view.Fragments.countryDialog", this);
                    this.getView().addDependent(this.countryDialog);
                }
    
                this.countryDialog.open();
                sap.ui.getCore().byId("countrySrchId").setValue("");
                if(sap.ui.getCore().byId("cntry_listId").getBinding("items") !== undefined){
                    sap.ui.getCore().byId("cntry_listId").getBinding("items").filter();
                }
            },
            handleCountrySelection:function(oEvent){
                var sFlag = false;
                var selectedObj = this.getView().getModel("retailerData").getProperty("/TO_ADDRESS");
                var countryCode = oEvent.getSource().getSelectedItem().getBindingContext("countryDataModel").getObject().LAND1;
                var countyDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryDataModel").getObject().LANDX;
                 
                if(selectedObj[that.countryIndex].COUNTRY === countryCode){
                    sFlag = true;
                }
                else{
                    // const sValueBeforeSelect = this.getView().getModel("retailerData").getProperty("/TO_ADDRESS");
                    selectedObj[that.countryIndex].TO_COUNTRY = {};
                    selectedObj[that.countryIndex].TO_REGION = {};
                    selectedObj[that.countryIndex].TO_CITY = {}; 

                    selectedObj[that.countryIndex].COUNTRY = countryCode;
                    selectedObj[that.countryIndex].TO_COUNTRY.LANDX = countyDesc;
                    // selectedObj[that.countryIndex].COUNTRY_DESC = countyDesc;
                    selectedObj[that.countryIndex].CITY = null;
                    selectedObj[that.countryIndex].REGION = null;
                    selectedObj[that.countryIndex].TO_CITY.CITY_DESC = null;
                    selectedObj[that.countryIndex].TO_REGION.BEZEI = null;
                    this.getView().getModel("retailerData").setProperty(that.countryPath+"/TO_COUNTRY/LANDX",countyDesc);
                    this.selectedRowCountry.setValueState("None");
                    this.commonValidation(countryCode,that.countryPath+"/COUNTRY",that.countryId,"null","tableFieldsValidation");
                }
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
                that.regionId = oEvent.getSource().getId();
                this.selectedRowRegion = oEvent.getSource();
                that.regionIndex = parseInt(oEvent.getSource().getBindingContext("retailerData").getPath().split("/")[2]);
                that.regionPath = oEvent.getSource().getBindingContext("retailerData").getPath();
                var country = this.getView().getModel("retailerData").getProperty("/TO_ADDRESS")[that.regionIndex].COUNTRY;

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
                        this.regionDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealviewchange.view.Fragments.regionDialog", this);
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
                var sFlag = false;
                var selectedObj = this.getView().getModel("retailerData").getProperty("/TO_ADDRESS");

                var regionCode = oEvent.getSource().getSelectedItem().getBindingContext("regionMasterDataModel").getObject().BLAND;
                var regionDesc = oEvent.getSource().getSelectedItem().getBindingContext("regionMasterDataModel").getObject().BEZEI;
                    
                if(selectedObj[that.regionIndex].REGION === regionCode){
                    sFlag = true;
                }
                else{
                    selectedObj[that.regionIndex].REGION = regionCode;
                    
                    selectedObj[that.regionIndex].TO_CITY.CITY_DESC = null;
                    selectedObj[that.regionIndex].CITY = null;
                    selectedObj[that.regionIndex].TO_REGION.BEZEI = regionDesc;

                    // selectedObj[that.regionIndex].REGION_DESC = regionDesc;
                    // selectedObj[that.regionIndex].CITY_DESC = "";
                    this.getView().getModel("retailerData").setProperty(that.regionPath+"/TO_REGION/BEZEI",regionDesc);
                    this.selectedRowRegion.setValueState("None");
                    // this.readRegionMaster(regionCode);
                    this.commonValidation(regionCode,that.countryPath+"/REGION",that.regionId,"null","tableFieldsValidation");
                }
                this.closeRegionDialog();
                oEvent.getSource().removeSelections();
            },
            closeRegionDialog:function(){
                sap.ui.getCore().byId("regionSrchId").setValue("");
                this.regionDialog.close();
            },        
            handleCityDialog:function(oEvent){
                that.cityId = oEvent.getSource().getId();
                this.selectedRowCity = oEvent.getSource();
                that.cityIndex = parseInt(oEvent.getSource().getBindingContext("retailerData").getPath().split("/")[2]);
                that.cityPath = oEvent.getSource().getBindingContext("retailerData").getPath();
                
                var region = this.getView().getModel("retailerData").getProperty("/TO_ADDRESS")[that.cityIndex].REGION;

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
                        this.cityDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealviewchange.view.Fragments.cityDialog", this);
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
                var sFlag = false;
                var selectedObj = this.getView().getModel("retailerData").getProperty("/TO_ADDRESS");

                var cityCode = oEvent.getSource().getSelectedItem().getBindingContext("CityMasterModel").getObject().CITY_CODE;
                var cityDesc = oEvent.getSource().getSelectedItem().getBindingContext("CityMasterModel").getObject().CITY_DESC;
                
                if(selectedObj[that.cityIndex].CITY === cityCode){
                    sFlag = true;
                }
                else{
                    selectedObj[that.cityIndex].CITY = cityCode;
                    selectedObj[that.cityIndex].TO_CITY.CITY_DESC = cityDesc;
                    this.getView().getModel("retailerData").setProperty(that.cityPath+"/TO_CITY/CITY_DESC",cityDesc);
                    this.selectedRowCity.setValueState("None");
                }

                this.commonValidation(cityCode,that.cityPath+"/REGION",that.cityId,"null","tableFieldsValidation");
                this.closeCityDialog();
                oEvent.getSource().removeSelections();
            },
            closeCityDialog:function(oEvent){
                sap.ui.getCore().byId("citySrchId").setValue("");
                this.cityDialog.close();
            },
            
            // 
            _postalCodeLiveChange:function(oEvent){
                validation._numberValidation(oEvent);
            },
            _mobileNoLiveChange:function(oEvent){
                validation._validateMobileNum(oEvent);
            },
            _postalCodeVal:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                var postalCodeId = oEvent.getSource().getId();
                // var sPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var postalCodeValidation = validation.postalCodeValidation(oEvent);
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                this.commonValidation(oValue,sPath,postalCodeId,postalCodeValidation,"tableFieldsValidation");
            },
            _validateMobileNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/mobileNo",oValue);
                var mobNoId = oEvent.getSource().getId();
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                var valMobNo = validation._validateMobileNum(oEvent,"onChange");
                this.commonValidation(oValue,sPath,mobNoId,valMobNo,"tableFieldsValidation");
            },
            _validateTelNoLive:function(oEvent){
                validation._numberValidation(oEvent);
            },
            _validateTelephoneNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/telephoneNo",oValue);
                var valTelephoneNoId = oEvent.getSource().getId();
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                var valTelephoneNo = validation._numberValidation(oEvent,"TelephoneNoVal");
                
                this.commonValidation(oValue,sPath,valTelephoneNoId,valTelephoneNo,"tableFieldsValidation");
            },
            _validateEmail:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/retailerEmail",oValue);
                var emailInpId = oEvent.getSource().getId();
                var emailVal = validation._validateEmail(oEvent);
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                
                this.commonValidation(oValue,sPath,emailInpId,emailVal,"tableFieldsValidation");
            },
            _validateContactPerson:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/contOfPerson",oValue);
                var countOfPersonId = oEvent.getSource().getId();
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                
                var contOfPersonVal = validation._charactersValidation(oEvent);
                this.commonValidation(oValue,sPath,countOfPersonId,contOfPersonVal,"tableFieldsValidation");
            },
            faxNoValLive:function(oEvent){
                validation._numberValidation(oEvent);
            },
            _validateFaxNo:function(oEvent){
                var oValue = oEvent.getSource().getValue();
                // this.getView().getModel("retailerData").setProperty("/faxNo",oValue);
                var faxNoId = oEvent.getSource().getId();
                var columnName = oEvent.getSource().mBindingInfos.value.parts[0].path;
                var sPath = oEvent.getSource().getBindingContext("retailerData").getPath()+"/"+columnName;
                
                var valFaxNoVal = validation._numberValidation(oEvent);

                if(oValue.length < 10 && valFaxNoVal === true){
                    oEvent.getSource().setValue("");
                    valFaxNoVal = false;
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter minumum 10 digit of fax number.");
                }
                else if(Number(oValue) === 0){
                    oEvent.getSource().setValue("");
                    valFaxNoVal = false;
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter valid fax number.");
                }
                this.commonValidation(oValue,sPath,faxNoId,valFaxNoVal,"tableFieldsValidation");
            },

            handleDeleteAddress: function (oEvent) {
                var addressType = oEvent.getSource().getBindingContext("retailerData").getProperty("ADDRESS_TYPE");

                if(addressType === "BL_ADDR"){
                    MessageBox.information("Billing address is mandatory");
                }
                else if(addressType === "SHP_ADDR" && dupShippingAddress.length === 1){
                    MessageBox.information("Ship To Address is mandatory");
                }
                else{
                    var index = oEvent.getSource().getBindingContext("retailerData").getPath().split("/")[2];
                    oView.getModel("retailerData").getProperty("/TO_ADDRESS").splice(index, 1);
                    var addressArrData = oView.getModel("retailerData").getProperty("/TO_ADDRESS");

                    if(addressArrData.length > 0){
                        this.getView().getModel("retailerData").setProperty("/TO_ADDRESS",addressArrData);
                    }
                    if(editFieldsArr.includes("retailerAddressData") === false){
                        editFieldsArr.push("retailerAddressData");
                    }
                    oView.byId("trAddId").setVisibleRowCount(addressArrData.length);
                }                
            },
            onRetailerDataFetch:function(sEvents){
                var validationSections = [];
                var isBillingAddressAvl =[];
                var isShipToAddressAvl = [];
                var nullAddressArr = [];
                var retailerData = this.getView().getModel("retailerData").getProperty("/TO_ADDRESS");

                if(retailerData === undefined){
                    retailerData = []
                }
            if(editFieldsArr.length === 0){
                MessageBox.information("Please Edit the data and then submit.");
            }
            else{
                if(retailerData.length === 0){
                    nullAddressArr.push({
                        "section": 2,
                        "description": "Please add the billing and ship to address in address section",
                        "subtitle": "Mandatory Field",
                        "type": "Warning",
                        "subsection":"addressDetails"
                    });
                        validationSections = nullAddressArr;
                }
                else if(retailerData.length > 0){
                    nullAddressArr = validation.validateTable(retailerData,[]);

                    var isBillingAddressAvl = retailerData.filter(function (a,index) {
                            if(a.ADDRESS_TYPE === "BL_ADDR"){
                                return a;     
                            }                
                        }, Object.create(null));
                    
                    var isShipToAddressAvl = retailerData.filter(function (a,index) {
                        if(a.ADDRESS_TYPE === "SHP_ADDR"){
                            return a;     
                        }                
                    }, Object.create(null));
                    
                    // if(isBillingAddressAvl.length > 0 && isShipToAddressAvl.length > 0){
                    //     validationSections = validation.validateTable(retailerData,[]);
                    // }
                    // else

                    if(isBillingAddressAvl.length === 0 && isShipToAddressAvl.length === 0){
                        nullAddressArr.push({
                            "section": 2,
                            "description": "Please add the billing and bhipping address in address section.",
                            "subtitle": "Mandatory Field",
                            "type": "Warning",
                            "subsection":"addressDetails"
                        });
                    }
                    else if(isBillingAddressAvl.length === 0 && isShipToAddressAvl.length>0){
                        nullAddressArr.push({
                            "section": 2,
                            "description": "Please add the billing address in address section.",
                            "subtitle": "Mandatory Field",
                            "type": "Warning",
                            "subsection":"addressDetails"
                        });
                    }
                    else if(isBillingAddressAvl.length > 0 && isShipToAddressAvl.length === 0){
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
                    this._validateForm(retailerData,validationSections,sEvents);
            }
           },
            _validateForm:function(addressData,validateHeaderData,sEvents){
                var retailerData = that.getView().getModel("retailerData").getData();
                var validationSections = validation.validateSections(retailerData,[]);

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
                // else if(editFieldsArr.length === 0){
                //     MessageBox.information("Please edit the data and save.");
                // }
                else if(sEvents === "onBackNavigation"){
                    that.getView().byId("messagePopoverBtn").setVisible(false);
                    that.onEditForm(addressData);
                }
                else{
                    that.getView().byId("messagePopoverBtn").setVisible(false);
                    MessageBox.confirm("Do you want to save the changes ?", {
                        
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        // initialFocus: sap.m.MessageBox.Action.CANCEL,
                        onClose: function (oAction) {
                            if (oAction === 'YES') {
                                that.onEditForm(addressData);
                            } else{
                                // Do something
                            }

                        }
                    });
                }
            },
            onEditForm:function(retailerAddressData){
                var retailerAddress;
                var attachmentDataArr = [];
                var retailerAddressDataArr =[];
                var retailerData = that.getView().getModel("retailerData").getData();
                var chngDate = new Date().toISOString().split("T")[0];
                var retailerAttachments = that.getView().getModel("retailerAttachmentsData").getData()[0];

                if(retailerAttachments === undefined){
                    attachmentDataArr = []
                }
                else{
                    // retailerAttachments.FILE_CONTENT = null;
                    // retailerAttachments.FILE_CONTENT@odata.mediaContentType = retailerAttachments.FILE_CONTENT@odata.mediaContentType;
                    attachmentDataArr = [
                        {
                            "DISTRIBUTOR_ID": retailerAttachments.DISTRIBUTOR_ID,
                            "RETAILER_ID": retailerAttachments.RETAILER_ID,
                            "FILE_ID": retailerAttachments.FILE_ID,
                            "FILE_CONTENT": retailerAttachments.FILE_CONTENT,
                            "FILE_MIMETYPE": retailerAttachments.FILE_MIMETYPE,
                            "FILE_TYPE": retailerAttachments.FILE_TYPE,
                            "FILE_NAME": retailerAttachments.FILE_NAME
                        }
                    ]
                    
                }
                for(var i=0;i<retailerAddressData.length;i++){
                    retailerAddress = {
                        "RETAILER_ID": retailerId,
                        // retailerAddressData[i].RETAILER_ID,
                        "SR_NO": retailerAddressData[i].SR_NO,
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
                        // "COUNTRY_DESC":retailerAddressData[i].TO_COUNTRY.LANDX,
                        "REGION": retailerAddressData[i].REGION,
                        // "REGION_DESC":retailerAddressData[i].TO_REGION.BEZEI,
                        "CITY": retailerAddressData[i].CITY,
                        // "CITY_DESC":retailerAddressData[i].TO_CITY.CITY_DESC,
                        "POSTAL_CODE": retailerAddressData[i].POSTAL_CODE,
                        "ADDRESS_TYPE": retailerAddressData[i].ADDRESS_TYPE
                    }
                        retailerAddressDataArr.push(retailerAddress);
                }
                var upiId = retailerData.UPI_ID;
                
                // if(upiId !== null){
                //     upiId = retailerData.UPI_ID.toLowerCase();
                // }
                
                if(upiId === undefined){
                    upiId = null;
                }

                    var oPayload =
                    {
                        "Action": "EDIT",
                        "retailerDetails": [
                            {
                                "DISTRIBUTOR_ID": retailerData.DISTRIBUTOR_ID,
                                "RETAILER_ID":retailerData.RETAILER_ID,
                                "RETAILER_NAME": retailerData.RETAILER_NAME,
                               
                                "NAME_OF_BANK": retailerData.NAME_OF_BANK,
                                "BANK_ACC_NO": retailerData.BANK_ACC_NO,
                                "IFSC_CODE": retailerData.IFSC_CODE,
                                "UPI_ID": upiId,
                                "REGISTERED_TAX_ID":retailerData.REGISTERED_TAX_ID,
                                "PAN_NO": retailerData.PAN_NO,
                                // "VAT_NO": retailerData.VAT_NO,
                                "RETAILER_TYPE": Number(retailerData.RETAILER_TYPE) || null,
                                "BLOCKED": retailerData.BLOCKED,
                                "CHANGE_DATE": chngDate,
                                // "2024-02-12",
                                "RETAILER_CLASS": retailerData.RETAILER_CLASS || null,
                                "PAY_TERM": Number(retailerData.PAY_TERM) || null,
                                "FIELD_1": retailerData.FIELD_1 || null,
                                "FIELD_2": retailerData.FIELD_2,
                                "FIELD_3": retailerData.FIELD_3,
                                "FIELD_4": retailerData.FIELD_4,
                                "FIELD_5": retailerData.FIELD_5
                            }
                        ],
                        "retailerAddress": retailerAddressDataArr,
                        "retailerAttachments": attachmentDataArr,
                        "userDetails": {
                                "USER_ROLE": "CM",
                                "USER_ID": "darshan.l@intellectbizware.com"
                        }
                        // [
                        //     {
                        //         "DISTRIBUTOR_ID": retailerAttachments.DISTRIBUTOR_ID,
                        //         "RETAILER_ID": retailerAttachments.RETAILER_ID,
                        //         "FILE_ID": retailerAttachments.FILE_ID,
                        //         "FILE_CONTENT": retailerAttachments.FILE_CONTENT,
                        //         "FILE_MIMETYPE": retailerAttachments.FILE_MIMETYPE,
                        //         "FILE_TYPE": retailerAttachments.FILE_TYPE,
                        //         "FILE_NAME": retailerAttachments.FILE_NAME
                        //     }
                        // ]
                    }

                    var url = appModulePath+"/OData/v4/ideal-retailer-registration/registerRetailer";
                    var data = JSON.stringify(oPayload);
                    BusyIndicator.show(0);
                    that.postAjaxs(url,"POST",data,"null");

            },
            handleMessagePopoverPress: function (oEvent) {
                if (!this.oMP) {
                    this.createMessagePopover();
                }
                this.oMP.toggle(oEvent.getSource());
            },
            validateForm: function (checkFields) {
                if(this.oMP || checkFields.length === 0){
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
