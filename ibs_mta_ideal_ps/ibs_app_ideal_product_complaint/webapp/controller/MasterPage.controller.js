// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealproductcomplaint.controller.MasterPage", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealproductcomplaint/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
],
function (Controller,JSONModel,BusyIndicator,MessageBox,formatter,Filter,FilterOperator,Sorter) {
    "use strict";
    var id,aFilter,url;
    var that,sKey;
    var appModulePath;
    var sValue;
    return Controller.extend("com.ibs.ibsappidealproductcomplaint.controller.MasterPage", {
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
            
          id = oEvent.getParameter('arguments').loginId;

          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          appModulePath = jQuery.sap.getModulePath(appPath);
         url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"'&$expand=TO_STATUS";

        //   that.readUserMasterEntities();
          that._getUserAttributes();

        },

        _getUserAttributes: function () {
            debugger
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);
            var attr = appModulePath + "/user-api/attributes";


            // that._sUserID = "prajwal.g@intellectbizware.com";
            // that._sUserName = "Prajwal Gaikwad";
            // var obj = {
            //     userId: that._sUserID,
            //     userName: that._sUserName
            // }
            // var oModel = new JSONModel(obj);
            // that.getOwnerComponent().setModel(oModel, "userModel");
            // that.readUserMasterEntities(null, url, "onRoutMatch");

            //// that.readUserMasterData(that._sUserID);




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
                      that.readUserMasterEntities(null, url, "onRoutMatch");
                    },
                    error: function (oError) {
                        MessageBox.error("Error while reading User Attribute");
                    }
                });
            });



        },



        onFilterSelect: function (oEvent,onReset) {
            debugger

            this.getView().byId("seachId").setValue("")
            this.getView().byId("sortTable").setType("Default")
            this.getView().byId("filtertble").setType("Default")

            if(oEvent === undefined){
                that.getView().byId("filtertble").setType("Transparent");
            var oBinding = this.byId("idItemsTable").getBinding("items"),
                sKey="ProcomplaintCreated"
                // Array to combine filters
               var aFilters = []
// 1-created 4-reject 3 approved
            if(sKey == "All"){               
                var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '" + id + "'&$expand=TO_STATUS";
                that.readUserMasterEntities(null,url)
                that.getView().byId("idIconTabBar").setSelectedKey("ProcomplaintCreated")
                that.handleCancel();
                that.handleConfirm2()
                
                
                
            }
            else if (sKey == "ProcomplaintCreated") {
                 aFilter = "(STATUS eq 1)";
                 var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                 that.readUserMasterEntities(aFilter,url)
                 that.getView().byId("idIconTabBar").setSelectedKey("ProcomplaintCreated")
                 that.handleCancel();
                 that.handleConfirm2()
                


            }
            else if (sKey == "Procomplaintrejected") {
                 aFilter = "(STATUS eq 4)";
                 var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                 that.readUserMasterEntities(aFilter,url)
                 that.getView().byId("idIconTabBar").setSelectedKey("ProcomplaintCreated")
                 that.handleCancel();
                 that.handleConfirm2()
                 

            }
            else if (sKey == "Procomplaintapproved") {
                 aFilter = "(STATUS eq 3)";

                 var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                 that.readUserMasterEntities(aFilter,url)
                 that.getView().byId("idIconTabBar").setSelectedKey("ProcomplaintCreated")
                 that.handleCancel();
                 that.handleConfirm2()
                 
           
           }

            }else{

            var oBinding = this.byId("idItemsTable").getBinding("items"),
                sKey = that.getView().byId("idIconTabBar").getSelectedKey()
            // Array to combine filters
            var aFilters = []



            if (sKey === "All") {
                var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '" + id + "'&$expand=TO_STATUS";
                that.readUserMasterEntities(null, url)
                that.handleCancel();
                that.handleConfirm2();
            }
            else if (sKey == "ProcomplaintCreated") {
                aFilter = "(STATUS eq 1)";
                var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                that.readUserMasterEntities(aFilter,url)
                that.handleCancel();
                that.handleConfirm2()
                


            }
            else if (sKey == "Procomplaintapproved") {
                aFilter = "(STATUS eq 3)";

                var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
                that.readUserMasterEntities(aFilter,url)
                that.handleCancel();
                that.handleConfirm2()
                
          
          }
          else if (sKey == "Procomplaintrejected") {
            aFilter = "(STATUS eq 4)";
            var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and " + aFilter + "&$expand=TO_STATUS";
            that.readUserMasterEntities(aFilter,url)
            that.handleCancel();
            that.handleConfirm2()
           

       }
         
        }
        },
        readUserMasterEntities: function (aFilter, url, sType) {
            debugger
           
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            // var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$expand=TO_STATUS";
            //  var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=DISTRIBUTOR_ID eq '"+ id +"'&$expand=TO_STATUS";

            $.ajax({
                url: url,
                type: 'GET',
                data: null,
                contentType: 'JSON',
                success: function (data, responce) {
                    debugger
                    sKey = that.getView().byId("idIconTabBar").getSelectedKey()
                    var aIntialData = {
                        value: []
                    };
                    if (sType === "onRoutMatch") {
                    for(var i=0;i<data.value.length;i++){
                        if(data.value[i].PPR_NO === null || data.value[i].PPR_NO === undefined || data.value[i].PPR_NO === ""){
                            data.value[i].PPR_NO = data.value[i].PPR_NO;
                                }else{
                                data.value[i].PPR_NO = data.value[i].PPR_NO.toString();
                                   }
                                // data.value[i].PR_CREATION_DATE = String(new Date(data.value[i].PR_CREATION_DATE));
                               }


                               var oObj = {
                                "Created": 0,
                              
                              "Approved": 0,
                              "Rejected": 0,
                            
                              "All": data.value.length
                          }

                          for (var j = 0; j < data.value.length; j++) {
                            // data.value[j].STATUS = String(data.value[j].STATUS);
                            if (data.value[j].STATUS === 1) {
                                aIntialData.value.push(data.value[j]);
                                oObj.Created = oObj.Created + 1
                            }
                            
                            else if (data.value[j].STATUS === 4) {
                                oObj.Rejected = oObj.Rejected + 1
                            }
                            else if (data.value[j].STATUS === 3) {
                                // aIntialData.value.push(data.value[j]);
                                oObj.Approved = oObj.Approved + 1
                            }
                        }

                        var oModel = new JSONModel(oObj);
                        that.getView().setModel(oModel, "countModel");


                   var  supplierModel = new sap.ui.model.json.JSONModel(aIntialData);
                    that.getView().setModel(supplierModel, "supplier");
                    
                    that.getView().getModel("supplier").refresh(true)
                    that.getView().byId("idItemsTable").removeSelections(true);
                    } else{
                        for(var i=0;i<data.value.length;i++){
                            if(data.value[i].PPR_NO === null || data.value[i].PPR_NO === undefined || data.value[i].PPR_NO === ""){
                                data.value[i].PPR_NO = data.value[i].PPR_NO;
                                    }else{
                                    data.value[i].PPR_NO = data.value[i].PPR_NO.toString();
                                       }
                                    // data.value[i].PR_CREATION_DATE = String(new Date(data.value[i].PR_CREATION_DATE));
                                   }
                                   var  supplierModel = new sap.ui.model.json.JSONModel(data);
                                   that.getView().setModel(supplierModel, "supplier");
                                   // that.getView().getModel("supplier").refresh(true)
                                   that.getView().byId("idItemsTable").removeSelections(true);

                                   if(sKey === "ProcomplaintCreated"){
                                    that.getView().getModel("countModel").setProperty("/Created", data.value.length)
                                    }else if(sKey === "Procomplaintapproved"){
                                        that.getView().getModel("countModel").setProperty("/Approved", data.value.length)  
                                    }else if(sKey === "Procomplaintrejected"){
                                        that.getView().getModel("countModel").setProperty("/Rejected", data.value.length)
                                    }else if(sKey === "All"){
                                        that.getView().getModel("countModel").setProperty("/All", data.value.length)
                                    }
                    }


                },
                error: function (e) {
                    debugger
                    BusyIndicator.hide();
                    MessageBox.error(e.responseText);
                }
            });
        },

        onSelectionItem: function (oEvent) {
            debugger
            BusyIndicator.show()
            var data = oEvent.getSource().getSelectedItem().getBindingContext("supplier").getObject();

            var oViewModel = new sap.ui.model.json.JSONModel(data);
                this.getOwnerComponent().setModel(oViewModel, "vendorDetail");
            
            this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("DetailPage",{
                "PR_NO": data.PPR_NO,
                
            });

        },
        orderCreate: function () {
            debugger
            BusyIndicator.show()
            this.getView().getModel("appView").setProperty("/layout", "OneColumn");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ComplaintPage",{
                "loginId":id
            });
            
        },
        
        onSearch: function (oEvent) {
            debugger

            // sValue== in this variable stored the user input vaule in following data
             sValue = Number(oEvent.getParameter("newValue"));
            var sValue1 = (oEvent.getParameter("newValue"));
            //sValue-- if you searching on search bar serachin any value this value show in sValue variable
            
            // var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("PR_NO", sap.ui.model.FilterOperator.Contains, sValue)], false);
            var oFilter = new sap.ui.model.Filter([
                new sap.ui.model.Filter("PPR_NO", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("PROD_GRP", sap.ui.model.FilterOperator.Contains, sValue1)]);
            var bindings = this.byId("idItemsTable").getBinding("items");
            // this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 
            bindings.filter(oFilter);
            if(sValue==''){
                bindings.filter([]);
            }
        },
        onSort: function (oEvent) {

            debugger; 
            if (!this.onViewSort) {
                this.onViewSort = sap.ui.xmlfragment("com.ibs.ibsappidealproductcomplaint.view.fragments.onsort", this);
                this.getView().addDependent(this.onViewSort);
            }
            this.onViewSort.open();
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
        onFilter: function (oEvent) {

            //debugger;

            if (!this.onViewFilter) {
                this.onViewFilter = sap.ui.xmlfragment("com.ibs.ibsappidealproductcomplaint.view.fragments.onfilter", this);
                this.getView().addDependent(this.onViewFilter);
            }
            this.onViewFilter.open();
        },
        handleConfirm2 : function (oEvent){
            debugger
            var selectedkey = this.getView().byId("idIconTabBar").mProperties.selectedKey
            var oObj = {

                "Created": 0,
                "Approved": 0,
                "Rejected": 0,
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
                    insideFilter.push(new Filter("PPR_NO", FilterOperator.EQ, oItem.getProperty('key')));
            });
            aFilters.push(insideFilter);
            this.getView().byId("idItemsTable").getBinding("items").filter(aFilters);
            // this.getView().byId("idFilterBtn").setType("Emphasized");
            
            if (sKey ==="All") {
                oObj.Created = that.getView().getModel("countModel").getData().Created;
               
                oObj.Rejected = that.getView().getModel("countModel").getData().Rejected;
                oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                oObj.All = this.getView().byId("idItemsTable").mAggregations.items.length

            } else if (sKey === "Procomplaintrejected") {
                oObj.Created = that.getView().getModel("countModel").getData().Created;
                
                oObj.Rejected = this.getView().byId("idItemsTable").mAggregations.items.length;
                oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                oObj.All = that.getView().getModel("countModel").getData().All


            } else if (sKey === "ProcomplaintCreated") {

                oObj.Created = this.getView().byId("idItemsTable").mAggregations.items.length;
                
                oObj.Rejected = that.getView().getModel("countModel").getData().Rejected;
                oObj.Approved = that.getView().getModel("countModel").getData().Approved;
                oObj.All = that.getView().getModel("countModel").getData().All

            } else if (sKey === "Procomplaintapproved") {
                oObj.Created = that.getView().getModel("countModel").getData().Created;
                
                oObj.Rejected = that.getView().getModel("countModel").getData().Rejected;
                oObj.Approved = this.getView().byId("idItemsTable").mAggregations.items.length;;
                oObj.All = that.getView().getModel("countModel").getData().All


            }
            var oModel = new JSONModel(oObj);
            that.getView().setModel(oModel, "countModel")




        }
        },
        handleCancel : function(){
            debugger
            // this.onViewFilter.close();
            this.getView().byId("filtertble").setType("Default");
            this.onViewFilter.destroy();
            this.onViewFilter= undefined;


        },
        onReset:function(oEvent){
            //debugger;
            this.getView().byId("seachId").setValue("")
            this.getView().byId("sortTable").setType("Default")
            this.getView().byId("filtertble").setType("Default")
            this.onFilterSelect();
            // this.getView().byId("resetTable").setType("Emphasized")
        if(this.onViewFilter !== undefined){
           this.onViewFilter.clearFilters();
           this.getView().byId("idItemsTable").getBinding("items").filter();
        }
        

        var searchValue = 0
        if(searchValue != sValue){
            searchValue = oEvent.getParameter("newValue");
            //sValue-- if you searching on search bar serachin any value this value show in sValue variable

            var oFilter = [];
            var bindings = this.byId("idItemsTable").getBinding("items");
            // this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 

            bindings.filter(oFilter);
            // var oBinding = oTable.getBinding("items");
            bindings.sort(new Sorter("PPR_NO", true));
           
        }
        
        }
    });
});
