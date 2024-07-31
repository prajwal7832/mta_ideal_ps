// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealorderdispatch.controller.Masterpage", {
//         onInit: function () {

//         }
//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
    "../model/formatter",
	"sap/ui/model/Filter",
    "sap/m/MessageBox"
],
function (Controller,BusyIndicator,JSONModel,formatter,Filter,MessageBox) {
    "use strict";
    var that,appModulePath;

    return Controller.extend("com.ibs.ibsappidealorderdispatch.controller.Masterpage", {
        formatter:formatter,
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteMasterpage").attachMatched(this._onRouteMatched, this);
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);
            
        },
        _onRouteMatched:function(oEvent){
            that = this;
            var onBackModel = this.getOwnerComponent().getModel("vendorReport");
			if (onBackModel === undefined || onBackModel === null || onBackModel === "") {
				// var backIndicator = onBackModel.getData().BACK_INDICATOR;
			}
            else if(onBackModel.getData().BACK_INDICATOR == null){
                this.getView().byId("retailerId").setValue(onBackModel.getData().RETAILER_NAME);
                var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerSoHeader?$filter=RETAILER_ID eq '"+onBackModel.getData().RETAILER_ID+"' and STATUS ne 2";
                var data = {
                $expand: 'TO_STATUS',
            }           
            this.postAjaxs(url,"GET",data,"retailerHeaderModel");
            }
             else {
                that.handleRefresh();
			}

            BusyIndicator.show(0);
            
            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerDetails";
            this.postAjaxs(url,"GET","null","retailerModel");
        },
        onRetailerFrag:function(){
            if (!this.retailerFrag) {
                this.retailerFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealorderdispatch.view.Fragment.retailerDialog", this);
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
            var getRetailerId = oEvent.getSource().getSelectedItem().getBindingContext("retailerModel").getProperty("RETAILER_ID");
            
            BusyIndicator.show(0);
            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerSoHeader?$filter=RETAILER_ID eq '"+getRetailerId+"' and STATUS ne 2";
            var data = {
                $expand: 'TO_STATUS',
            }           
            this.postAjaxs(url,"GET",data,"retailerHeaderModel");
            this.getView().byId("retailerId").setValue(getSelectedObj.RETAILER_NAME);
            oEvent.getSource().removeSelections(true);
            this.retailerDialogClose();
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
        retailerDialogClose:function(){
            sap.ui.getCore().byId("retailerSrchId").setValue("");
            this.retailerFrag.close();
        },
        handleRefresh:function(){
            this.getView().byId("retailerId").setValue("");
            // var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerSoHeader";
            // this.postAjaxs(url,"GET","null","retailerHeaderModel");
            this.getView().getModel("retailerHeaderModel").setData(null);
            this.getView().getModel("retailerHeaderModel").refresh(true);
        },
        onSelect:function(oEvent){
            
            var getObject = oEvent.getSource().getBindingContext("retailerHeaderModel").getObject();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.getOwnerComponent().getRouter().getHashChanger().key = "Masterpage";
            BusyIndicator.show(0);
            oRouter.navTo("RouteDisplaypage",{
                "SO_NO":getObject.SO_NO
            });
            
            var onbackObj = {
                "BACK_INDICATOR": null
            };
            var onBackModel = new sap.ui.model.json.JSONModel(onbackObj);
            that.getOwnerComponent().setModel(onBackModel, "vendorReport");
        },
        postAjaxs: function (url, type, data, model) {
            
            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: data,
                success: function (data, response) {
                    if(model === "retailerHeaderModel"){
                        for(var i=0;i<data.value.length;i++){
                            data.value[i].GROSS_TOTAL = Number(data.value[i].GROSS_TOTAL).toFixed(2);
                        }
                    }
                    BusyIndicator.hide();
                    var oModel = new JSONModel(data.value);
                    that.getView().setModel(oModel,model);
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
