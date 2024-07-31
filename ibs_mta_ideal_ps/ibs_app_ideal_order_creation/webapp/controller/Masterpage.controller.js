// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealordercreation.controller.Masterpage", {
//         onInit: function () {

//         }
//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/ibs/ibsappidealordercreation/model/formatter",
	"sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
    "sap/ui/Device"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,formatter,BusyIndicator,MessageBox,Filter,Sorter,Device) {
        "use strict";
        var that,appModulePath,sDevice;

        return Controller.extend("com.ibs.ibsappidealordercreation.controller.Masterpage", {
            formatter:formatter,
            onInit: function () {
                debugger
                that=this;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteMasterpage").attachMatched(this._onRouteMatched, this);
                
                const oDeviceModel = new JSONModel(Device);
			    oDeviceModel.setDefaultBindingMode("OneWay");
			    this.getOwnerComponent().setModel(oDeviceModel, "device");

			    sDevice = this.getOwnerComponent().getModel("device").getData();
            },
            _onRouteMatched:function(){
                BusyIndicator.show(0);
                // this.getView().byId("oSearchMasterData").setValue("");
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerSoHeader";
                this.postAjaxs(url,"GET","null","retailerData");
                this.postAjaxs(url,"GET","null","retailerFragData");

                if(sDevice.system.phone === true && sDevice.orientation.portrait === true){
                    that.getView().byId("idCreate").setText("");
                }
                else{
                    that.getView().byId("idCreate").setText("Create Order");
                }
            },
            onSearch:function(oEvent,onRoute){
                var sQuery;
                if(onRoute === "onRouteMatch"){
                    sQuery = oEvent;
                }
                else{
                    sQuery = oEvent.getSource().getValue();
                }
                // oEvent.getSource().getValue();
                var oTable = this.getView().byId("idOrdersTable");
                this.binding = oTable.getBinding("items");

                if (sQuery && sQuery.length > 0) {
                    var oFilter1 = new Filter("SO_NO", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter2 = new Filter("RETAILER_NAME", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFil = new sap.ui.model.Filter([oFilter1,oFilter2]);

                    this.binding.filter(oFil, sap.ui.model.FilterType.Application);
                } else {
                    this.binding.filter([]);
                }

            },
            handleSort: function (oEvent) {
                if (!this.filterfrag2) {
                    this.filterfrag2 = sap.ui.xmlfragment("com.ibs.ibsappidealordercreation.view.Fragment.Sort", this);
                    this.getView().addDependent(this.filterfrag2);
                }
                this.filterfrag2.open();
            },
            handleSortDialogConfirm: function (oEvent,sFilterReset) {
                var oTable = this.byId("idOrdersTable"),
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
                BusyIndicator.hide();
                // sPath = mParams.sortItem.getKey();
                // bDescending = mParams.sortDescending;
                
                if(bDescending === false || sPath !== "SO_NO"){
                    this.getView().byId("idSortBtn").setType("Emphasized");
                } else {
                    this.getView().byId("idSortBtn").setType("Transparent");
                }
                aSorters.push(new Sorter(sPath, bDescending));
    
                oBinding.sort(aSorters);
            },
            onFilter : function(oEvent){
                if (!this._oViewSettingsDialog) {
                    this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealordercreation.view.Fragment.filterDialog", this);
                    this.getView().addDependent(this._oViewSettingsDialog);
                }
                this._oViewSettingsDialog.open();
    
                that.filterdialog = true;
            },
            onConfirmViewSettingsDialog: function (oEvent,sType) {
                var retailerSoNoArr = [];
                var retailerNameArr = [];
                var multipleFields = [];
                var viewSettingDialogKey;
                var aFilterItems;

                if(sType === "onReadFil"){
                    aFilterItems = oEvent;
                }
                else{
                 aFilterItems = oEvent.getParameters().filterItems;
                }
                var sFinalString = "";

                if(aFilterItems.length === 0){
                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerSoHeader";
                    this.postAjaxs(url,"GET","null","retailerData","onFilItems");
                    this.getView().byId("idFilterBtn").setType("Transparent");
                }
                else{

                aFilterItems.forEach(function (oItem) {
                    viewSettingDialogKey = oItem.getParent().getProperty("key");
                    sFinalString = oItem.getKey();
                    if(sFinalString !== "" && viewSettingDialogKey === "SO_NO"){
                        retailerSoNoArr.push(viewSettingDialogKey+" eq '"+sFinalString+"'");
                    }
                    else if(sFinalString !== "" &&  viewSettingDialogKey === "RETAILER_ID"){
                        retailerNameArr.push(viewSettingDialogKey+" eq '"+sFinalString+"'");
                    }
                });
                
                if(retailerSoNoArr.length > 0){
                    multipleFields.push("("+retailerSoNoArr.join(" or ")+")");
                }
                else if(retailerSoNoArr.length === 1){
                    multipleFields.push(retailerSoNoArr[0]);
                }
                if(retailerNameArr.length > 0){
                    multipleFields.push("("+retailerNameArr.join(" or ")+")");
                }
                else if(retailerNameArr.length === 1){
                    multipleFields.push(retailerNameArr[0]);			
                }
               
                if(multipleFields.length > 0){
                    if(multipleFields.length === 1){
                        multipleFields = multipleFields;
                    }
                    else{
                        multipleFields = multipleFields.join(" and ");
                    }
                    var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerSoHeader?$filter="+multipleFields;
                    this.postAjaxs(url,"GET","null","retailerData","onFilItems");
                    this.getView().byId("idFilterBtn").setType("Emphasized");
                }
                }

            },
            onResetViewSetting:function(){
                if (this.filterdialog === true) {
                    this._oViewSettingsDialog.clearFilters();
                }
                this.getView().byId("idFilterBtn").setType("Transparent");
                // this.readData();
            },
            onCreate:function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.getOwnerComponent().getModel("appView").setProperty("/layout","MidColumnFullScreen");
                oRouter.navTo("RouteCreationpage");
            },
            onRefresh:function(){
                BusyIndicator.show(0);
                this.getView().byId("oSearchMasterData").setValue("");
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerSoHeader";
                this.postAjaxs(url,"GET","null","retailerData");
                if (this.filterfrag2) {
                    this.filterfrag2.destroy();
                    this.filterfrag2 = null;
                    this.getView().byId("idSortBtn").setType("Transparent");
                }
				this._oViewSettingsDialog.clearFilters();
            },
             postAjaxs: function (url, type, data, model,sType) {
            
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    success: function (data, response) {
                        
                        var getSearchData = that.getView().byId("oSearchMasterData").getValue();
                        BusyIndicator.hide();
                        for(var i=0;i<data.value.length;i++){
                            data.value[i].RETAILER_ID = String(data.value[i].RETAILER_ID);
                            data.value[i].SO_NO = String(data.value[i].SO_NO);
                            data.value[i].CREATION_DATE = new Date(data.value[i].CREATION_DATE);
                        }
                        var oModel = new JSONModel(data.value);
                        that.getOwnerComponent().setModel(oModel,model);

                        if(that._oViewSettingsDialog !== undefined && sType !== "onFilItems"){
                            BusyIndicator.show(0);
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
                            BusyIndicator.show(0);
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

                        if(getSearchData !== ""){
                            that.onSearch(getSearchData,"onRouteMatch");
                        }
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
            isValidJsonString:function(sDataString){
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
            onPress:function(oEvent){
                var sValue = oEvent.getSource().getBindingContext("retailerData").getObject().SO_NO;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                
                this.getOwnerComponent().getModel("appView").setProperty("/layout","EndColumnFullScreen");
                oRouter.navTo("RouteDetailpage",{
                    SO_NO:sValue
                });
            }
        });
    });

