sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
    "com/ibs/ibsappidealordercreation/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox,BusyIndicator,formatter) {
        "use strict";
        var that,object,appModulePath,salesOrderNo;

        return Controller.extend("com.ibs.ibsappidealordercreation.controller.Detailpage", {
            formatter:formatter,
            onInit: function () {
                that = this;

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteDetailpage").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched:function(oEvent){
                this.getView().byId("idFullScreen").setVisible(true);
                this.getView().byId("idExitScreen").setVisible(false);
                salesOrderNo = oEvent.getParameter("arguments").SO_NO;
                this.getOwnerComponent().getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerSoHeader?$filter=SO_NO eq '"+salesOrderNo+"'";
                BusyIndicator.show(0);
                this.postAjaxs(url,"GET","null","retailerHeaderData");
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerDummy";
                this.postAjaxs(url,"GET","null","retailerDummyData");
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerSoItems?$filter=SO_NO eq '"+salesOrderNo+"'";
                this.postAjaxs(url,"GET","null","retailerMaterialItems");

                var getMasterPgeData = that.getOwnerComponent().getModel("retailerData");

                if(getMasterPgeData === undefined){
                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerSoHeader";
                    this.postAjaxs(url,"GET","null","retailerData");
                }
                
            },
            fullscreen:function(){
                var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
                this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
                if (!bFullScreen) {
                this.getView().byId("idFullScreen").setVisible(false);
                this.getView().byId("idExitScreen").setVisible(true);
                // store current layout and go full screen
                this.getView().getModel("appView").setProperty("/previousLayout", this.getView().getModel("appView").getProperty("/layout"));
                this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                } else {
                // reset to previous layout
                this.getView().byId("idFullScreen").setVisible(true);
                this.getView().byId("idExitScreen").setVisible(false);
                
                var getLayout = this.getView().getModel("appView").getProperty("/layout");
                if(getLayout === "TwoColumnsMidExpanded"){
                    this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                }
                else{
                    this.getView().getModel("appView").setProperty("/layout", this.getView().getModel("appView").getProperty("/previousLayout"));
                }
                // this.getView().getModel("appView").setProperty("/layout", this.getView().getModel("appView").getProperty("/previousLayout"));
                }
            },
            
            onBack:function(){
                BusyIndicator.show(0);
                this.getOwnerComponent().getModel("appView").setProperty("/layout","OneColumn");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMasterpage");
            },
            
            postAjaxs: function (url, type, data, model) {
            
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    success: function (data, response) {
                    BusyIndicator.hide();
                        if(model === "retailerIdData"){
                            var retailerIdArr = [];
                            data.value.filter(function (a,index) {
                                // 
                                if(a["RETAILER_ID"] && (!this[a["RETAILER_ID"]])){
                                    this[a["RETAILER_ID"]] = true;
                                    retailerIdArr.push({retailerId:a["RETAILER_ID"]});
                                }                
                            }, Object.create(null));
                            data.value = retailerIdArr;
                        }
                        else if(model === "retailerAddr"){
                            var retailerAddrArr = [];
                            data.value.filter(function (a,index) {
                                // 
                                if(a["ADDRESS_TYPE"]){
                                    retailerAddrArr.push({address:a["ADDRESS_LINE_1"]});
                                }                
                            }, Object.create(null));
                            data.value = retailerAddrArr;
                        }
                        else if(model === "retailerData"){
                            for(var i=0;i<data.value.length;i++){
                                data.value[i].RETAILER_ID = String(data.value[i].RETAILER_ID);
                                data.value[i].SO_NO = String(data.value[i].SO_NO);
                                data.value[i].CREATION_DATE = new Date(data.value[i].CREATION_DATE);
                            }
                        }
                        else if(model === "retailerMaterialItems"){
                            for(var i=0;i<data.value.length;i++){
                                data.value[i].STD_PRICE = Number(data.value[i].STD_PRICE).toFixed(2);
                            }
                        }
                            var oModel = new JSONModel(data.value);
                            that.getOwnerComponent().setModel(oModel,model);
                    },
                    error:function(error){
                        BusyIndicator.hide();
                        var oXMLMsg, oXML;
                        if (that.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText
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
