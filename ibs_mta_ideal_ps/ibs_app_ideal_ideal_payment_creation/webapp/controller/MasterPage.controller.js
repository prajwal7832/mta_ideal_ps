// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealidealpaymentcreation.controller.MasterPage", {
//         onInit: function () {

//         }
//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealidealpaymentcreation/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,JSONModel,BusyIndicator,MessageBox,formatter,Filter,FilterOperator,Sorter) {
        "use strict";
        var id;
        var that;
        var appModulePath;
        var aFilter,url,sKey,sValue;
        var filters;
        return BaseController.extend("com.ibs.ibsappidealidealpaymentcreation.controller.MasterPage", {
            formatter: formatter,
            onInit: function () {
                that = this;
                that.oDataModel = this.getOwnerComponent().getModel();
                

                var oRouter = this.getOwnerComponent().getRouter();
              oRouter.getRoute("RouteMasterPage");
                var getRoute = oRouter.getRoute("RouteMasterPage");
                getRoute.attachMatched(this._onRouteMatched, this);

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);

            },

            _onRouteMatched : function(oEvent){
                debugger
                var g = this.getView().getParent().getParent();
				g.toBeginColumnPage(this.getView())
                
              id = '1100013';
            //   var aFilters = "(DISTRIBUTOR_ID eq '1100013')"
              var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
              var appPath = appId.replaceAll(".", "/");
              appModulePath = jQuery.sap.getModulePath(appPath);
             
              url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"'&$expand=TO_STATUS";
            //  that.onFilterSelect()
            that._getUserAttributes()
            //   that.readUserMasterEntities();

            },


            _getUserAttributes: function () {
                debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var attr = appModulePath + "/user-api/attributes";

                // that._sUserID = "darshan.l@intellectbizware.com";
                // that._sUserName = "Darshan Lad";
                // var obj = {
                //     userId:that._sUserID,
                //     userName: that._sUserName
                // }
                // var oModel = new JSONModel(obj);
                // that.getOwnerComponent().setModel(oModel, "userModel");
                // that.readUserMasterEntities(null,url,"onRoutMatch");

                //  /////////that.readUserMasterData(that._sUserID);
                
            

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
                            BusyIndicator.hide()
                            MessageBox.error("Error while reading User Attribute");
                        }
                    });
                });

            },


            onFilterSelect: function (oEvent) {
                debugger

                this.getView().byId("seachId").setValue("")
                this.getView().byId("sortTable").setType("Default")
                this.getView().byId("filtertble").setType("Default")

                if(oEvent === undefined){
                    this.getView().byId("filtertble").setType("Transparent");
                var oBinding = this.byId("idItemsTable").getBinding("items"),
                    sKey="PayReqCreated"
                    // Array to combine filters
                   var aFilters = []

                if(sKey == "All"){               
                    var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"'&$expand=TO_STATUS";
                    that.readUserMasterEntities(null,url)
                    // this.handleCancel();
                    this.handleConfirm2()
                    this.getView().byId("idIconTabBar").setSelectedKey("PayReqCreated")
                    
                    
                }else if(sKey == "PayReqUpdate"){
                    aFilter = "(STATUS eq 7)";
                    var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                    that.readUserMasterEntities(aFilter,url)
                    // this.handleCancel();
                    this.handleConfirm2()
                    this.getView().byId("idIconTabBar").setSelectedKey("PayReqCreated")
                }
                else if (sKey == "PayReqCreated") {
                     aFilter = "(STATUS eq 1)";
                     var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                    //  this.handleCancel();
                     that.handleConfirm2()
                     this.getView().byId("idIconTabBar").setSelectedKey("PayReqCreated")


                }
                else if (sKey == "PayReqInApproval") {
                     aFilter = "(STATUS eq 2)";
                     var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                    //  this.handleCancel();
                     that.handleConfirm2()
                     this.getView().byId("idIconTabBar").setSelectedKey("PayReqCreated")

                }
                else if (sKey == "PayReqApproved") {
                     aFilter = "(STATUS eq 3)";

                     var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                    //  this.handleCancel();
                     that.handleConfirm2()
                     this.getView().byId("idIconTabBar").setSelectedKey("PayReqCreated")
                     


                } 
                 else if (sKey == "PayReqSendback") {
                     aFilter = "(STATUS eq 5)";

                     var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                    //  this.handleCancel();
                     that.handleConfirm2()
                     this.getView().byId("idIconTabBar").setSelectedKey("PayReqCreated")


                }
             
               else if(sKey == "PaymReqHold"){
                aFilter = "(STATUS eq 6)";

                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                that.readUserMasterEntities(aFilter,url)
                // this.handleCancel();
                that.handleConfirm2()
                this.getView().byId("idIconTabBar").setSelectedKey("PayReqCreated")
               }

                }
                 else {
                this.getView().byId("filtertble").setType("Transparent");
                var oBinding = this.byId("idItemsTable").getBinding("items"),
                    sKey=that.getView().byId("idIconTabBar").getSelectedKey()
                    // Array to combine filters
                   var aFilters = []

                if(sKey == "All"){               
                    var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"'&$expand=TO_STATUS";
                    that.readUserMasterEntities(null,url)
                    // this.handleCancel();
                    this.handleConfirm2()
                    
                    
                }else if(sKey == "PayReqUpdate"){
                    aFilter = "(STATUS eq 7)";
                    var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                    that.readUserMasterEntities(aFilter,url)
                    // this.handleCancel();
                    this.handleConfirm2()
                  
                }
                else if (sKey == "PayReqCreated") {
                     aFilter = "(STATUS eq 1)";
                     var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                    //  this.handleCancel();
                     that.handleConfirm2()


                }
                else if (sKey == "PayReqInApproval") {
                     aFilter = "(STATUS eq 2)";
                     var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                    //  this.handleCancel();
                     that.handleConfirm2()


                }
                else if (sKey == "PayReqApproved") {
                     aFilter = "(STATUS eq 3)";
                     var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                    //  this.handleCancel();
                     that.handleConfirm2()
                     


                } 
                 else if (sKey == "PayReqSendback") {
                     aFilter = "(STATUS eq 5)";
                     var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                     that.readUserMasterEntities(aFilter,url)
                    //  this.handleCancel();
                     that.handleConfirm2()


                }
             
               else if(sKey == "PaymReqHold"){
                aFilter = "(STATUS eq 6)";

                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"' and "+ aFilter +"&$expand=TO_STATUS";
                that.readUserMasterEntities(aFilter,url)
                // this.handleCancel();
                that.handleConfirm2()
               }
            }

            },
            readUserMasterEntities: function (aFilter,url,sType) {
                debugger
               
                // var no = "1100013";
                // var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"'&$expand=TO_STATUS";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger
                        sKey = that.getView().byId("idIconTabBar").getSelectedKey()
                        var aIntialData = {
                            value: []
                        };

                        if(sType=== "onRoutMatch"){
                            for(var i=0;i<data.value.length;i++){
                                if(data.value[i].POP_NO === null || data.value[i].POP_NO === undefined || data.value[i].POP_NO === ""){
                                    data.value[i].POP_NO = data.value[i].POP_NO;
                                }else{
                                    data.value[i].POP_NO = data.value[i].POP_NO.toString();
                                } 
                            }
                            var oObj = {
                                "Created": 0,
                                "InApprove": 0,
                                "Approved":0,
                                "Sendback":0,
                                "Hold":0,
                                "Update":0,
                                "All": data.value.length
                            }

                            
                            for (var j = 0; j < data.value.length; j++) {
                                // data.value[j].STATUS = String(data.value[j].STATUS);
                                if (data.value[j].STATUS === 1) {
                                    aIntialData.value.push(data.value[j]);
                                    oObj.Created = oObj.Created + 1
                                }
                                else if (data.value[j].STATUS === 2) {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.InApprove = oObj.InApprove + 1
                                }
                                else if (data.value[j].STATUS === 3) {
                                    oObj.Approved = oObj.Approved + 1
                                }
                                else if (data.value[j].STATUS === 5) {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.Sendback = oObj.Sendback + 1
                                } 
                                else if (data.value[j].STATUS === 6) {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.Hold = oObj.Hold + 1
                                }else if(data.value[j].STATUS === 7){
                                    oObj.Update = oObj.Update + 1
                                }
                            }
    
                            var oModel = new JSONModel(oObj);
                            that.getView().setModel(oModel, "countModel")
                            
                         
                            var oModel = new JSONModel(aIntialData);
                            that.getView().setModel(oModel,"supplier");
                        }
                        else {
                        for(var i=0;i<data.value.length;i++){
                            if(data.value[i].POP_NO === null || data.value[i].POP_NO === undefined || data.value[i].POP_NO === ""){
                                data.value[i].POP_NO = data.value[i].POP_NO;
                                    }else{
                                    data.value[i].POP_NO = data.value[i].POP_NO.toString();
                                       }
                                    // data.value[i].PR_CREATION_DATE = String(new Date(data.value[i].PR_CREATION_DATE));
                                   }


                        
                       var  supplierModel = new sap.ui.model.json.JSONModel(data);
                        that.getView().setModel(supplierModel, "supplier");
                        // that.getView().getModel("supplier").refresh(true)
                        that.getView().byId("idItemsTable").removeSelections(true);

                        if(sKey === "PayReqCreated"){
                        that.getView().getModel("countModel").setProperty("/Created", data.value.length)
                        }
                        else if(sKey === "PayReqInApproval"){
                            that.getView().getModel("countModel").setProperty("/InApprove", data.value.length)  
                        }else if(sKey === "PayReqInApproval"){
                            that.getView().getModel("countModel").setProperty("/InApprove", data.value.length)  
                        }else if(sKey === "PayReqApproved"){
                            that.getView().getModel("countModel").setProperty("/Approved", data.value.length)  
                        }else if(sKey === "PaymReqHold"){
                            that.getView().getModel("countModel").setProperty("/Hold", data.value.length)
                        }else if(sKey === "PayReqSendback"){
                            that.getView().getModel("countModel").setProperty("/Sendback", data.value.length)
                        }else if(sKey === "All"){
                            that.getView().getModel("countModel").setProperty("/All", data.value.length)
                        }else if(sKey === "PayReqUpdate"){
                            that.getView().getModel("countModel").setProperty("/Update", data.value.length)
                        }

                    }
                    },
                    error: function (e) {
                        debugger
                        BusyIndicator.hide()
                        MessageBox.error(e.responseText);
                    }
                });
            },
            orderCreate: function () {
                debugger
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("DetailPage",{	
                    loginId: id
				});
            },
            onSelectionItem: function (oEvent) {
                debugger
                var data = oEvent.getSource().getSelectedItem().getBindingContext("supplier").getObject();


                //Get data in obj and set in json model.

                var navObj = {
                    "PR_NO": data.SAP_ORDER_NO
                
                };

                // var oViewModel = new sap.ui.model.json.JSONModel(navObj);
                // this.getOwnerComponent().setModel(oViewModel, "vendorDetail");
                
                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("View2",{
                    "PR_NO": data.POP_NO
                   
                });

            },
            onFilter: function (oEvent) {

                debugger;

                if (!this.onViewFilter) {
                    this.onViewFilter = sap.ui.xmlfragment("com.ibs.ibsappidealidealpaymentcreation.view.fragments.onfilter", this);
                    this.getView().addDependent(this.onViewFilter);
                }
                this.onViewFilter.open();
            },
            onSort: function (oEvent) {

                //debugger;
                if (!this.onViewSort) {
                    this.onViewSort = sap.ui.xmlfragment("com.ibs.ibsappidealidealpaymentcreation.view.fragments.onsort", this);
                    this.getView().addDependent(this.onViewSort);
                }
                this.onViewSort.open();
            },

            
            handleConfirm2 : function (oEvent){
                debugger

                var selectedkey = this.getView().byId("idIconTabBar").mProperties.selectedKey

                var oObj = {

                    "Created": 0,
                    "InApprove": 0,
                    "Approved": 0,
                    "Hold":0,
                    "Sendback":0,
                    "All": 0
                }
                    if(oEvent === undefined){
                        this.getView().byId("filtertble").setType("Default") 
                    }else{  

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
                        insideFilter.push(new Filter("POP_NO", FilterOperator.Contains, oItem.getProperty('key')));
                    
                    
                });   

                aFilters.push(insideFilter);
                this.getView().byId("idItemsTable").getBinding("items").filter(aFilters);
                // this.getView().byId("idFilterBtn").setType("Emphasized");

                if (sKey == "All") {
                    oObj.Created =  that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove = that.getView().getModel("countModel").getData().InApprove;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.Hold = that.getView().getModel("countModel").getData().Hold;
                    oObj.Sendback = that.getView().getModel("countModel").getData().Sendback;
                    oObj.All = this.getView().byId("idItemsTable").mAggregations.items.length

                } else if (sKey == "PayReqCreated") {
                    oObj.Created = this.getView().byId("idItemsTable").mAggregations.items.length;
                    oObj.InApprove = that.getView().getModel("countModel").getData().InApprove;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.Hold = that.getView().getModel("countModel").getData().Hold;
                    oObj.Sendback = that.getView().getModel("countModel").getData().Sendback;
                    oObj.All = that.getView().getModel("countModel").getData().All


                }
                else if (sKey == "PayReqInApproval") {

                    oObj.Created = that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove = this.getView().byId("idItemsTable").mAggregations.items.length;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.Hold = that.getView().getModel("countModel").getData().Hold;
                    oObj.Sendback = that.getView().getModel("countModel").getData().Sendback;
                    oObj.All = that.getView().getModel("countModel").getData().All;

                } else if (sKey == "PayReqApproved") {
                    oObj.Created = that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove= that.getView().getModel("countModel").getData().InApprove;
                    oObj.Approved = this.getView().byId("idItemsTable").mAggregations.items.length;
                    oObj.Hold = that.getView().getModel("countModel").getData().Hold;
                    oObj.Sendback = that.getView().getModel("countModel").getData().Sendback;
                    oObj.All = that.getView().getModel("countModel").getData().All;


                } else if (sKey == "PaymReqHold") {
                    oObj.Created = that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove = that.getView().getModel("countModel").getData().InApprove;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.Hold = this.getView().byId("idItemsTable").mAggregations.items.length;
                    oObj.Sendback = that.getView().getModel("countModel").getData().Sendback;
                    oObj.All = that.getView().getModel("countModel").getData().All;

                } else if(sKey == "PayReqSendback"){
                    oObj.Created = that.getView().getModel("countModel").getData().Created;
                    oObj.InApprove = that.getView().getModel("countModel").getData().InApprove;
                    oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                    oObj.Hold = that.getView().getModel("countModel").getData().Hold;
                    oObj.Sendback = this.getView().byId("idItemsTable").mAggregations.items.length;
                    oObj.All = that.getView().getModel("countModel").getData().All;
                }
                var oModel = new JSONModel(oObj);
                that.getView().setModel(oModel, "countModel")
                that.getView().getModel("countModel").refresh(true)
         }
            },

  
            handleCancel : function(){
                debugger
                // this.onViewFilter.close();
                this.getView().byId("filtertble").setType("Default");
                // this.onViewFilter.destroy();
                this.onViewFilter= undefined;


            },



            handleConfirm: function (oEvent) {
                debugger;
                // this.getView().byId("sortTable").setType("Emphasized")
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


            onSearch: function (oEvent) {
                debugger

                // sValue== in this variable stored the user input vaule in following data
                 sValue = Number(oEvent.getParameter("newValue"));
                //sValue-- if you searching on search bar serachin any value this value show in sValue variable
                
                // var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("PR_NO", sap.ui.model.FilterOperator.Contains, sValue)], false);
                var oFilter = new sap.ui.model.Filter([
                    new sap.ui.model.Filter("POP_NO", sap.ui.model.FilterOperator.Contains, sValue)]);
                var bindings = this.byId("idItemsTable").getBinding("items");
                // this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 
                bindings.filter(oFilter);
                if(sValue==''){
                    bindings.filter([]);
                }
            },
            onReset:function(oEvent){
                debugger;
                // that.readUserMasterEntities(null,url,"onRoutMatch");
               this. onFilterSelect()
                this.getView().byId("seachId").setValue("");
                this.getView().byId("sortTable").setType("Default")
                this.getView().byId("filtertble").setType("Default")
                // this.getView().byId("resetTable").setType("Emphasized")
                /////filter reset
            if(this.onViewFilter !== undefined){
               this.onViewFilter.clearFilters();
               this.getView().byId("idItemsTable").getBinding("items").filter();
            }
          

            ///////////////sort reset
            var searchValue = 0
            if(searchValue != sValue){
                searchValue = oEvent.getParameter("newValue");
                //sValue-- if you searching on search bar serachin any value this value show in sValue variable

                var oFilter = [];
                var bindings = this.byId("idItemsTable").getBinding("items");
                // this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 

                bindings.filter(oFilter);
                // var oBinding = oTable.getBinding("items");
                bindings.sort(new Sorter("POP_NO", true));
               
            }
            
            }
            
        });
    });

