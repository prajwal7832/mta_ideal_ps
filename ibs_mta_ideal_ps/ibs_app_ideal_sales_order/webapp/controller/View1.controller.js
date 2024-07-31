// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealsalesorder.controller.View1", {
//         onInit: function () {

//         }
//     });
// });

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealsalesorder/model/formatter",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/export/library"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, BusyIndicator, MessageBox, formatter, Spreadsheet, Filter, FilterOperator, Sorter, library) {
        "use strict";
        var customer, id, sKey, oSorters;
        var companyCode, aFilter, sValue;
        var that, supplierModel, sLoginId, sLoginType;
        var url, appModulePath;
        var EdmType = library.EdmType;
        return BaseController.extend("com.ibs.ibsappidealsalesorder.controller.View1", {
            formatter: formatter,
            onInit: function (oEvent) {
                //debugger
                that = this;
                that.oDataModel = this.getOwnerComponent().getModel();
                supplierModel = new JSONModel();

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteView1");

                var getRoute = oRouter.getRoute("RouteView1");
                getRoute.attachMatched(this._onRouteMatched, this);

                // that._onRouteMatched();
                // that._getUserAttributes();





            },
            _onRouteMatched: function (oEvent) {
                //debugger
                var g = this.getView().getParent().getParent();
                g.toBeginColumnPage(this.getView())
                id = oEvent.getParameter('arguments').loginId;

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                //  that.readUserMasterEntities();

                url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "'&$expand=TO_STATUS";
                that._getUserAttributes();


            },


            onFilterSelect: function (oEvent,onReset) {
                //debugger

                this.getView().byId("seachId").setValue("")
                this.getView().byId("sortTable").setType("Default")
                this.getView().byId("filtertble").setType("Default")
                
                if(oEvent === undefined){
                    this.getView().byId("filtertble").setType("Transparent");
                var oBinding = this.byId("idItemsTable").getBinding("items"),
                    sKey="PurchReqCreated"
                    // Array to combine filters
                   var aFilters = []

                if(sKey == "All"){               
                    var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "'&$expand=TO_STATUS";
                    that.readUserMasterEntities(null,url)
                    this.getView().byId("idIconTabBar").setSelectedKey("PurchReqCreated")
                    // this.handleCancel();
                    
                    this.handleConfirm2()
                   
                    
                    
                }
                else if (sKey == "PurchReqCreated") {
                     aFilter = "(PR_STATUS eq '1')";
                     var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                     this.getView().byId("idIconTabBar").setSelectedKey("PurchReqCreated")
                    //  this.handleCancel();
                    
                     that.handleConfirm2()
                     


                }
                else if (sKey == "PurchReqInApproval") {
                     aFilter = "(PR_STATUS eq '4')";
                     var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                     this.getView().byId("idIconTabBar").setSelectedKey("PurchReqCreated")
                    //  this.handleCancel();
                   
                     that.handleConfirm2()
                    

                }
                else if (sKey == "PurchReqApproved") {
                     aFilter = "(PR_STATUS eq '3')";

                     var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                     this.getView().byId("idIconTabBar").setSelectedKey("PurchReqCreated")
                    //  this.handleCancel();
                    
                     that.handleConfirm2()
                     
                     


                } 
                 else if (sKey == "PurchmReqReject") {
                     aFilter = "(PR_STATUS eq '2')";

                     var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                     this.getView().byId("idIconTabBar").setSelectedKey("PurchReqCreated")
                    //  this.handleCancel();
                    
                     that.handleConfirm2()
                     


                }else if (sKey == "PurchmReqCancel") {
                    aFilter = "(PR_STATUS eq '5')";

                    var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                    that.readUserMasterEntities(aFilter,url)
                    this.getView().byId("idIconTabBar").setSelectedKey("PurchReqCreated")
                    // this.handleCancel();
                    
                    that.handleConfirm2()
                    


               }

                }else{

                var oBinding = this.byId("idItemsTable").getBinding("items"),
                    sKey = that.getView().byId("idIconTabBar").getSelectedKey()
                // Array to combine filters
                var aFilters = []



                if (sKey === "All") {
                    var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "'&$expand=TO_STATUS";
                    that.readUserMasterEntities(null, url)
                    // this.handleCancel();
                    that.handleConfirm2();
                }
                else if (sKey === "PurchmReqReject") {
                    aFilter = "(PR_STATUS eq '2')";

                    var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                    that.readUserMasterEntities(aFilter, url)
                    // this.handleCancel();
                    that.handleConfirm2();


                }
                else if (sKey === "PurchReqCreated") {
                    aFilter = "(PR_STATUS eq '1')";

                    var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                    that.readUserMasterEntities(aFilter, url)
                    // this.handleCancel();
                    that.handleConfirm2()


                }
                else if (sKey === "PurchReqApproved") {
                    aFilter = "(PR_STATUS eq '3')";

                    var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                    that.readUserMasterEntities(aFilter, url)
                    // this.handleCancel();
                    that.handleConfirm2()


                }
                else if (sKey === "PurchReqInApproval") {
                    aFilter = "(PR_STATUS eq '4')";

                    var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                    that.readUserMasterEntities(aFilter, url)
                    // this.handleCancel();
                    that.handleConfirm2()


                } else if (sKey === "PurchmReqCancel") {
                    aFilter = "(PR_STATUS eq '5')";

                    var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                    that.readUserMasterEntities(aFilter, url)
                    // this.handleCancel();
                    that.handleConfirm2()


                }
            }
            },





            readUserMasterEntities: function (aFilter, url, sType) {
                //debugger
                BusyIndicator.show();
                // aFilter = "(PR_STATUS eq '3')";
                // var no = "1100013";
                // var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"'&$expand=TO_STATUS";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger
                        BusyIndicator.hide();
                        sKey = that.getView().byId("idIconTabBar").getSelectedKey()
                        var aIntialData = {
                            value: []
                        };
                        if (sType === "onRoutMatch") {
                            for (var i = 0; i < data.value.length; i++) {
                                if (data.value[i].PR_NO === null || data.value[i].PR_NO === undefined || data.value[i].PR_NO === "") {
                                    data.value[i].PR_NO = data.value[i].PR_NO;
                                } else {
                                    data.value[i].PR_NO = data.value[i].PR_NO.toString();
                                }
                            }
                            var oObj = {
                                  "Created": 0,
                                "InApprove": 0,
                                "Approved": 0,
                                "Rejected": 0,
                                "Cancel":0,
                                "All": data.value.length
                            }



                            for (var j = 0; j < data.value.length; j++) {
                                // data.value[j].STATUS = String(data.value[j].STATUS);
                                if (data.value[j].PR_STATUS === '1') {
                                    aIntialData.value.push(data.value[j]);
                                    oObj.Created = oObj.Created + 1
                                }
                                else if (data.value[j].PR_STATUS === '4') {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.InApprove = oObj.InApprove + 1
                                }
                                else if (data.value[j].PR_STATUS === '2') {
                                    oObj.Rejected = oObj.Rejected + 1
                                }
                                else if (data.value[j].PR_STATUS === '3') {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.Approved = oObj.Approved + 1
                                }else if (data.value[j].PR_STATUS === '5') {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.Cancel = oObj.Cancel + 1
                                }
                            }

                            var oModel = new JSONModel(oObj);
                            that.getView().setModel(oModel, "countModel");

                            var oModel = new JSONModel(aIntialData);
                            that.getView().setModel(oModel, "supplier");

                        } else {
                           

                            for (var i = 0; i < data.value.length; i++) {
                                if (data.value[i].PR_NO === null || data.value[i].PR_NO === undefined || data.value[i].PR_NO === "") {
                                    data.value[i].PR_NO = data.value[i].PR_NO;
                                } else {
                                    data.value[i].PR_NO = data.value[i].PR_NO.toString();
                                }
                                // data.value[i].PR_CREATION_DATE = String(new Date(data.value[i].PR_CREATION_DATE));
                            }


                            var  supplierModel = new sap.ui.model.json.JSONModel(data);
                            that.getView().setModel(supplierModel, "supplier");
                            // that.getView().getModel("supplier").refresh(true)
                            that.getView().byId("idItemsTable").removeSelections(true);
                           


                             if(sKey === "PurchReqCreated"){
                                that.getView().getModel("countModel").setProperty("/Created", data.value.length)
                                }else if(sKey === "PurchReqInApproval"){
                                    that.getView().getModel("countModel").setProperty("/InApprove", data.value.length)  
                                }else if(sKey === "PurchReqApproved"){
                                    that.getView().getModel("countModel").setProperty("/Approved", data.value.length)  
                                }else if(sKey === "PurchmReqReject"){
                                    that.getView().getModel("countModel").setProperty("/Rejected", data.value.length)
                                }else if(sKey === "PurchmReqCancel"){
                                    that.getView().getModel("countModel").setProperty("/Cancel", data.value.length)
                                }else if(sKey === "All"){
                                    that.getView().getModel("countModel").setProperty("/All", data.value.length)
                                }

                        }

                    },
                    error: function (e) {
                        //debugger
                        BusyIndicator.hide();
                        MessageBox.error(e.responseText);
                    }
                });
            },



            _getUserAttributes: function () {
                //debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var attr = appModulePath + "/user-api/attributes";


                // that._sUserID = "darshan.l@intellectbizware.com";
                // that._sUserName = "Darshan Lad";
                // var obj = {
                //     userId: that._sUserID,
                //     userName: that._sUserName
                // }
                // var oModel = new JSONModel(obj);
                // that.getOwnerComponent().setModel(oModel, "userModel");
                // that.readUserMasterEntities(null, url, "onRoutMatch");

                // that.readUserMasterData(that._sUserID);




                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: attr,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (data, response) {

                            that._sUserName = data.firstname + " " + data.lastname;
                            that._sUserID = data.email.toLowerCase().trim();
                            // that.readUserMasterData(that._sUserID);

                            var obj = {
                                userId: data.email.toLowerCase(),
                                userName: data.firstname + " " + data.lastname
                            }
                            var oModel = new JSONModel(obj);
                            that.getOwnerComponent().setModel(oModel, "userModel");
                          that.readUserMasterEntities(aFilter,url,"onRoutMatch");
                        },
                        error: function (oError) {
                            MessageBox.error("Error while reading User Attribute");
                        }
                    });
                });
            },


            orderCreate: function () {
                //debugger
                BusyIndicator.show();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View3",
                    { D_loginId: id });
            },


            excel: function () {
                //debugger
                BusyIndicator.show();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View4",
                    { D_loginId: id });

            },



            onSelectionItem: function (oEvent) {
                //debugger

                BusyIndicator.show();
                var data = oEvent.getSource().getSelectedItem().getBindingContext("supplier").getObject();


                //Get data in obj and set in json model.

                var navObj = {
                    "PR_NO": data.PR_NO,
                    "DISTRIBUTOR_ID": data.DISTRIBUTOR_ID,
                    "LAST_UPDATED_DATE": data.LAST_UPDATED_DATE,
                    "ORDER_TYPE": data.ORDER_TYPE,
                    "PAYMENT_METHOD": data.PAYMENT_METHOD,
                    "PR_CREATION_DATE": data.PR_CREATION_DATE,
                    "PR_STATUS": data.PR_STATUS,
                    "REGION_CODE": data.REGION_CODE,
                    "SHIP_TO": data.SHIP_TO
                };

                var oViewModel = new sap.ui.model.json.JSONModel(navObj);
                this.getOwnerComponent().setModel(oViewModel, "vendorDetail");

                var oViewModel1 = new sap.ui.model.json.JSONModel(data);
                this.getOwnerComponent().setModel(oViewModel1, "orderDetails");

                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View2", {
                    "PR_NO": data.PR_NO
                });

            },

            createColumnConfig: function () {
                //debugger;
                var aCols = [];

                aCols.push({
                    label: "Purchase Request no",
                    property: 'PR_NO'
                });

              

                aCols.push({
                    label: "Creation Date",
                    property: 'PR_CREATION_DATE',
                    type: EdmType.Date
                });

                aCols.push({
                    label: "Last Date",
                    property: 'LAST_UPDATED_DATE',
                    type: EdmType.Date
                });
                aCols.push({
                    label: "Amount",
                    property: 'GRAND_TOTAL'

                });
                aCols.push({
                    label: "Status",
                    property: 'TO_STATUS/DESC'
                });

                return aCols;
            },
            onExport: function () {
                //debugger;
                this.getView().byId("exportTable").setType("Emphasized");
                var currentDate = new Date();
                // var fName = newDate + ".xlsx";

                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "MM/dd/yy" });

                // Format the date
                var formattedDate = dateFormat.format(currentDate);
                var fName = "Purchase Order" + " " + formattedDate + ".xlsx";

                var aCols, oRowBinding, oSettings, oSheet, oTable, oSheet;

                if (!this._oTable) {
                    this._oTable = this.byId('idItemsTable');
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();

                var ModelData = this.getView().getModel("supplier")

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },

                    dataSource: oRowBinding,
                    fileName: fName,
                    worker: false


                };
                //  sap.ui.export.Spreadsheet---Directly libary used here
                oSheet = new sap.ui.export.Spreadsheet(oSettings);
                oSheet.build().
                    finally(function () {
                        oSheet.destroy();
                    });
            },
            onSearch: function (oEvent) {
                //debugger

                // sValue== in this variable stored the user input vaule in following data
                sValue = oEvent.getParameter("newValue");
                //sValue-- if you searching on search bar serachin any value this value show in sValue variable

                // var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("PR_NO", sap.ui.model.FilterOperator.Contains, sValue)], false);
                var oFilter = new sap.ui.model.Filter([
                    new sap.ui.model.Filter("PR_NO", sap.ui.model.FilterOperator.Contains, sValue)], false);
                var bindings = this.byId("idItemsTable").getBinding("items");
                // this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 

                bindings.filter(oFilter);
            },

            onSort: function (oEvent) {

                //debugger;
                if (!this.onViewSort) {
                    this.onViewSort = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorder.view.fragments.onsort", this);
                    this.getView().addDependent(this.onViewSort);
                }
                this.onViewSort.open();
            },
            onFilter: function (oEvent) {

                //debugger;

                if (!this.onViewFilter) {
                    this.onViewFilter = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorder.view.fragments.onfilter", this);
                    this.getView().addDependent(this.onViewFilter);
                }
                this.onViewFilter.open();
            },

            onReset: function (oEvent) {
                //debugger; 
                this.getView().byId("seachId").setValue("")
                this.getView().byId("sortTable").setType("Default")
                this.getView().byId("filtertble").setType("Default")
                this.getView().byId("exportTable").setType("Default")
                this. onFilterSelect()
               
                
                // this.getView().byId("resetTable").setType("Emphasized")
                /////////filter reset
                if (this.onViewFilter !== undefined) {
                    this.onViewFilter.clearFilters();
                    this.getView().byId("idItemsTable").getBinding("items").filter();
                }

                ////////////sorting reset
                var searchValue = 0
                if (searchValue != sValue) {
                    searchValue = oEvent.getParameter("newValue");
                    //sValue-- if you searching on search bar serachin any value this value show in sValue variable

                    var oFilter = [];
                    var bindings = this.byId("idItemsTable").getBinding("items");
                    // this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 

                    bindings.filter(oFilter);
                    // var oBinding = oTable.getBinding("items");
                    bindings.sort(new Sorter("PR_NO", true));

                }
            //    this.onFilterSelect();
            //   this.getView().byId("filtertble").setType("Default").mProperties.type

            },
            handleConfirm: function (oEvent) {
                //debugger;

                // this.getView().byId("sortTable").setType("Emphasized")
                var sortItem = oEvent.getParameter("sortItem");
                var sortDesc = oEvent.getParameter("sortDescending");
                var oTable = this.getView().byId("idItemsTable");
                var oBinding = oTable.getBinding("items");
                oBinding.sort(new Sorter(sortItem.getKey(), sortDesc));


                if (sortDesc === false) {
                    this.getView().byId("sortTable").setType("Emphasized");
                } else {
                    this.getView().byId("sortTable").setType("Transparent");
                }

            },



            handleConfirm2: function (oEvent) {
                //debugger

                var selectedkey = this.getView().byId("idIconTabBar").mProperties.selectedKey

                var oObj = {

                    "Created": 0,
                    "InApprove": 0,
                    "Approved": 0,
                    "Rejected": 0,
                    "Cancel":0,
                    "All": 0
                }


                if(oEvent === undefined){
                    this.getView().byId("filtertble").setType("Default") 
                }else{ 



                this.getView().byId("filtertble").setType("Emphasized")
                var aFilters = [];
                var insideFilter = [];
                // var oEentUdefine=oEvent.

            //    if(onReset === "onReset" &&  oEvent === null) {
            //     this.getView().byId("filtertble").setType("Default")
            //     aFilters.push(insideFilter);
            //     this.getView().byId("idItemsTable").getBinding("items").filter(aFilters);
            //    } else{
                
                var aFilterItems = oEvent.getParameter("filterItems");
                if (aFilterItems.length === 0) {
                    this.getView().byId("filtertble").setType("Transparent")
                }
                if (aFilterItems.length === 0) {
                    this.onViewFilter.clearFilters();
                    this.getView().byId("idItemsTable").getBinding("items").filter();
                }
                var viewSettingDialogKey = aFilterItems[0].mProperties.key

                aFilterItems.forEach(function (oItem) {

                    viewSettingDialogKey = oItem.getParent().getProperty("key");


                    // hierarchyFlag = true;
                    insideFilter.push(new Filter("PR_NO", FilterOperator.Contains, oItem.getProperty('key')));


                });

            // }

                aFilters.push(insideFilter);
                this.getView().byId("idItemsTable").getBinding("items").filter(aFilters);
                // this.getView().byId("idFilterBtn").setType("Emphasized");

                // var count = this.getView().byId("idItemsTable").getBinding("items").aIndices.length;
                // var Str = "Contract Colloaboration Requests (" + count + ")";




                if (sKey ==="All") {
                    oObj.Created = that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove = that.getView().getModel("countModel").getData().InApprove;
                    oObj.Rejected = that.getView().getModel("countModel").getData().Rejected;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.Cancel = that.getView().getModel("countModel").getData().Cancel;
                    oObj.All = this.getView().byId("idItemsTable").mAggregations.items.length;

                } else if (sKey === "PurchmReqReject") {
                    oObj.Created = that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove = that.getView().getModel("countModel").getData().InApprove;
                    oObj.Rejected = that.getView().byId("idItemsTable").mAggregations.items.length;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.All = that.getView().getModel("countModel").getData().All
                    oObj.Cancel = this.getView().getModel("countModel").getData().Cancel


                } else if (sKey === "PurchReqCreated") {

                    oObj.Created = this.getView().byId("idItemsTable").mAggregations.items.length;
                    oObj.InApprove = that.getView().getModel("countModel").getData().InApprove;
                    oObj.Rejected = that.getView().getModel("countModel").getData().Rejected;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.All = that.getView().getModel("countModel").getData().All
                    oObj.Cancel = this.getView().getModel("countModel").getData().Cancel

                } else if (sKey === "PurchReqApproved") {
                    oObj.Created = that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove = that.getView().getModel("countModel").getData().InApprove;
                    oObj.Rejected = that.getView().getModel("countModel").getData().Rejected;
                    oObj.Approved = this.getView().byId("idItemsTable").mAggregations.items.length;;
                    oObj.All = that.getView().getModel("countModel").getData().All
                    oObj.Cancel = this.getView().getModel("countModel").getData().Cancel


                } else if (sKey === "PurchReqInApproval") {
                    oObj.Created = that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove = this.getView().byId("idItemsTable").mAggregations.items.length;
                    oObj.Rejected = that.getView().getModel("countModel").getData().Rejected;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.All = that.getView().getModel("countModel").getData().All
                    oObj.Cancel = this.getView().getModel("countModel").getData().Cancel
                }
                else if (sKey === "PurchmReqCancel") {
                    oObj.Created = that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove = this.getView().getModel("countModel").getData().InApprove;
                    oObj.Rejected = that.getView().getModel("countModel").getData().Rejected;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.Cancel = that.getView().byId("idItemsTable").mAggregations.items.length;
                    oObj.All = that.getView().getModel("countModel").getData().All
                    
                }
                var oModel = new JSONModel(oObj);
                that.getView().setModel(oModel, "countModel")

            }
            },


            handleCancel : function(){
                //debugger
                // this.onViewFilter.close();
                this.getView().byId("filtertble").setType("Default");
                this.onViewFilter.destroy();
                this.onViewFilter= undefined;


            },
            onConfirmViewSettingsDialog: function (oEvent) {
                //debugger    
                var aFilters = [];
                var insideFilter = [];
                var aFilterItems = oEvent.getParameter("filterItems");
                var viewSettingDialogKey;
                var hierarchyFlag = false;
                var termtypeFlag = false;
                var dateFlag = false;
                if (aFilterItems.length === 0 && sFrom === "") {
                    this.getView().byId("idFilterBtn").setType("Transparent");
                    aFilters = this.getView().getModel("oCrModel").getData().value;
                    this.getView().byId("idCrTable").getBinding("items").filter(aFilters);

                    var count = this.getView().byId("idCrTable").getBinding("items").aIndices.length;
                    var Str = "Contract Colloaboration Requests (" + count + ")";
                    context.byId("contRes").setText(Str);
                }
                else {

                }
            }
        });
    });



