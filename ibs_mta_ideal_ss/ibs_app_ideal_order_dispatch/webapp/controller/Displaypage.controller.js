sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
    "com/ibs/ibsappidealorderdispatch/model/formatter",
    "com/ibs/ibsappidealorderdispatch/model/validation",
    "sap/m/MessageBox"
],
function (Controller,JSONModel,BusyIndicator,formatter,validation,MessageBox) {
    "use strict";
    var that,soNo,appModulePath,getKey;

    return Controller.extend("com.ibs.ibsappidealorderdispatch.controller.Displaypage", {
        formatter:formatter,
        onInit: function () {
                that=this;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteDisplaypage").attachMatched(this._onRouteMatched, this);
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
        },
        _onRouteMatched:function(oEvent){
            soNo = oEvent.getParameter("arguments").SO_NO;
            getKey = this.getOwnerComponent().getRouter().getHashChanger().key;
            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerSoHeader?$filter=SO_NO eq '"+soNo+"'";
            this.postAjaxs(url,"GET","null","retailerHeaderModel");
            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerSoItems?$filter=SO_NO eq '"+soNo+"'";
            this.postAjaxs(url,"GET","null","retailerDetailModel");
        },
        onSelect:function(oEvent){
            var getDispatchQtyArr = [];
            var getDetailPageData = this.getOwnerComponent().getModel("retailerDetailModel").getData();

            if(getDetailPageData.length > 0){
                getDispatchQtyArr = getDetailPageData.filter(function (a,index) {
                    if(a["DISPATCH_QTY"] === "NULL" || isNaN(a["DISPATCH_QTY"]) === true ||
                    a["DISPATCH_QTY"] === null || a["DISPATCH_QTY"] === undefined ||
                    Number(a["DISPATCH_QTY"]) === 0){
                    }         
                    else{
                        return a;
                    }       
                }, Object.create(null));

                if(getDispatchQtyArr.length > 0){
                    var onbackObj = {
                        "BACK_INDICATOR": null
                    };
                    var onBackModel = new sap.ui.model.json.JSONModel(onbackObj);
                    that.getOwnerComponent().setModel(onBackModel, "vendorReport");
                    
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    BusyIndicator.show(0);
                    var oModel = new JSONModel(getDispatchQtyArr);
                    this.getOwnerComponent().setModel(oModel,"retailerDetailModel");
                    oRouter.navTo("RouteDispatchpage",{
                        SO_NO:soNo
                    });
                }
                else{
                    MessageBox.error("Please enter dispatch quantity.");
                }
            }
        },
        onBackMaster:function(){
            BusyIndicator.show(0);
            var onbackObj = {
                "BACK_INDICATOR": null,
                "SO_NO":soNo,
                "RETAILER_NAME":this.getOwnerComponent().getModel("retailerHeaderModel").getProperty("/0/RETAILER_NAME"),
                "RETAILER_ID":this.getOwnerComponent().getModel("retailerHeaderModel").getProperty("/0/RETAILER_ID")
            };
            var onBackModel = new sap.ui.model.json.JSONModel(onbackObj);
            that.getOwnerComponent().setModel(onBackModel, "vendorReport");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMasterpage");
        },
        handleQtySelection:function(oEvent){
            that.getSelectedObj = oEvent.getSource().getBindingContext("retailerDetailModel").getObject();

            if(Number(that.getSelectedObj.PENDING_QUANTITY) === 0){
                MessageBox.error("The pending quantity of selected material is 0.");
            }
            else{
                if (!this.QtySelectionFrag) {
                    this.QtySelectionFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealorderdispatch.view.Fragment.QtySelectionFrag", this);
                    this.getView().addDependent(this.QtySelectionFrag);
                }
                this.QtySelectionFrag.open();

                var seletedQtyArr = [];
                that.getSelectedObj.DISPATCH_QTY = Number(that.getSelectedObj.DISPATCH_QTY);
                seletedQtyArr.push(that.getSelectedObj);
                var oModel = new JSONModel(seletedQtyArr);
                this.getView().setModel(oModel,"selectedQtyModel");
                if(sap.ui.getCore().byId("idLogTable").getItems().length > 0){
                    sap.ui.getCore().byId("idLogTable").getItems()[0].getCells()[4].setValueState("None");
                }
            }
        },
        onChangeDispatchQty:function(oEvent){
            var dispatchqQtyVal = validation._dispatchQtyVal(oEvent);
        },
        submitQtyDialog:function(){
            
            var getDispatchQty = this.getView().getModel("selectedQtyModel").getProperty("/0/DISPATCH_QTY");
            var getQty = this.getView().getModel("selectedQtyModel").getProperty("/0/PENDING_QUANTITY");
            // sap.ui.getCore().byId("idDispatchQty").getValue();
            if(getDispatchQty === undefined || getDispatchQty === "" || getDispatchQty === null){
                MessageBox.error("Please enter the dispatch quantity.");
            }
            else if(Number(getDispatchQty) > Number(getQty)){
                MessageBox.error("Please enter dispatch quantity less than pending quantity.");
            }
            // else if(Number(getDispatchQty) === 0){
            //     MessageBox.error("Please enter the dispatch quantity greater than 0.");
            //     this.getView().getModel("selectedQtyModel").setProperty("/0/DISPATCH_QTY",0);
            //     this.getView().getModel("selectedQtyModel").refresh(true);
            // }
            else{
            that.getSelectedObj.DISPATCH_QTY = Number(getDispatchQty).toFixed(2);
            this.getOwnerComponent().getModel("retailerDetailModel").refresh(true);
            this.closeQtyDialog();
            }
        },
        closeQtyDialog:function(){
            this.QtySelectionFrag.close();
        },
        postAjaxs: function (url, type, data, model) {
            // retailerDetailModel;
            var getBackIndicatorStatus = null;
            var getBackIndicator = that.getOwnerComponent().getModel("vendorReport");

            if(getBackIndicator !== undefined){
                getBackIndicatorStatus = getBackIndicator.getProperty("/BACK_INDICATOR");
            }
            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: data,
                success: function (data, response) {
                    
                    BusyIndicator.hide();
                    for(var i=0;i<data.value.length;i++){
                        
                        data.value[i].PENDING_QUANTITY = Number(data.value[i].QUANTITY) - Number(data.value[i].DISPATCH_QUANTITY);
                        
                        if(model === "retailerDetailModel"){
                            // for(var i=0;i<data.value.length;i++){
                                data.value[i].QUANTITY = Number(data.value[i].QUANTITY).toFixed(2);
                                data.value[i].PENDING_QUANTITY = Number(data.value[i].PENDING_QUANTITY).toFixed(2);
                                if(data.value[i].FREE_ITEM === undefined){
                                    data.value[i].FREE_ITEM = Number(0).toFixed(2);
                                }
                                else{
                                    data.value[i].FREE_ITEM = Number(data.value[i].FREE_ITEM).toFixed(2);
                                }
                                // data.value[i].DISPATCH_QTY = Number(data.value[i].DISPATCH_QTY).toFixed(2);
                            // }
                        }

                        var getTblCells = that.getView().byId("idProductsTable").getItems();
                        if(getTblCells.length > 0 && (getKey === "Dispatchpage" && getBackIndicatorStatus === null)){
                            var dispatchQty = that.getView().byId("idProductsTable").getItems()[i].getCells()[3].getProperty("text");
                            data.value[i].DISPATCH_QTY = Number(dispatchQty).toFixed(2);
                        }
                        else{
                            data.value[i].DISPATCH_QTY = Number(0).toFixed(2);
                        }
                    }
                    var oModel = new JSONModel(data.value);
                    that.getView().setModel(oModel,model);
                    that.getOwnerComponent().setModel(oModel,model);
                },
                error:function(error){
                    BusyIndicator.hide();
                        var oXMLMsg, oXML;
                        if (that.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
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
        }
    });
});
