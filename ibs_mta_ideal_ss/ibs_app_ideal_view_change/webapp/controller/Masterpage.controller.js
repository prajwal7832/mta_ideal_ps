// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealviewchange.controller.Masterpage", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"com/ibs/ibsappidealviewchange/model/validation",
    "com/ibs/ibsappidealviewchange/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,Sorter,BusyIndicator,JSONModel,Filter,validation,formatter) {
        "use strict";
        var appModulePath,that,context,fieldValidationArr;

        return Controller.extend("com.ibs.ibsappidealviewchange.controller.Masterpage", {
            formatter:formatter,
            onInit: function () {
                that = this;
                context = this;
                fieldValidationArr = []
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteMasterpage").attachMatched(this._onRouteMatched, this);

            },
            _onRouteMatched:function(){
                this.readData();
                this.readRetailerTypeMaster();
            },
            readRetailerTypeMaster:function(){
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerTypeMaster";
                this.postAjaxs(url,"GET","null","retailerTypeData");
            },
            readData:function(aFilter,sType){
                if(aFilter === undefined){
                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerDetails?$expand=TO_ADDRESS($expand=TO_COUNTRY,TO_ADDRESS_TYPE,TO_REGION,TO_CITY),TO_RETAILER_TYPE";
                    var data = { $expand: 'TO_REGION,TO_COUNTRY,TO_RETAILER_TYPE,TO_CITY' };
                    this.postAjaxs(url,"GET","null","retailerData");
                }
                else{
                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerDetails?$filter=("+aFilter+")&$expand=TO_ADDRESS($expand=TO_COUNTRY,TO_ADDRESS_TYPE,TO_REGION,TO_CITY),TO_RETAILER_TYPE";
                    var data = { $expand: 'TO_REGION,TO_COUNTRY,TO_RETAILER_TYPE,TO_CITY' };
                    this.postAjaxs(url,"GET","null","retailerData",sType);
                }
               
            },

            onCreate : function(){
                var param = {};
                var oSemantic = "ideal_retailer_master";
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
            onPdcDetails:function(oEvent){
                if (!this.pdcFrag) {
                    this.pdcFrag = sap.ui.xmlfragment("com.ibs.ibsappidealviewchange.view.Fragments.PDCFrag", this);
				    this.getView().addDependent(this.pdcFrag);
			    }
			    this.pdcFrag.open();
                sap.ui.getCore().byId("idChequeNo").setValueState("None");
                sap.ui.getCore().byId("idAmount").setValueState("None");
                that.retailerDataPdc = oEvent.getSource().getBindingContext("retailerData").getObject();
                that.readPdcDetails();
                var dateRange = new Date();
                sap.ui.getCore().byId("idDateRangeSelection").setMinDate(dateRange);
            },
            readPdcDetails:function(){
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerPDC?$filter=RETAILER_ID eq '"+ that.retailerDataPdc.RETAILER_ID+"'";
                this.postAjaxs(url,"GET","null","retailerPdcData");
            },
            handleAmountVal:function(oEvent){
                var amountValueId = oEvent.getSource().getId();
                var amountVal = validation._numberValidation(oEvent);
                this.commonValidation(oEvent,amountVal,amountValueId);                                
            },
            handleBankName:function(oEvent){
                // var nameOfBankId = oEvent.getSource().getId();
                // this.commonValidation(oEvent,"",nameOfBankId); 
            },
            handleChequeNumber:function(oEvent){
                var checkNumberId = oEvent.getSource().getId();
                var chequeNo = validation._numberValidation(oEvent);  
                this.commonValidation(oEvent,chequeNo,checkNumberId);              
            },
            commonValidation:function(oEvent,validationState,fieldId){
                if(validationState === false){
                    fieldValidationArr.push(fieldId);
                }
                else if(validationState === true && fieldValidationArr.includes(fieldId)){
                    fieldValidationArr.filter(function (a,index) {
                        if(a === fieldId){
                            fieldValidationArr.splice(index,1);  
                        }                
                    }, Object.create(null));
                }

            },
            
            submitDialog:function(oEvent){
                var chngDate,bankName,chequeNo,amount,currencyCode,dateSelection;
                bankName = sap.ui.getCore().byId("idBankName").getValue();
                chequeNo = Number(sap.ui.getCore().byId("idChequeNo").getValue());
                amount = Number(sap.ui.getCore().byId("idAmount").getValue());
                currencyCode = sap.ui.getCore().byId("idCurrency").getSelectedKey();
                dateSelection = sap.ui.getCore().byId("idDateRangeSelection").getValue();

                if(dateSelection !== ""){
                    chngDate = new Date(dateSelection).toISOString().split("T")[0];
                }

                if((bankName === "" || bankName === undefined) || (chequeNo === "" || chequeNo === undefined)
                 || (amount === "" || amount === undefined || amount === 0) || (chngDate ==="" || chngDate === undefined) ||
                 (currencyCode === "" || currencyCode === null || currencyCode === undefined)){
                    MessageBox.error("There are some missing PDC details");
                }
                else if(fieldValidationArr.length > 0){
                    // MessageBox.error("");
                }
                else{

                    var oPayload = 
                    {
                        "retailerPDC": [
                            {
                                "DISTRIBUTOR_ID": that.retailerDataPdc.DISTRIBUTOR_ID,
                                "RETAILER_ID": that.retailerDataPdc.RETAILER_ID,
                                "PDC_ID": 1,
                                "NAME_OF_BANK": bankName,
                                "CHEQUE_NUMBER": chequeNo,
                                "CREATION_DATE": chngDate,
                                "AMOUNT": amount,
                                "CURR_CODE": currencyCode
                            }
                        ],
                        "userDetails": {
                                "USER_ROLE": "CM",
                                "USER_ID": "darshan.l@intellectbizware.com"
                        }
                    }

                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/pdcCreation";
                    var data = JSON.stringify(oPayload);

                    MessageBox.confirm("Would you like to enter the PDC details ?", {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        initialFocus: sap.m.MessageBox.Action.NO,
                        onClose: function (sButton) {
                            if (sButton === MessageBox.Action.YES) {
                                BusyIndicator.show(0);
                                that.postAjaxs(url,"POST",data,"pdcCreation");
                            } else if (sButton === MessageBox.Action.NO) {
                                // Do something
                            }

                        }
                    });
                }    
            },
            closeDialog:function(oEvent){
                sap.ui.getCore().byId("idBankName").setValue("");
                sap.ui.getCore().byId("idChequeNo").setValue("");
                sap.ui.getCore().byId("idAmount").setValue("");
                sap.ui.getCore().byId("idCurrency").setSelectedKey("");
                sap.ui.getCore().byId("idDateRangeSelection").setValue("");
                sap.ui.getCore().byId("idChequeNo").setValueState("None");
                sap.ui.getCore().byId("idAmount").setValueState("None");

                if(oEvent !== "postPdc"){
                    this.pdcFrag.close();
                }
            },
            onBlockRetailer:function(oEvent){
                var blockRetailerStmt,blockUnblockRetailer,oAction;
                var retailerData = oEvent.getSource().getBindingContext("retailerData").getObject();

                if(retailerData.BLOCKED === "Y"){
                    blockUnblockRetailer = "N";
                    oAction = "UNBLOCK";
                }
                else{
                    blockUnblockRetailer = "Y";
                    oAction = "BLOCK";
                }
                var oPayload =
                    {
                        "Action": oAction,
                        "retailerDetails": [
                            {
                                "DISTRIBUTOR_ID": retailerData.DISTRIBUTOR_ID,
                                "RETAILER_ID":retailerData.RETAILER_ID,
                                "BLOCKED": blockUnblockRetailer
                            
                            }
                        ],
                        "retailerAddress":retailerData.TO_ADDRESS,
                        "retailerAttachments": [
                            {
                                "DISTRIBUTOR_ID": retailerData.DISTRIBUTOR_ID,
                                "RETAILER_ID": retailerData.RETAILER_ID,
                                "FILE_ID": 1,
                                "FILE_CONTENT": retailerData.FILE_CONTENT,
                                "FILE_MIMETYPE": retailerData.FILE_MIMETYPE,
                                "FILE_TYPE": retailerData.FILE_TYPE,
                                "FILE_NAME": retailerData.FILE_NAME
                            }
                        ],
                        "userDetails": {
                            "USER_ROLE": "CM",
                            "USER_ID": "darshan.l@intellectbizware.com"
                    }
                    }

                var url = appModulePath + "/OData/v4/ideal-retailer-registration/registerRetailer";
                var data = JSON.stringify(oPayload);

                if(retailerData.BLOCKED === "Y"){
                    blockRetailerStmt = "Are you sure you want to activate the retailer - ";
                }
                else{
                    blockRetailerStmt = "Are you sure you want to inactivate the retailer - ";
                }
                MessageBox.confirm(blockRetailerStmt + retailerData.RETAILER_NAME +"?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					initialFocus: sap.m.MessageBox.Action.NO,
					onClose: function (sButton) {
						if (sButton === MessageBox.Action.YES) {
                            BusyIndicator.show(0);
                            that.postAjaxs(url,"POST",data,"null");
						} else if (sButton === MessageBox.Action.NO) {
                            BusyIndicator.show(0);
                            that.readData();
						}

					}
				});
            // }
            },
            onEdit:function(oEvent){
                this.handleRefresh("navTypeRefresh");
                var editData = oEvent.getSource().getBindingContext("retailerData").getObject();
                BusyIndicator.show(0);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteEditdetails", {
                    RETAILER_ID: editData.RETAILER_ID
                });
            },
            onPress:function(oEvent){
                this.handleRefresh("navTypeRefresh");
                BusyIndicator.show(0);
                var oSelectedObj = oEvent.getSource().getBindingContext("retailerData").getObject();

                var oModel = new JSONModel(oSelectedObj);
                this.getOwnerComponent().setModel(oModel,"retailerDataModel");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDisplayform", {
                    RETAILER_ID: oSelectedObj.RETAILER_ID
                });
            },
            onSearch:function(oEvent){
                var sQuery = oEvent.getSource().getValue();
                var oTable = this.getView().byId("idProductsTable");
                this.binding = oTable.getBinding("items");

                if (sQuery && sQuery.length > 0) {
                    var oFilter1 = new Filter("RETAILER_NAME", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter2 = new Filter("TO_RETAILER_TYPE/RETAILER_TYPE", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter3 = new Filter("TO_ADDRESS/0/EMAIL_ID", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter4 = new Filter("TO_ADDRESS/0/TO_CITY/CITY_DESC", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter5 = new Filter("RETAILER_ID", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter6 = new Filter("TO_ADDRESS/0/MOBILE_NO", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFil = new sap.ui.model.Filter([oFilter1,oFilter2,oFilter3,oFilter4,oFilter5,oFilter6]);

                    this.binding.filter(oFil, sap.ui.model.FilterType.Application);
                } else {
                    this.binding.filter([]);
                }

            },
            handleRefresh:function(oEvents){
                this.getView().byId("onSearchMasterData").setValue("");
                this.getView().byId("idFilterBtn").setType("Transparent");

                var oRadButton1 = sap.ui.getCore().byId("RB-1");
                var oRadButton2 = sap.ui.getCore().byId("RB-2");

                if(oRadButton1 !== undefined){
                    oRadButton1.setSelected(false);
                }
                if(oRadButton1 !== undefined){
                    oRadButton2.setSelected(false);
                }
                // if(sap.ui.getCore().byId("date_fId")!== undefined){
			    //     sap.ui.getCore().byId("date_fId").setValue("");
                // }
                if (this.filterfrag2) {
                    this.filterfrag2.destroy();
                    this.filterfrag2 = null;
                }
                
                this.getView().byId("idSortBtn").setType("Transparent");

                if (this.filterdialog === true) {
				this._oViewSettingsDialog.clearFilters();
			    }
                if(oEvents !== "navTypeRefresh"){
                BusyIndicator.show(0);
                this.readData();
                }
            },
            handleSort: function (oEvent) {
                if (!this.filterfrag2) {
                    this.filterfrag2 = sap.ui.xmlfragment("com.ibs.ibsappidealviewchange.view.Fragments.Sort", this);
                    this.getView().addDependent(this.filterfrag2);
                }
                this.filterfrag2.open();
            },
            handleSortDialogConfirm: function (oEvent,sFilterReset) {
                var oTable = this.byId("idProductsTable"),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];
    
                if(sFilterReset === undefined){
                    var mParams = oEvent.getParameters();
                    sPath = mParams.sortItem.getKey();
                    bDescending = mParams.sortDescending;
                    }
                else{
                    sPath = sFilterReset.sPath;
                    bDescending = sFilterReset.bDescending;
                }
    
                // sPath = mParams.sortItem.getKey();
                // bDescending = mParams.sortDescending;
                
                if(bDescending === false || sPath !== "RETAILER_ID"){
                    this.getView().byId("idSortBtn").setType("Emphasized");
                } else {
                    this.getView().byId("idSortBtn").setType("Transparent");
                }
                aSorters.push(new Sorter(sPath, bDescending));
    
                // apply the selected sort and group settings
                oBinding.sort(aSorters);
            },
            onFilter : function(oEvent){
                if (!this._oViewSettingsDialog) {
                    this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealviewchange.view.Fragments.filterDialog", this);
                    this.getView().addDependent(this._oViewSettingsDialog);
                }
                this._oViewSettingsDialog.open();
    
                that.filterdialog = true;
            },
            onConfirmViewSettingsDialog: function (oEvent,sType) {
                // var aFilterItems = oEvent.getParameters().filterItems;
                var retailerDataArr = [];
                var mulitipleFilter = [];
                var multipleFields = [];
                var viewSettingDialogKey;
                var oFilterOn = "None";
                var aFilterItems;

                if(sType === "onReadFil"){
                    aFilterItems = oEvent;
                }
                else{
                 aFilterItems = oEvent.getParameters().filterItems;
                }
                // var dateValue = sap.ui.getCore().byId("date_fId");
                var aFilters = [];
                var sFinalString = "";


                var oRButton1 = sap.ui.getCore().byId("RB-1");
                var oActiveButtonSelection1 = oRButton1.mProperties.selected;

                var oRButton2 = sap.ui.getCore().byId("RB-2");
                var oActiveButtonSelection2 = oRButton2.mProperties.selected;

                if (oActiveButtonSelection1 === true) {
                    aFilters = "BLOCKED eq 'Y'";
                    multipleFields.push(aFilters);

                } 
                else if (oActiveButtonSelection2 === true) {
                    aFilters = "BLOCKED eq 'N'";
                    multipleFields.push(aFilters);
                }

                if(aFilterItems.length === 0 && multipleFields.length === 0){
                    // sap.ui.getCore().byId("date_fId").setValue("");
                    this.getView().byId("idFilterBtn").setType("Transparent");
                }
                else{

                aFilterItems.forEach(function (oItem) {
                    oFilterOn = "retailerData";
                    viewSettingDialogKey = oItem.getParent().getProperty("key");
                    var oSelectedKey = oItem.getKey();
                    sFinalString = oSelectedKey;
                    if(sFinalString !== "" && viewSettingDialogKey === "retailerType"){
                        retailerDataArr.push(sFinalString);
                    }
                    else if(sFinalString !== "" &&  viewSettingDialogKey === "status"){
                        oFilterOn = "Status";
                        requestData.push(sFinalString);
                    }
                    // "TO_ADDRESS($filter=SR_NO eq 1 and COUNTRY eq '"+oSelectedKey +"')&$filter=STATUS eq 6";
                });
                
                if(retailerDataArr.length > 0){
                    if(retailerDataArr.length > 1){
                        for(var i=0;i<retailerDataArr.length;i++){
                            mulitipleFilter.push("RETAILER_TYPE eq "+retailerDataArr[i]);
                        }
                        aFilters = "(" + mulitipleFilter.join(" or ") + ")";
                        multipleFields.push(aFilters);
                    }
                    else if(retailerDataArr.length === 1){
                        if(sFinalString !== ""){
                            aFilters = "RETAILER_TYPE eq "+retailerDataArr[0];
                            multipleFields.push(aFilters);
                            // aRequestTypeFilters.push(aFilters);
                        }
                    }
                    // ocountryFilter = aFilters;			
                }
               
                // if (dateValue.getValue()) {
                //     oFilterOn = "Date";
                //     var fDate = dateValue.getDateValue();
                //     // .toISOString().split("T")[0]
                //     var tDate = dateValue.getSecondDateValue();
                //     var gtDate = "(CHANGE_DATE ge " + fDate + ")";
                //     var ltDate = "(CHANGE_DATE le " + tDate + ")";
                //     aFilters = gtDate + " and " + ltDate;
                //     multipleFields.push(aFilters);
                //     // sap.ui.getCore().byId("date_fId").setValue("");
                // }
                if(multipleFields.length > 1){
                    aFilters = multipleFields.join(" and ")
                    oFilterOn = "MultipleFilter";
                }
               
                if(aFilters !== ""){
                    this.getView().byId("idFilterBtn").setType("Emphasized");
                    that.readData(aFilters, "onFilItems");
                }
                }
            },
            onResetViewSetting:function(){
                // this.handleRefresh();
                sap.ui.getCore().byId("RB-1").setSelected(false);
                sap.ui.getCore().byId("RB-2").setSelected(false);
                if (this.filterdialog === true) {
                    this._oViewSettingsDialog.clearFilters();
                }
                this.getView().byId("idFilterBtn").setType("Transparent");
                    BusyIndicator.show(0);
                    this.readData();
            },
            postAjaxs: function (url, type, data, model,sType) {
            
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    data: data,
                    success: function (data, response) {
                    BusyIndicator.hide();
                    if(type === "POST"){
                        if(model === "pdcCreation"){
                            that.closeDialog("postPdc");
                            that.readPdcDetails();
                            MessageBox.success(data.value);
                        }
                        else{
                            MessageBox.success(data.value);
                            that.readData();
                        }
                    }
                    else{
                        if(model === "retailerData"){
                            for(var i=0;i<data.value.length;i++){
                                // Block/Unblock
                                data.value[i].CHANGE_DATE = new Date(data.value[i].CHANGE_DATE);
                            }
                        }
                            var oModel = new JSONModel(data.value);
                            that.getView().setModel(oModel,model);

                            if(that._oViewSettingsDialog !== undefined && sType !== "onFilItems"){
                                var filterItems = [];
                                var listItems = that._oViewSettingsDialog.getFilterItems()[0].mAggregations.items;

                                var result1 = listItems.filter(function (a) {
                                    if(a.getProperty("selected") === true){
                                        return a.getProperty("key");
                                    }
                                }, Object.create(null));

                                if(result1.length > 0){
                                    filterItems = that._oViewSettingsDialog.getFilterItems()[0].getItems();
                                }

                                that.onConfirmViewSettingsDialog(result1,"onReadFil");
                            }

                            if(that.getView().byId("idSortBtn").getType() === "Emphasized"){
                                var oSortFiltersArr = sap.ui.getCore().byId("idSortFragment").getSortItems();
                                var result1 = oSortFiltersArr.filter(function (a) {
                                    if(a.getProperty("selected") === true){
                                        return a.getProperty("key");
                                    }
                                }, Object.create(null));
                
                                var obj = {
                                    "sPath":result1[0].getKey(),
                                    "bDescending":sap.ui.getCore().byId("idSortFragment").getSortDescending()
                                }
                
                                that.handleSortDialogConfirm("null",obj);
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
            onUploadData :function(oEvent){
                this.handleRefresh("navTypeRefresh");
                BusyIndicator.show(0);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteUploadPage");
            }
        });
    });
