// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealgrn.controller.Masterpage", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "com/ibs/ibsappidealgrn/model/formatter",
	"sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
    "sap/ui/Device",
    "sap/ui/core/format/DateFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,formatter,BusyIndicator,MessageBox,Filter,FilterOperator,Sorter,Device,DateFormat) {
        "use strict";
        var that,appModulePath,sDevice,context;

        return Controller.extend("com.ibs.ibsappidealgrn.controller.Masterpage", {
            formatter:formatter,
            onInit: function () {
                that=this;
                context = this;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteMasterpage").attachMatched(this._onRouteMatched, this);
                
                // const oDeviceModel = new JSONModel(Device);
			    // oDeviceModel.setDefaultBindingMode("OneWay");
			    // this.getOwnerComponent().setModel(oDeviceModel, "device");

			    // sDevice = this.getOwnerComponent().getModel("device").getData();
            },
            _onRouteMatched:function(){

                var sFilter = new Filter("CustomerCode",FilterOperator.EQ,"0001100013");
                BusyIndicator.show(0);
                context.oDataModel = context.getOwnerComponent().getModel("onPremiseSrv");
                // var url = appModulePath + "/sap/opu/odata/sap/ZIBS_DMS_GRN_SRV/GRNHeaderSet?$filter=CustomerCode eq '0001100013'";
                // this.postAjaxs(url,"GET","grnHeaderSet");

                var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Header";
                this.readAcceptedEntity(url,"GET","grnAcceptedInvoice");
            },
            
            onSearch:function(oEvent,onRoute){
                var sQuery;

                if(onRoute === "onRouteMatch"){
                    sQuery = oEvent;
                }
                else{
                    sQuery = oEvent.getSource().getValue();
                }
                var oTable = this.getView().byId("idOrdersTable");
                this.binding = oTable.getBinding("items");

                if (sQuery && sQuery.length > 0) {
                    var oFilter1 = new Filter("DeliveryNumber", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter2 = new Filter("InvoiceNumber", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter3 = new Filter("SalesOrder", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFil = new sap.ui.model.Filter([oFilter1,oFilter2,oFilter3]);

                    this.binding.filter(oFil, sap.ui.model.FilterType.Application);
                } else {
                    this.binding.filter([]);
                }

            },
            handleSort: function (oEvent) {
                if (!this.filterfrag2) {
                    this.filterfrag2 = sap.ui.xmlfragment("com.ibs.ibsappidealgrn.view.Fragment.Sort", this);
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
                
                if(bDescending === false || sPath !== "DeliveryNumber"){
                    this.getView().byId("idSortBtn").setType("Emphasized");
                } else {
                    this.getView().byId("idSortBtn").setType("Transparent");
                }
                aSorters.push(new Sorter(sPath, bDescending));
    
                oBinding.sort(aSorters);
            },
            onFilter : function(oEvent){
                if (!this._oViewSettingsDialog) {
                    this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealgrn.view.Fragment.filterDialog", this);
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
                    // this.postAjaxs(url,"GET","null","retailerData","onFilItems");
                    this.getView().byId("idFilterBtn").setType("Transparent");
                }
                else{

                aFilterItems.forEach(function (oItem) {
                    viewSettingDialogKey = oItem.getParent().getProperty("key");
                    sFinalString = oItem.getKey();
                    if(sFinalString !== "" && viewSettingDialogKey === "SO_NO"){
                        retailerSoNoArr.push(viewSettingDialogKey+" eq "+sFinalString);
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
                    // this.postAjaxs(url,"GET","null","retailerData","onFilItems");
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
                oRouter.navTo("RouteCreationpage");
            },
            onRefresh:function(){
                this.getView().byId("oSearchMasterData").setValue("");
                var sFilter = new Filter("CustomerCode",FilterOperator.Contains,"0001100013",false);
                BusyIndicator.show(0);
                var url = appModulePath + "/sap/opu/odata/sap/ZIBS_DMS_GRN_SRV/GRNHeaderSet?$filter=CustomerCode eq '0001100013'";
                this.postAjaxs(url,"GET","grnHeaderSet");

                if (this.filterfrag2) {
                    this.filterfrag2.destroy();
                    this.filterfrag2 = null;
                    this.getView().byId("idSortBtn").setType("Transparent");
                }
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
            readAcceptedEntity: function (url, type,sAlisName) {
            
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    dataType:'JSON',
                    success: function (oData, response) {
                        var oModel = new JSONModel(oData.value);
                        that.getView().setModel(oModel,sAlisName);
                        var url = appModulePath + "/sap/opu/odata/sap/ZIBS_DMS_GRN_SRV/GRNHeaderSet?$filter=CustomerCode eq '0001100013'";
                        that.postAjaxs(url,"GET","grnHeaderSet");
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
            postAjaxs: function (url, type,sAlisName) {
                var getSearchData = that.getView().byId("oSearchMasterData").getValue();
                var sDataArr = [];
            
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    dataType:'JSON',
                    success: function (oData, response) {
                        BusyIndicator.hide();

                        // if(sAlisName === "grnAcceptedInvoice"){
                        //     var oModel = new JSONModel(oData.value);
                        //     that.getView().setModel(oModel,sAlisName);
                        // }
                        // else{
                            var getAcceptedData = that.getView().getModel("grnAcceptedInvoice").getData();
                            var data =oData.d.results;
                            var s4HanaJson = new JSONModel();
        
                            s4HanaJson.setSizeLimit(data.length);

                            for(var i=0;i<data.length;i++){
                                data[i].InvoiceDate = new Date(parseInt(data[i].InvoiceDate.replace(/[^0-9]/g, "")));
                                data[i].DeliveryDate = new Date(parseInt(data[i].DeliveryDate.replace(/[^0-9]/g, "")));
                                if(Number(data[i].DeliveryValue) === 0){
                                    data[i].DeliveryValue = 0;
                                }
                                else{
                                    data[i].DeliveryValue = Number(data[i].DeliveryValue).toFixed(2);
                                }

                                if(getAcceptedData.length === 0){
                                    sDataArr = data;
                                }
                                else{
                                    var result1 = getAcceptedData.filter(function (a) {
                                        if(a["INVOICE_NO"] == data[i].InvoiceNumber){
                                            return a;
                                        }
                                    }, Object.create(null));

                                    if(result1.length === 0){
                                        sDataArr.push(data[i]);
                                    }
                                }
                            }
                            s4HanaJson.setData(sDataArr);

                            that.getOwnerComponent().setModel(s4HanaJson, sAlisName);

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

                            if(getSearchData !== ""){
                                that.onSearch(getSearchData,"onRouteMatch");
                            }
                        // }
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
            onPress:function(oEvent){
                var oSelectedObj = oEvent.getSource().getBindingContext("grnHeaderSet").getObject();

                var oModel = new JSONModel(oSelectedObj);
                this.getOwnerComponent().setModel(oModel,"cusomerHeaderModel");
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDetailpage",{
                    InvoiceNo:oSelectedObj.InvoiceNumber
                });
                
                this.getOwnerComponent().getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");
            }
        });
    });

