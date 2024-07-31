// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealsalerorderreport.controller.MasterPage", {
//         onInit: function () {

//         }
//     });
// });

// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealsalerorderreport.controller.MasterPage", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealsalerorderreport/model/formatter",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/library",
    "sap/ui/model/Sorter"
    

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, BusyIndicator, MessageBox, formatter, Spreadsheet, Filter, FilterOperator,library,Sorter) {
        "use strict";
        var customer,id;
        var companyCode,sValue,sFinalString;
        var that, supplierModel, sLoginId, sLoginType;
        var url, appModulePath,aFilter;
        var EdmType = library.EdmType;
        return BaseController.extend("com.ibs.ibsappidealsalerorderreport.controller.MasterPage", {
            formatter: formatter,
            onInit: function (oEvent) {
                debugger
                that = this;
                that.oDataModel = this.getOwnerComponent().getModel();
                supplierModel = new sap.ui.model.json.JSONModel();

                var oRouter = this.getOwnerComponent().getRouter();
                // oRouter.getRoute("RouteMasterPage");
            
                var getRoute = oRouter.getRoute("RouteMasterPage");
                getRoute.attachMatched(this._onRoutsalesreport, this);
                // that.readUserMasterEntities();
                

                //   that._getUserAttributes();
                //   that.readEntityData();
                // var id = oEvent.getOwnerComponent().getParameter("loginId");

                
            
            },

            _onRoutsalesreport : function (oEvent) {
                debugger
                var aFilter;
               
                var g = this.getView().getParent().getParent();
                g.toBeginColumnPage(this.getView())
                
                // id = oEvent.getParameter('arguments').loginId;

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                //  that.readUserMasterEntities();

                // url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "'&$expand=TO_STATUS";
                // that._getUserAttributes();

                if(this._aDialog1 === "" || this._aDialog1 === undefined || this._aDialog1 === null){
                    that._getUserAttributes();
                }else{
                    // var value = this._aDialog1.mProperties.sortDescending;
                    // if(value === true){
                    //     this.getView().byId("idProductsTable").setSort(true);
                    // }else{
                    //     this.getView().byId("idProductsTable").setSort(false);
                    // }
                }
               
               
            },
    

            _getUserAttributes: function () {
                //  debugger;
                var aFilters = "(DISTRIBUTOR_ID eq '1100013')"
                    
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var attr = appModulePath + "/user-api/attributes";
    
                
                // that._sUserID = "prajwal.g@intellectbizware.com";
                // that._sUserName = "Prajwal Gaikwad";
                // var obj = {
                //     userId:that._sUserID,
                //     userName: that._sUserName
                // }  
                // var oModel = new JSONModel(obj);
                // that.getOwnerComponent().setModel(oModel, "userModel");
                //  //// this.readUserMasterEntities();
                // that.readEntityData();
                


                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: attr,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (data, response) {
                            // debugger;
                            that._sUserID = data.email.toLowerCase().trim();
                            that._sUserName = data.firstname + " " + data.lastname;
                            // that.readMasterIdealUser();
                            var obj = {
                                userId: data.email.toLowerCase(),
                                userName: data.firstname + " " + data.lastname
                            }
                            var oModel = new JSONModel(obj);
                            that.getOwnerComponent().setModel(oModel, "userModel");

                            // that.readUserMasterEntities();
                            that.readEntityData();
                        },
                        error: function (oError) {
                            // debugger;
                            MessageBox.error("Error while reading User Attributes");
                        }
                    });
                });
            },


                readEntityData: function () {
                //debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
               var id = "1100013";
                 var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "'&$expand=TO_STATUS";


                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger
                        

                
                        for(var i=0;i<data.value.length;i++){
                                    if(data.value[i].PR_NO === null || data.value[i].PR_NO === undefined || data.value[i].PR_NO === ""){
                                        data.value[i].PR_NO = data.value[i].PR_NO;
                                            }else{
                                            data.value[i].PR_NO = data.value[i].PR_NO.toString();
                                               }
                                           }

                             supplierModel.setData(data);
                        that.getOwnerComponent().setModel(supplierModel, "supplier");
                        that.getView().byId("idItemsTable").removeSelections(true);


                    },
                    error: function (e) {
                        ////debugger
                        BusyIndicator.hide()
                        // MessageBox.error(e.responseText);
                    }
                });
            },

          

            onSelectionItem: function (oEvent) {
                //debugger
                var data = oEvent.getSource().getSelectedItem().getBindingContext("supplier").getObject();
                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

            
                var oViewModel = new sap.ui.model.json.JSONModel(data);
                this.getOwnerComponent().setModel(oViewModel, "orderDetails");
                BusyIndicator.show()
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("detailPage",{
                    "PR_NO": data.PR_NO
                });

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






            createColumnConfig: function () {
                ////debugger;
                var aCols = [];

                aCols.push({
                    property: 'PR_NO'
                });

                aCols.push({

                    property: 'DISTRIBUTOR_ID'

                });

                aCols.push({
                    property: 'PR_CREATION_DATE',
                    type: EdmType.Date
                });

                aCols.push({
                    property: 'LAST_UPDATED_DATE',
                    type: EdmType.Date
                });

                aCols.push({
                    property: 'PR_STATUS'
                });


                return aCols;
            },
            onExport: function () {
                ////debugger;
                this.getView().byId("exportTable").setType("Emphasized");
                var currentDate = new Date();
                // var fName = newDate + ".xlsx";

                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "MM/dd/yy" });

                  // Format the date
                 var formattedDate = dateFormat.format(currentDate);
                var fName = "Purchase Order" +" " + formattedDate + ".xlsx";

                var aCols, oRowBinding, oSettings, oSheet, oTable, oSheet;

                if (!this._oTable) {
                    this._oTable = this.byId("idItemsTable");
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
                ////debugger

                // sValue== in this variable stored the user input vaule in following data
                 sValue = oEvent.getParameter("newValue");
                //sValue-- if you searching on search bar serachin any value this value show in sValue variable

                var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("PR_NO", sap.ui.model.FilterOperator.Contains, sValue)], false);
                var bindings = this.byId("idItemsTable").getBinding("items");
                // this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 

                bindings.filter(oFilter);
            },

            onSort: function (oEvent) {

                ////debugger;
                if (!this.onViewSort) {
                    this.onViewSort = sap.ui.xmlfragment("com.ibs.ibsappidealsalerorderreport.view.fragments.onsort", this);
                    this.getView().addDependent(this.onViewSort);
                }
                this.onViewSort.open();
            },
            onFilter: function (oEvent) {

                ////debugger;

                if (!this.onViewFilter) {
                    this.onViewFilter = sap.ui.xmlfragment("com.ibs.ibsappidealsalerorderreport.view.fragments.onfilter", this);
                    this.getView().addDependent(this.onViewFilter);
                }
                this.onViewFilter.open();
            },
            onReset:function(oEvent){
                ////debugger
                this.getView().byId("seachId").setValue("")
                this.getView().byId("sortTable").setType("Default")
                this.getView().byId("filtertble").setType("Default")

                var searchValue = 0
                if(searchValue != sValue){
                    searchValue = oEvent.getParameter("newValue");
                    //sValue-- if you searching on search bar serachin any value this value show in sValue variable
    
                    var oFilter = [];
                    var bindings = this.byId("idItemsTable").getBinding("items");
                    // this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 
    
                    bindings.filter(oFilter);
                    // var oBinding = oTable.getBinding("items");
                    bindings.sort(new Sorter("PR_NO", true));
                   
                }


                if(this.onViewFilter !== undefined){
                    this.onViewFilter.clearFilters();
                    this.getView().byId("idItemsTable").getBinding("items").filter();
                 }
              

                 },
                 handleConfirm2 : function (oEvent){
                    ////debugger
                    this.getView().byId("filtertble").setType("Emphasized")
                    var aFilters = [];
                    var insideFilter = [];
                    var aFilterItems = oEvent.getParameter("filterItems");
                    if (aFilterItems.length === 0) {
                        this.getView().byId("filtertble").setType("Transparent")
                    }
                    if(aFilterItems.length === 0){
                        this.onViewFilter.clearFilters();
                        this.getView().byId("idItemsTable").getBinding("items").filter();
                    }
                    var viewSettingDialogKey = aFilterItems[0].mProperties.key
    
                    aFilterItems.forEach(function (oItem) {
    
                        viewSettingDialogKey = oItem.getParent().getProperty("key");
    
                        
                            // hierarchyFlag = true;
                            insideFilter.push(new Filter("PR_NO", FilterOperator.EQ, oItem.getProperty('key')));
                        
                        
                    });
    
                    
    
                    aFilters.push(insideFilter);
                    this.getView().byId("idItemsTable").getBinding("items").filter(aFilters);
                    // this.getView().byId("idFilterBtn").setType("Emphasized");
    
                    // var count = this.getView().byId("idItemsTable").getBinding("items").aIndices.length;
                    // var Str = "Contract Colloaboration Requests (" + count + ")";
                    
    
                
    
                },

    




            handleConfirm: function (oEvent) {
                ////debugger;
                var sortItem = oEvent.getParameter("sortItem");
                var sortDesc = oEvent.getParameter("sortDescending");
                var oTable = this.getView().byId("idItemsTable");
                var oBinding = oTable.getBinding("items");
                oBinding.sort(new Sorter(sortItem.getKey(), sortDesc));

                if(sortDesc === false){
                    this.getView().byId("sortTable").setType("Emphasized");
                } else {
                    this.getView().byId("sortTable").setType("Transparent");
                }
            },

        });
    });




