// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealretailerpayment.controller.MasterPage", {
//         onInit: function () {

//         }
//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../model/formatter",
    "sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter"
],
function (Controller,JSONModel,MessageBox,formatter,BusyIndicator,Filter) {
    "use strict";
    var that,appModulePath,getRetailerId;
    var getItemsFillArr2 = [];
    var getItemsFillArr3 = [];

    return Controller.extend("com.ibs.ibsappidealretailerpayment.controller.Masterpage", {
        formatter:formatter,
        onInit: function () {
            that = this;
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteMasterpage").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched:function(oEvent){
            BusyIndicator.show(0);
            this.getView().byId("idDateRangeSelection").setMaxDate(new Date());

            this.getView().byId("idOutstandingAmt").setVisible(false);

            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerInvoiceHeader?$filter=PAYMENT_STATUS eq 1 and GROSS_TOTAL ne null";
            this.postAjaxs(url,"GET","null","retailerModel");

            that.getView().byId("oSearchMasterData").setVisible(false);
        },
        onRetailerFrag:function(){
            if (!this.retailerFrag) {
                this.retailerFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealretailerpayment.view.Fragment.retailerDialog", this);
                this.getView().addDependent(this.retailerFrag);
            }

            this.retailerFrag.open();
            sap.ui.getCore().byId("retailerSrchId").setValue("");
            if(sap.ui.getCore().byId("retailer_listId").getBinding("items") !== undefined){
                sap.ui.getCore().byId("retailer_listId").getBinding("items").filter();
            }
        },
        handleRetailerSelection:function(oEvent){
            
            var getSelectedObj = oEvent.getSource().getSelectedItem().getBindingContext("retailerModel").getObject();
            getRetailerId = oEvent.getSource().getSelectedItem().getBindingContext("retailerModel").getProperty("RETAILER_ID");
            var getRetailerName = oEvent.getSource().getSelectedItem().getBindingContext("retailerModel").getProperty("RETAILER_NAME");
            
            BusyIndicator.show(0);
            
            this.getView().byId("retailerId").setValue(getRetailerName);
            this.readPayments(getRetailerId);
            oEvent.getSource().removeSelections(true);
            this.retailerDialogClose();
        },
        onSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var oTable = this.getView().byId("idProductsTable");
            this.binding = oTable.getBinding("items");
           
            if (sQuery && sQuery.length > 0) {
                    var oFilter = new Filter([
                        new Filter("INVOICE_NO", sap.ui.model.FilterOperator.Contains, sQuery)
                    ], false);
                    var oFil = new sap.ui.model.Filter([oFilter]);

                    this.binding.filter(oFil, sap.ui.model.FilterType.Application);
                } 
                else {
                    this.binding.filter([]);
                }
        },
        handleRefresh:function(){
            var getTblData = this.getView().getModel("retailerPaymentModel");
            that.getView().byId("oSearchMasterData").setVisible(false);
            that.getView().byId("idHeaderTollbar").setVisible(false);
            this.getView().byId("retailerId").setValue("");
            this.getView().byId("idOutstandingAmt").setVisible(false);
            this.getView().byId("oSearchMasterData").setValue("");
            this.getView().byId("page").setShowFooter(false);

            var getTblData = this.getView().byId("idProductsTable").getItems();

            for(var i=0;i<getTblData.length;i++){
                this.getView().byId("idProductsTable").getItems()[i].removeStyleClass("highlightedRow");
            }
            
            // that = this;
            // var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerInvoiceHeader";
            // this.postAjaxs(url,"GET","null","retailerModel");

            if(getTblData === undefined){

            }
            else{
                this.getView().getModel("retailerPaymentModel").setData(null);
            }
        },
        retailerDialogClose:function(){
            sap.ui.getCore().byId("retailerSrchId").setValue("");
            this.retailerFrag.close();
        },
        readPayments:function(retailerId){
            var url = appModulePath + "/odata/v2/retailer-payment/Retailer_Payments";

            $.ajax({
                url: url,
                contentType: 'application/json',
                type:'GET',
                success: function (data, response) {
                    var Data = data.d.results;
                    var oModel = new JSONModel(Data);
                    that.getView().setModel(oModel,"retailerTransactionData");
                    var url = appModulePath + "/odata/v2/ideal-retailer-dispatch/RetailerInvoiceHeader?$filter=RETAILER_ID eq '"+retailerId+"' and PAYMENT_STATUS eq 1 and GROSS_TOTAL ne null";
                    that.postAjaxs(url,"GET",null,"retailerPaymentModel");
                },
                error:function(error){
                    
                    BusyIndicator.hide();
                    var oXMLMsg, oXML;
                    if (that.isValidJsonString(error.responseText)) {
                        oXML = JSON.parse(error.responseText);
                        oXMLMsg = oXML.error["message"].value;
                    } else {
                        oXMLMsg = error.responseText;
                    }

                    MessageBox.error(oXMLMsg);
                }
            })

        },
        handleRetailerSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var pFilter = [];
            var oFilter = new Filter();
            if (sQuery) {
                    oFilter = new Filter([
                        new Filter("RETAILER_ID", sap.ui.model.FilterOperator.Contains, sQuery),
                        new Filter("RETAILER_NAME", sap.ui.model.FilterOperator.Contains, sQuery)
                    ], false);
            }
            pFilter.push(oFilter);
            var listItem = sap.ui.getCore().byId("retailer_listId");
            var item = listItem.getBinding("items");
            item.filter(pFilter);
        },
        postAjaxs: function (url, type, data, model) {
            var getPaymentsData;
            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: data,
                success: function (data, response) {
                    BusyIndicator.hide();
                    var outstandingBal = 0;
                    if(type === "GET" && model === "retailerPaymentModel"){
                        getPaymentsData = that.getView().getModel("retailerTransactionData").getData();
                        var Data = data.d.results;
                        if(Data.length > 0){
                            for(var i=0;i<Data.length;i++){

                                var yourAmount = 0;
                                var getRetailerPayArr = getPaymentsData.filter(function (a,index) {
                                    if(Data[i].INVOICE_NO === a["INVOICE_NO"]){ 
                                        yourAmount = Number(yourAmount) + Number(a["YOUR_AMOUNT"]);
                                    }             
                                    else{
                                        return true;
                                    }   
                                }, Object.create(null));

                                Data[i].INVOICE_DATE = new Date(Number(Data[i].CREATION_DATE.match(/\d+/)[0]));
                                Data[i].INVOICE_NO = String(Data[i].INVOICE_NO);
                                Data[i].RETAILER_AMOUNT = 0;
                                Data[i].TRANSACTION_ID = null;
                                Data[i].BANK_NAME = null;
                                Data[i].DEPOSIT_DATE = null;
                                Data[i].GROSS_TOTAL = Number(Data[i].GROSS_TOTAL).toFixed(2);
                                // Data[i].INVOICE_BAL_AMOUNT = Number(Data[i].INVOICE_BAL_AMOUNT);
                                
                                Data[i].INVOICE_BAL_AMOUNT = Number(Number(Data[i].GROSS_TOTAL) - Number(yourAmount)).toFixed(2);
                                Data[i].BAL_AMOUNT = Number(Number(Data[i].GROSS_TOTAL) - Number(yourAmount)).toFixed(2);

                                outstandingBal = Number(outstandingBal) + Number(Data[i].BAL_AMOUNT);
                                outstandingBal = Number(outstandingBal).toFixed(2);
                               
                                that.getView().byId("idOutstandingAmt").setVisible(true);
                                that.getView().byId("idHeaderTollbar").setVisible(true);
                                that.getView().byId("oSearchMasterData").setVisible(true);
                                that.getView().byId("page").setShowFooter(true);
                            }
                            
                            var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                                pattern: "#,##,##0.00"
                            });

                            outstandingBal = oNumberFormat.format(outstandingBal);
                            that.getView().byId("idOutstandingAmt").setText("Outstanding Amount : "+ outstandingBal+" INR");
                        }
                        else{
                            that.getView().byId("idOutstandingAmt").setVisible(false);
                            that.getView().byId("idHeaderTollbar").setVisible(false);
                            that.getView().byId("oSearchMasterData").setVisible(false);
                            that.getView().byId("page").setShowFooter(false);
                        }
                            var oModel = new JSONModel(Data);
                            that.getView().setModel(oModel,model);
                    }
                    else if(type === "GET" && model === "retailerModel"){
                        // that = this;
                        var Data = data.value;
                        var getRetailerDataArr = [];
                        
                        for(var i=0;i<Data.length;i++){
                            if(!that[Data[i].RETAILER_ID]){
                                getRetailerDataArr.push(Data[i]);
                                that[Data[i].RETAILER_ID] = true;
                            }
                        }
                        
                        var oModel = new JSONModel(getRetailerDataArr);
                        that.getView().setModel(oModel,model);
                    }
                    // else if(type === "GET" && model === "retailerTransModel"){
                    //     var Data = data.d.results;
                    //     var oModel = new JSONModel(Data);
                    //     that.getView().setModel(oModel,model);
                    // }
                    else{
                        BusyIndicator.show(0);
                        MessageBox.success(data.d.retailerPayments);
                        that.readPayments(getRetailerId);
                        // var url = appModulePath + "/odata/v2/ideal-retailer-dispatch/RetailerInvoiceHeader?$filter=RETAILER_ID eq '"+getRetailerId+"'";
                        // that.postAjaxs(url,"GET","null","retailerPaymentModel");
                    }
                },
                error:function(error){
                    BusyIndicator.hide();
                    var oXMLMsg, oXML;
                    if (that.isValidJsonString(error.responseText)) {
                        oXML = JSON.parse(error.responseText);
                        oXMLMsg = oXML.error["message"].value;
                    } else {
                        oXMLMsg = error.responseText;
                    }

                    MessageBox.error(oXMLMsg);
                }
            })
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
         onChangeRetailerAmt2:function(oEvent){
            var getValue = oEvent.getSource().getValue();
            var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                pattern: "#,##,##0.00"
            });
            oEvent.getSource().setValue(oNumberFormat.format(getValue));
            oEvent.getSource().setValueState(sap.ui.core.ValueState.None).setValueStateText("");
        },
        onChangeRetailerAmt:function(oEvent){
            var getAmount = Number(oEvent.getSource().getValue()).toFixed(2);
            var index = Number(oEvent.getSource().getBindingContext("retailerPaymentModel").getPath().split("/")[1]);

            oEvent.getSource().setValue(getAmount);
            var getSelectObj = oEvent.getSource().getBindingContext("retailerPaymentModel").getObject();

            if(getAmount > Number(getSelectObj.BAL_AMOUNT) || String(getAmount).includes("-")){
                MessageBox.error("Please enter the amount less than invoice balance amount");
                oEvent.getSource().setValue(0);
                getSelectObj.INVOICE_BAL_AMOUNT = Number(getSelectObj.BAL_AMOUNT).toFixed(2);
            }
            else if(getAmount > 0){
                getSelectObj.INVOICE_BAL_AMOUNT = Number(Number(getSelectObj.BAL_AMOUNT) - Number(getAmount)).toFixed(2);
               
                oEvent.getSource().setValue(getAmount);
            }
            else if(Number(getAmount) === 0){
                getSelectObj.INVOICE_BAL_AMOUNT = Number(Number(getSelectObj.BAL_AMOUNT) - Number(getAmount)).toFixed(2);
               
                oEvent.getSource().setValue(Number(getAmount));
                var getHighlightedRow = that.getView().byId("idProductsTable").getItems()[Number(index)].toggleStyleClass("mCustomStyleClassMap").mCustomStyleClassMap.highlightedRow;

                if(getHighlightedRow === undefined){
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.None).setValueStateText("");
                }
                else{
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter amount");
                }
            }
            // this.getView().getModel("retailerPaymentModel").refresh(true);
        },
        onChangeTransId:function(oEvent){
            var getPostTransData = this.getView().getModel("retailerTransactionData").getData();
            var oSource = oEvent.getSource();
            var getValueIndex = Number(oSource.getBindingContext("retailerPaymentModel").getPath().split("/")[1]);
            var getValue = oSource.getValue();
            oSource.setValue(String(getValue).toUpperCase());

            var reg = /^[A-Za-z0-9? ,_-]+$/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
                
                // var getValueIndex = Number(oSource.getBindingContext("retailerPaymentModel").getPath().split("/")[1]);
                // var getTblData = that.getView().getModel("retailerPaymentModel").getData();
                
                // var getValue = oSource.getValue();
                // var getDupTransId = getPostTransData.filter(function (a,index) {
                //     if(a["TRANSACTION_ID"] === getValue){ 
                //         return a;
                //     }             
                             
                //     }, Object.create(null));

                // if(getDupTransId.length === 0 && getTblData.length > 1){
                //     var getDupTransIdTbl = getTblData.filter(function (a,index) {
                //         if(a["TRANSACTION_ID"] === getValue && index !== getValueIndex){ 
                //                     // return a;
                //             oSource.setValue("");
                //             MessageBox.error("Invalid Transaction ID");
                //             //  MessageBox.information("The Transaction ID "+getValue+" is already exists.");
                //         }    
                //         }, Object.create(null));
                //     }
                // else if(getDupTransId.length > 0){
                //     oSource.setValue("");
                //     MessageBox.error("Invalid Transaction ID");
                    // MessageBox.information("The Transaction ID "+getValue+" is already exists.");
                // }
                } else if(getValue !== "") {
                    oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed.");
                    oSource.setValue("");
                }
        },
        handleBankName:function(oEvent){
            var oSource = oEvent.getSource();
            var reg = /^[A-Za-z? ,_-]+$/.test(oSource.getValue());
			if (reg === true) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue(null);
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter only alphabets.");
			}
        },
        onChangeDate:function(oEvent){
            oEvent.getSource().setValueState(sap.ui.core.ValueState.None).setValueStateText("");
        },
        onRetailerDataFetch:function(){
            var getItemsFillArr = [];
            getItemsFillArr2 = [];
            var getRetailerPaymentArr = [];
            var getRetailerEvent = [];
            // getItemsFillArr2 = [];
            getItemsFillArr3 = [];
            var getRetailerPayData = this.getView().getModel("retailerPaymentModel").getData();

            var oDateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy", strictParsing: true });
            var getRetailerPayArr = getRetailerPayData.filter(function (a,index) {
                getItemsFillArr = [];
                if(a["RETAILER_AMOUNT"] === "" || a["RETAILER_AMOUNT"] === null ||
                 a["RETAILER_AMOUNT"] === undefined || a["RETAILER_AMOUNT"] === 0
                 || a["TRANSACTION_ID"] === "" || a["TRANSACTION_ID"] === null || a["TRANSACTION_ID"] === undefined ||
                    a["TRANSACTION_ID"] === 0 
                 || a["DEPOSIT_DATE"] === "" || a["DEPOSIT_DATE"] === null || a["DEPOSIT_DATE"] === undefined  || 
                 oDateFormatter.parse(a["DEPOSIT_DATE"]) === null
                 || a["BANK_NAME"] === "" || a["BANK_NAME"] === null || a["BANK_NAME"] === undefined){
                        if(a["RETAILER_AMOUNT"] === "" || Number(a["RETAILER_AMOUNT"]) === 0 ||
                        (a["RETAILER_AMOUNT"] === null)){
                            getItemsFillArr2.push("4/Please enter amount/"+index);
                        }
                        else{
                            getItemsFillArr.push(a["RETAILER_AMOUNT"]);
                            getItemsFillArr3.push("4/None/"+index);
                        } 
                        if(a["TRANSACTION_ID"] === "" || Number(a["TRANSACTION_ID"]) === 0 ||
                            a["TRANSACTION_ID"] === null){
                                getItemsFillArr2.push("6/Please enter Transaction ID/"+index);
                        }
                        else{
                            getItemsFillArr.push(a["TRANSACTION_ID"]);
                            getItemsFillArr3.push("6/None/"+index);
                        }
                        if(a["DEPOSIT_DATE"] === "" || a["DEPOSIT_DATE"] === null){
                            getItemsFillArr2.push("7/Please enter deposit date/"+index);
                        }
                        else if(oDateFormatter.parse(a["DEPOSIT_DATE"]) === null){
                            getItemsFillArr.push(a["DEPOSIT_DATE"]);
                            getItemsFillArr2.push("7/Please enter valid deposit date/"+index);
                        }
                        else{
                            getItemsFillArr.push(a["DEPOSIT_DATE"]);
                            getItemsFillArr3.push("7/None/"+index);
                        }
                        if(a["BANK_NAME"] === "" || a["BANK_NAME"] === null){ 
                            getItemsFillArr2.push("5/Please enter bank name/"+index);
                        }
                        else{
                            getItemsFillArr.push(a["BANK_NAME"]);
                            getItemsFillArr3.push("5/None/"+index);
                        }

                        getRetailerPayData.filter(function (a,index) {
                        if((a["RETAILER_AMOUNT"] === "" || a["RETAILER_AMOUNT"] === null ||
                            a["RETAILER_AMOUNT"] === undefined || Number(a["RETAILER_AMOUNT"]) === 0)
                            && (a["TRANSACTION_ID"] === "" || a["TRANSACTION_ID"] === null 
                            || a["TRANSACTION_ID"] === undefined || Number(a["TRANSACTION_ID"]) === 0)
                            && (a["DEPOSIT_DATE"] === "" || a["DEPOSIT_DATE"] === null || a["DEPOSIT_DATE"] === undefined)
                            && (a["BANK_NAME"] === "" || a["BANK_NAME"] === null || a["BANK_NAME"] === undefined)){
                                    that.getView().byId("idProductsTable").getItems()[Number(index)].removeStyleClass("highlightedRow");
                                    for(var i=4;i<8;i++){
                                    that.getView().byId("idProductsTable").getItems()[Number(index)].getCells()[i].setValueState("None");
                                    that.getView().byId("idProductsTable").getItems()[Number(index)].getCells()[i].setValueStateText();
                                    }
                            }
                        });

                        if(getItemsFillArr.length > 0 && getItemsFillArr.length < 4){
                            that.getView().byId("idProductsTable").getItems()[Number(index)].addStyleClass("highlightedRow");

                            for(var i=0;i<getItemsFillArr2.length;i++){
                                var getCellCount = Number(getItemsFillArr2[i].split("/")[0]);
                                var getCellVal = getItemsFillArr2[i].split("/")[1];
                                var getIndex = getItemsFillArr2[i].split("/")[2];
                                that.getView().byId("idProductsTable").getItems()[Number(getIndex)].getCells()[getCellCount].setValueState("Error");
                                that.getView().byId("idProductsTable").getItems()[Number(getIndex)].getCells()[getCellCount].setValueStateText(getCellVal);
                            }
                        }
                            for(var i=0;i<getItemsFillArr3.length;i++){
                                var getCellCount = Number(getItemsFillArr3[i].split("/")[0]);
                                var getCellVal = getItemsFillArr3[i].split("/")[1];
                                var getIndex = getItemsFillArr3[i].split("/")[2];
                                that.getView().byId("idProductsTable").getItems()[Number(getIndex)].getCells()[getCellCount].setValueState("None");
                                that.getView().byId("idProductsTable").getItems()[Number(getIndex)].getCells()[getCellCount].setValueStateText("");
                            }
                }             
                else{
                    that.getView().byId("idProductsTable").getItems()[Number(index)].removeStyleClass("highlightedRow");
                    // for(var i=0;i<getItemsFillArr2.length;i++){
                    //     var getCellCount = Number(getItemsFillArr2[i].split("/")[0]);
                    //     var getCellVal = getItemsFillArr2[i].split("/")[1];
                    //     that.getView().byId("idProductsTable").getItems()[Number(index)].getCells()[getCellCount].setValueState("None");
                    //     that.getView().byId("idProductsTable").getItems()[Number(index)].getCells()[getCellCount].setValueStateText();
                    // }
                    return true;
                }   
            }, Object.create(null));

            // var getIncompletItemArr = getRetailerPayData.filter(function (a,index) {
            //     if(a["RETAILER_AMOUNT"] !== "" || a["TRANSACTION_ID"] !== "" || Number(a["TRANSACTION_ID"]) !== 0 
            //      || a["DEPOSIT_DATE"] !== ""|| a["BANK_NAME"] !== "" ){ 
            //         this.getView().byId("idProductsTable").getItems()[Number(index)].addStyleClass("highlightedRow");
            //     }             
            //     else{
            //         return true;
            //     }   
            // }, Object.create(null));

            if(getRetailerPayArr.length > 0){

                for(var i=0;i<getRetailerPayArr.length;i++){
                    
                    var getRetailerPaymentObj = {
                        "SRNO":1,
                        "DISTRIBUTOR_ID": getRetailerPayArr[i].DISTRIBUTOR_ID,
                        "SO_NO": getRetailerPayArr[i].SO_NO,
                        "RETAILER_ID": getRetailerPayArr[i].RETAILER_ID,
                        "DELIVERY_NO": getRetailerPayArr[i].DELIVERY_NO,
                        "INVOICE_NO": getRetailerPayArr[i].INVOICE_NO,
                        "INVOICE_DATE": new Date(getRetailerPayArr[i].INVOICE_DATE).toISOString().split("T")[0],
                        "INVOICE_AMOUNT": String(getRetailerPayArr[i].GROSS_TOTAL),
                        "INVOICE_BAL_AMOUNT": String(getRetailerPayArr[i].INVOICE_BAL_AMOUNT),
                        "OUTSTANDING_AMOUNT": String(this.getView().byId("idOutstandingAmt").getText().split(": ")[1]),
                        "YOUR_AMOUNT": String(getRetailerPayArr[i].RETAILER_AMOUNT),
                        "BANK_NAME": getRetailerPayArr[i].BANK_NAME,
                        "TRANSACTION_ID": String(getRetailerPayArr[i].TRANSACTION_ID),
                        "DEPOSIT_DATE": new Date(getRetailerPayArr[i].DEPOSIT_DATE).toISOString().split("T")[0],
                        "PAYMENT_STATUS": 1
                    }
                    getRetailerPaymentArr.push(getRetailerPaymentObj);

                     var getRetailerEventObj =  {
                        "SR_NO": 1,
                        "SO_NO": getRetailerPayArr[i].SO_NO,
                        "INVOICE_NO": getRetailerPayArr[i].INVOICE_NO,
                        "DELIVERY_NO": getRetailerPayArr[i].DELIVERY_NO,
                        "USER_ID": "ABC",
                        "USER_NAME": "ABC",
                        "USER_ROLE": "ABC",
                        "COMMENT": "XYZ",
                        "CREATED_ON": new Date()
                        // .toISOString().split("T")[0]
                    }
                    getRetailerEvent.push(getRetailerEventObj);
                }
                var oPayload = {
                    "appType": "RG",
                    "retailerPayment":getRetailerPaymentArr,
                    "paymentEvent": getRetailerEvent
                }

                var url = appModulePath + "/odata/v2/retailer-payment/retailerPayments";
                var data = JSON.stringify(oPayload);
                var stmt = "Do you want to Submit";
                // "Ensure that all mandatory fields are filled for a specific invoice number";
                // var stmt = "Make sure that all mandatory fields are inserted.";
                // to all required fields are inserted. All other fields should remain unchanged."
                MessageBox.confirm(stmt, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    initialFocus: sap.m.MessageBox.Action.NO,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.YES) {
                            BusyIndicator.show(0);
                            that.postAjaxs(url, "POST", data, "null");
                        } else if (sButton === MessageBox.Action.NO) {
                            // do nothing
                        }

                    }
                });
                
            }
            else{
                MessageBox.error("Please enter atleast one retailer payment details for submission");
            }
        }
    });
});

