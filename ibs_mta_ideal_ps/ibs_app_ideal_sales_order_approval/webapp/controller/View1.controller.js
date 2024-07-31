// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealsalesorderapproval.controller.View1", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealsalesorderapproval/model/formatter",
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
        return BaseController.extend("com.ibs.ibsappidealsalesorderapproval.controller.View1", {
            formatter: formatter,
            onInit: function (oEvent) {
                //debugger
                that = this;
                that.oDataModel = this.getOwnerComponent().getModel();
                supplierModel = new sap.ui.model.json.JSONModel();

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteView1");
            
                var getRoute = oRouter.getRoute("RouteView1");
                getRoute.attachMatched(this._onRouteMatched, this);
                // that.readUserMasterEntities();
                

                //   that._getUserAttributes();
                //   that.readEntityData();
                // var id = oEvent.getOwnerComponent().getParameter("loginId");

                
            
            },

            _onRouteMatched : function (oEvent) {
                //debugger
                var aFilter;
                 id = oEvent.getParameter('arguments').loginId;
                 that.readUserMasterEntities();

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
                 //debugger;
                var aFilters = "(DISTRIBUTOR_ID eq '1100013')"
                    
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var attr = appModulePath + "/user-api/attributes";
    
                
                // that._sUserID = "darshan.l@intellectbizware.com";
                // that._sUserName = "Darshan Lad";
                // var obj = {
                //     userId:that._sUserID,
                //     userName: that._sUserName
                // }  
                // var oModel = new JSONModel(obj);
                // that.getOwnerComponent().setModel(oModel, "userModel");
                // this.readUserMasterEntities();
                // that.readEntityData();
                


                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: attr,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (data, response) {
                            //debugger;
                            that._sUserID = data.email.toLowerCase().trim();
                            that._sUserName = data.firstname + " " + data.lastname;
                            // that.readMasterIdealUser();
                            var obj = {
                                userId: data.email.toLowerCase(),
                                userName: data.firstname + " " + data.lastname
                            }
                            var oModel = new JSONModel(obj);
                            that.getOwnerComponent().setModel(oModel, "userModel");

                            that.readUserMasterEntities();
                        },
                        error: function (oError) {
                            //debugger;
                            MessageBox.error("Error while reading User Attributes");
                        }
                    });
                });
            },
            readUserMasterEntities: async function () {
            //debugger
            var hierarchyLevel = await that.calView();
            var entityCode = await that.calViewEntity();
			
			var aEntityArray = [];
			var sREG;
			if (aFilter === undefined || aFilter === null || aFilter === "") {
				aFilter = [];
			}
			else {
				that.sFilter = aFilter;
			}
			if(entityCode.length === 0){
				MessageBox.error("No claims are assigned for " + that._sUserID + ". Contact admin team.");
			}
            else{ 
				if (that.urlReqNo !== undefined) {
					sREG = "(REQUEST_NO eq " + that.urlReqNo + ")";
				}
				else {
					sREG = "";
				}
				sFinalString = "";
						for (var i = 0; i < entityCode.length; i++) {
							if (i < entityCode.length - 1) {
								var concat = "(APPROVER_LEVEL eq " + hierarchyLevel[i] + ")";
								sFinalString = sFinalString + concat + " or ";
							}
							else {
								var concat = "(APPROVER_LEVEL eq " + hierarchyLevel[i] +")";
								sFinalString = sFinalString + concat;
							}
						}

						that.EntityFilters = aFilter
						sFinalString = "(" + sFinalString + ")";
                        var sLoginId = "(DISTRIBUTOR_ID eq '1100013')"
						var sStatus = "((PR_STATUS eq '1') or (PR_STATUS eq '4'))";
                        // var sStatus= aFilter
						if(sREG === ""){
							var aFilter = sFinalString + " and " + sStatus + " and " + sLoginId;
						}else{
							var aFilter = sREG + " and " + sFinalString + " and " + sStatus + " and " + sLoginId;
						}
						that.readEntityData(aFilter);
			}
            },
            calView : function(){
                //debugger
                var userEmail = that._sUserID;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=TYPE eq 'PR'"
                // ?$filter=(USER_IDS contains '" + userEmail + "')";
                // var data = { $expand: 'TO_USER_ENTITIES' };
                    var hLevelArr = [];
                    return new Promise(function(resolve,reject){
                    $.ajax({
                        url: url,
                        type: "GET",
                        contentType: 'application/json',
                        // data: data,
                        success: function (data, response) {
                            //debugger;
                            var mLevel = data.value.map((x)=>{if(x.USER_IDS.includes(that._sUserID)){return x.LEVEL}});
                            for(var i = 0; i < mLevel.length; i++){
                            if(mLevel[i] === undefined || mLevel[i] === null || mLevel[i] === "")
                            {
                                continue;
                            }
                            else
                            {
                                hLevelArr.push(mLevel[i]);
                            }
                        }
                            resolve(hLevelArr);
                            // const fruits = new Map([data]);
                        },
                        error: function (error) {
                            //debugger;
                            BusyIndicator.hide();
                            var oXML,oXMLMsg;
                            if (context.isValidJsonString(error.responseText)) {
                                oXML = JSON.parse(error.responseText);
                                oXMLMsg = oXML.error["message"];
                            } else {
                                oXMLMsg = error.responseText
                            }
                            MessageBox.error(oXMLMsg);
                        }
                    });
                })
                },


                calViewEntity : function(){
                    var userEmail = that._sUserID;
                    var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                    var appPath = appId.replaceAll(".", "/");
                    var appModulePath = jQuery.sap.getModulePath(appPath);
                    var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=TYPE eq 'PR'"
                    // ?$filter=(USER_IDS contains '" + userEmail + "')";
                    // var data = { $expand: 'TO_USER_ENTITIES' };
                        var hLevelArr = [];
                        return new Promise(function(resolve,reject){
                        $.ajax({
                            url: url,
                            type: "GET",
                            contentType: 'application/json',
                            // data: data,
                            success: function (data, response) {
                                // //debugger;
                                var mLevel = data.value.map((x)=>{if(x.USER_IDS.includes(that._sUserID)){return x.ENTITY_CODE}});
                                for(var i = 0; i < mLevel.length; i++){
                                if(mLevel[i] === undefined || mLevel[i] === null || mLevel[i] === "")
                                {
                                    continue;
                                }
                                else
                                {
                                    hLevelArr.push(mLevel[i]);
                                }
                            }
                                resolve(hLevelArr);
                                // const fruits = new Map([data]);
                            },
                            error: function (error) {
                                // //debugger;
                                BusyIndicator.hide();
                                var oXML,oXMLMsg;
                                if (context.isValidJsonString(error.responseText)) {
                                    oXML = JSON.parse(error.responseText);
                                    oXMLMsg = oXML.error["message"];
                                } else {
                                    oXMLMsg = error.responseText
                                }
                                MessageBox.error(oXMLMsg);
                            }
                        });
                    })
            },

                readEntityData: function (aFilter) {
                //debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
               
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$expand=TO_STATUS,TO_ITEMS&$filter=" + aFilter;
                //  "/odata/v4/ideal-purchase-creation-srv/PrHeader?$expand=TO_STATUS,TO_ITEMS&$filter=" + aFilter
                // "/odata/v4/ideal-purchase-creation-srv/PrHeader?$expand=TO_STATUS";
                // var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$expand=TO_STATUS,TO_ITEMS";

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
                        //debugger
                        BusyIndicator.hide()
                        // MessageBox.error(e.responseText);
                    }
                });
            },

          

            onSelectionItem: function (oEvent) {
                //debugger
                BusyIndicator.show();
                var data = oEvent.getSource().getSelectedItem().getBindingContext("supplier").getObject();
                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

                //Get data in obj and set in json model.

                var navObj = {
                    "PR_NO": data.PR_NO,
                    "DISTRIBUTOR_ID": data.DISTRIBUTOR_ID,
                    "LAST_UPDATED_DATE": data.LAST_UPDATED_DATE,
                    "ORDER_TYPE": data.ORDER_TYPE,
                    "PAYMENT_METHOD": data.PAYMENT_METHOD,
                    "PR_CREATION_DATE": data.PR_CREATION_DATE,
                    "PR_STATUS": Number(data.PR_STATUS),
                    "REGION_CODE": data.REGION_CODE,
                    "SHIP_TO": data.SHIP_TO
                };

                var oViewModel = new sap.ui.model.json.JSONModel(navObj);
                this.getOwnerComponent().setModel(oViewModel, "vendorDetail");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("DetailPage",{
                    "PR_NO": data.PR_NO,
                    "PR_STATUS": data.PR_STATUS,
                    FLAG : true

                });

            },








            createColumnConfig: function () {
                //debugger;
                var aCols = [];

                aCols.push({
                    label: "PR No",
                    property: 'PR_NO'
                });

                aCols.push({
                    label: "Distributor Name",
                    property: 'DISTRIBUTOR_NAME'

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
                    label: "Total Amount",
                    property: 'GRAND_TOTAL',
                    type: EdmType.Date
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
                //debugger

                // sValue== in this variable stored the user input vaule in following data
                 sValue = oEvent.getParameter("newValue");
                //sValue-- if you searching on search bar serachin any value this value show in sValue variable

                var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("PR_NO", sap.ui.model.FilterOperator.Contains, sValue)], false);
                var bindings = this.byId("idItemsTable").getBinding("items");
                // this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 

                bindings.filter(oFilter);
            },

            onSort: function (oEvent) {

                debugger;
                if (!this.onViewSort) {
                    this.onViewSort = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorderapproval.view.fragments.onsort", this);
                    this.getView().addDependent(this.onViewSort);
                }
                this.onViewSort.open();
            },
            onFilter: function (oEvent) {

                //debugger;

                if (!this.onViewFilter) {
                    this.onViewFilter = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorderapproval.view.fragments.onfilter", this);
                    this.getView().addDependent(this.onViewFilter);
                }
                this.onViewFilter.open();
            },
            onReset:function(oEvent){
                //debugger
                this.getView().byId("seachId").setValue("")
                this.getView().byId("sortTable").setType("Default")
                this.getView().byId("filtertble").setType("Default")
                this.getView().byId("exportTable").setType("Default")

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
                    // debugger
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
                            insideFilter.push(new Filter("PR_NO", FilterOperator.Contains, oItem.getProperty('key')));
                        
                        
                    });
    
                    
    
                    aFilters.push(insideFilter);
                    this.getView().byId("idItemsTable").getBinding("items").filter(aFilters);
                    // this.getView().byId("idFilterBtn").setType("Emphasized");
    
                    // var count = this.getView().byId("idItemsTable").getBinding("items").aIndices.length;
                    // var Str = "Contract Colloaboration Requests (" + count + ")";
                    
    
                
    
                },

    




            handleConfirm: function (oEvent) {
                //debugger;
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




