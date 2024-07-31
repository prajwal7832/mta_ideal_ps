// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealretailerinvoice.controller.Masterpage", {
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
    var appModulePath,that

    return Controller.extend("com.ibs.ibsappidealretailerinvoice.controller.Masterpage", {
        formatter:formatter,
        onInit: function () {
            that = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteMasterpage").attachMatched(this._onRouteMatched, this);
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);
            
        },
        _onRouteMatched:function(oEvent){
            this.getView().byId("idStartDate").setMaxDate(new Date());
            this.getView().byId("idEndDate").setMaxDate(new Date());

            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerDeliveryItem";
            this.postAjaxs(url,"GET","null","invoiceDetailModel");

            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerDeliveryHeader";
            this.postAjaxs(url,"GET","null","OrgForReceipt");

            var url = appModulePath + "/odata/v4/ideal-retailer-registration/RetailerAddressDetail";
            this.postAjaxs(url,"GET","null","retailerAddressDetail");
            
            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerInvoiceHeader";
            this.postAjaxs(url,"GET","null","retailerModel","onLoad");
        },
        onSelectGo:function(){
            var aFilter = [];
            var sFlag = true;
            var getStartDate = this.getView().byId("idStartDate").getValue();
            var getEndDate = this.getView().byId("idEndDate").getValue();
            var getInvoiceVal = this.getView().byId("idInvoice").getValue();
            var getRetailerVal = this.getView().byId("idRetailer").getValue();

            if(getStartDate === "" && getEndDate === "" && getInvoiceVal === "" && getRetailerVal === ""){
                // MessageBox.error("Please select atleast one filter");
            }
            else{
                if(getStartDate !== ""){
                    var getFullYear = new Date(getStartDate).getFullYear();
                    var getMonth = new Date(getStartDate).getMonth() + 1;
                    if(String(getMonth).length === 1){
                        getMonth = "0"+getMonth;
                    }
                    var getDay = new Date(getStartDate).getDate();
                    if(String(getDay).length === 1){
                        getDay = "0"+getDay;
                    }
                    var DateFormateUrl = getFullYear+"-"+getMonth+"-"+getDay;
                    aFilter.push("CREATION_DATE ge "+DateFormateUrl);
                    // new Date(getStartDate).toISOString().split("T")[0]);
                }
                if(getEndDate !== ""){
                    if(getStartDate === ""){
                        this.getView().byId("idEndDate").setValue("");
                        MessageBox.error("Please select Start Date");
                    }
                    else if(new Date(getStartDate) > new Date(getEndDate)){
                        sFlag = false;
                        MessageBox.error("End date should be after the Start date.");
                        this.getView().byId("idEndDate").setValue("");
                    }
                    else{
                        var getEndDteYear = new Date(getEndDate).getFullYear();
                        var getEndDteMonth = new Date(getEndDate).getMonth() + 1;
                        if(String(getEndDteMonth).length === 1){
                            getEndDteMonth = "0"+getEndDteMonth;
                        }
                        var getEndDteDay = new Date(getEndDate).getDate();
                        if(String(getEndDteDay).length === 1){
                            getEndDteDay = "0"+getEndDteDay;
                        }
                        var DateFormateUrl = getEndDteYear+"-"+getEndDteMonth+"-"+getEndDteDay;
                        aFilter.push("CREATION_DATE le "+DateFormateUrl);

                        // aFilter.push("CREATION_DATE le "+new Date(getEndDate).toISOString().split("T")[0]);
                    }
                }
                if(getInvoiceVal !== ""){
                    aFilter.push("INVOICE_NO eq '"+getInvoiceVal+"'");
                }
                if(getRetailerVal !== ""){
                    getRetailerVal = getRetailerVal.split("(")[1].split(")")[0];
                    aFilter.push("RETAILER_ID eq '"+getRetailerVal+"'");
                }
            }

            if(aFilter.length > 0 && sFlag === true){
                BusyIndicator.show(0);
                var Filters = aFilter.join(" and ");
                var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerInvoiceHeader?$filter="+Filters;
                this.postAjaxs(url,"GET","null","retailerModel");
            }
        },
        handleRefresh:function(){
            this.getView().byId("idStartDate").setMaxDate(new Date());
            this.getView().byId("idEndDate").setMaxDate(new Date());
            this.getView().byId("idRetailer").setValue("");
            this.getView().byId("idInvoice").setValue("");
            this.getView().byId("idStartDate").setValue("");
            this.getView().byId("idEndDate").setValue("");
            BusyIndicator.show(0);
            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerInvoiceHeader";
            this.postAjaxs(url,"GET","null","retailerModel","onLoad");
        },
        onPrint: function (oEvent) {
            var getInvoiceNo = oEvent.getSource().getBindingContext("retailerModel").getObject().INVOICE_NO;
            var getDeliveryNo = oEvent.getSource().getBindingContext("retailerModel").getObject().DELIVERY_NO;
            var getRetailerId = oEvent.getSource().getBindingContext("retailerModel").getObject().RETAILER_ID;
            // var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            // var appPath = appId.replaceAll(".", "/");
            // var appModulePath = jQuery.sap.getModulePath(appPath);

            var getInvoiceItemData = this.getView().getModel("invoiceDetailModel").getData();
            var getOrgReceiptData = this.getView().getModel("OrgForReceipt").getData();
            var getRetailerAddress = this.getView().getModel("retailerAddressDetail").getData();
            var tabledata = this.getView().getModel("retailerModel").getData();

            var getTableInfo = tabledata.filter(function (a,index) {
                if(a["RETAILER_ID"] === getRetailerId && a["INVOICE_NO"] === getInvoiceNo){
                    return a; 
                }                
            }, Object.create(null));
            
            var getInvoiceItemDataArr = getInvoiceItemData.filter(function (a,index) {
                if(a["DELIVERY_NO"] === getDeliveryNo){
                    return a; 
                }                
            }, Object.create(null));

            var getOrgReceiptDataArr = getOrgReceiptData.filter(function (a,index) {
                if(a["RETAILER_ID"] === getRetailerId && a["DELIVERY_NO"] === getDeliveryNo){
                    return a; 
                }                
            }, Object.create(null));

            var getRetailerAddressArr = getRetailerAddress.filter(function (a,index) {
                if(a["RETAILER_ID"] === getRetailerId && a["ADDRESS_TYPE"] === "SHP_ADDR"){
                    return a; 
                }                
            }, Object.create(null));

            // var surl = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerInvoiceHeader";
            var headerData = this.getView().getModel("retailerModel").getData();
            sessionStorage.setItem("info", JSON.stringify(getTableInfo));
            sessionStorage.setItem("orgReceipt", JSON.stringify(getOrgReceiptDataArr));
            sessionStorage.setItem("placeOfSupply", JSON.stringify(getRetailerAddressArr));
            sessionStorage.setItem("invoiceDetail", JSON.stringify(getInvoiceItemDataArr));
            // window.open("https://port8080-workspaces-ws-f2dfm.us10.applicationstudio.cloud.sap/print.html?PR_NO="  + prno )
            window.open(appModulePath + "/print.html?INVOICE_NO=" + getInvoiceNo);
            // window.open( surl + "/print.html?PR_NO=" + prno);
        },
        postAjaxs: function (url, type, data, model,sType) {
            var getPaymentsData;
            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: data,
                success: function (data, response) {
                    BusyIndicator.hide();
                if(model === "retailerModel"){
                    for(var i=0;i<data.value.length;i++){
                        data.value[i].INVOICE_DATE = new Date(data.value[i].CREATION_DATE)
                    }
                    var oModel = new JSONModel(data.value);
                    that.getView().setModel(oModel,model);

                    if(model === "retailerModel" && sType === "onLoad"){
                        var getRetailerDataArr = [];
                        var Data = data.value;
                        for(var i=0;i<Data.length;i++){
                            if(!that[Data[i].RETAILER_ID]){
                                getRetailerDataArr.push(Data[i]);
                                that[Data[i].RETAILER_ID] = true;
                            }
                        }
                        var oModel = new JSONModel(getRetailerDataArr);
                        that.getView().setModel(oModel,"retailerModelFrag");

                        var invoiceModel = new JSONModel(Data);
                        that.getView().setModel(invoiceModel,"invoiceModelFrag");
                    }
                }
                else{
                    var oModel = new JSONModel(data.value);
                    that.getView().setModel(oModel,model);
                }
                },
                error:function(error){
                    BusyIndicator.hide();
                    var oXMLMsg, oXML;
                    if (that.isValidJsonString(error.responseText)) {
                        oXML = JSON.parse(error.responseText);
                        if(oXML.error["code"] === "400"){
                            oXMLMsg = oXML.error["message"]
                        }
                        else{
                            oXMLMsg = oXML.error["message"].message;
                        }
                    } else {
                        oXMLMsg = error.responseText;
                    }

                    MessageBox.error(oXMLMsg);
                }
            })
        },
        onRetailerFrag:function(){
            if (!this.retailerFrag) {
                this.retailerFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealretailerinvoice.view.Fragment.retailerDialog", this);
                this.getView().addDependent(this.retailerFrag);
            }

            this.retailerFrag.open();
            sap.ui.getCore().byId("retailerSrchId").setValue("");
            if(sap.ui.getCore().byId("retailer_listId").getBinding("items") !== undefined){
                sap.ui.getCore().byId("retailer_listId").getBinding("items").filter();
            }
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
        handleRetailerSelection:function(oEvent){
            
            var getSelectedObj = oEvent.getSource().getSelectedItem().getBindingContext("retailerModelFrag").getObject();
            var getRetailerId = oEvent.getSource().getSelectedItem().getBindingContext("retailerModelFrag").getProperty("RETAILER_ID");
            var getRetailerName = oEvent.getSource().getSelectedItem().getBindingContext("retailerModelFrag").getProperty("RETAILER_NAME");
            
            this.getView().byId("idRetailer").setValue(getRetailerName+"("+getRetailerId+")");
            // this.readPayments(getRetailerId);
            oEvent.getSource().removeSelections(true);
            this.retailerDialogClose();
        },
        retailerDialogClose:function(){
            this.retailerFrag.close();
        },
        onInvoiceFrag:function(){
            if (!this.invoiceFrag) {
                this.invoiceFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealretailerinvoice.view.Fragment.invoiceFrag", this);
                this.getView().addDependent(this.invoiceFrag);
            }

            this.invoiceFrag.open();
            sap.ui.getCore().byId("invoiceSrchId").setValue("");
            if(sap.ui.getCore().byId("invoice_listId").getBinding("items") !== undefined){
                sap.ui.getCore().byId("invoice_listId").getBinding("items").filter();
            }
            
        },
        handleInvoiceSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var pFilter = [];
            var oFilter = new Filter();
            if (sQuery) {
                    oFilter = new Filter([
                        new Filter("INVOICE_NO", sap.ui.model.FilterOperator.Contains, sQuery)
                    ], false);
            }
            pFilter.push(oFilter);
            var listItem = sap.ui.getCore().byId("invoice_listId");
            var item = listItem.getBinding("items");
            item.filter(pFilter);
        },
        handleInvoiceSelection:function(oEvent){
            var getSelectedObj = oEvent.getSource().getSelectedItem().getBindingContext("invoiceModelFrag").getObject();
            var getInvoiceNo = oEvent.getSource().getSelectedItem().getBindingContext("invoiceModelFrag").getProperty("INVOICE_NO");
            
            this.getView().byId("idInvoice").setValue(getInvoiceNo);
            // this.readPayments(getRetailerId);
            oEvent.getSource().removeSelections(true);
            this.invoiceDialogClose();
        },
        invoiceDialogClose:function(){
            this.invoiceFrag.close();
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
