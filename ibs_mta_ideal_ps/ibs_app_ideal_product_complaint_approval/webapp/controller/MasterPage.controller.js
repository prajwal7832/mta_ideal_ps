// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealproductcomplaintapproval.controller.MasterPage", {
//         onInit: function () {

//         }
//     });
// });

// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealproductcomplaintapproval.controller.MasterPage", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealproductcomplaintapproval/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
],
function (Controller,JSONModel,BusyIndicator,MessageBox,formatter,Filter,FilterOperator,Sorter) {
    "use strict";
    var id;
    var that;
    var appModulePath;
    var sValue,sFinalString;
    return Controller.extend("com.ibs.ibsappidealproductcomplaintapproval.controller.MasterPage", {
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
            
        //   id = oEvent.getParameter('arguments').loginId;

          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          appModulePath = jQuery.sap.getModulePath(appPath);

        //   that.readEntityData();
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
            // // that.readEntityData();
            // that.readUserMasterEntities();

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
                      that.readUserMasterEntities();
                    },
                    error: function (oError) {
                        MessageBox.error("Error while reading User Attribute");
                    }
                });
            });
        },
        readUserMasterEntities: async function () {
            debugger
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
                debugger
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
                            debugger;
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
                            debugger;
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
                                // debugger;
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
                                debugger;
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
            debugger
           
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$expand=TO_STATUS";

            $.ajax({
                url: url,
                type: 'GET',
                data: null,
                contentType: 'application/json',
                success: function (data, responce) {
                    debugger
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
                    debugger
                    that.getView().getModel("supplier").refresh(true)
                    that.getView().byId("idItemsTable").removeSelections(true);



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
                FLAG : true
                
            });

        },
        orderCreate: function () {
            debugger
            BusyIndicator.show()
            this.getView().getModel("appView").setProperty("/layout", "OneColumn");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ComplaintPage");
            
        },
        onSearch: function (oEvent) {
            debugger

            // sValue== in this variable stored the user input vaule in following data
             sValue = Number(oEvent.getParameter("newValue"));
            //sValue-- if you searching on search bar serachin any value this value show in sValue variable
            
            // var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("PR_NO", sap.ui.model.FilterOperator.Contains, sValue)], false);
            var oFilter = new sap.ui.model.Filter([
                new sap.ui.model.Filter("PPR_NO", sap.ui.model.FilterOperator.Contains, sValue)]);
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
                this.onViewSort = sap.ui.xmlfragment("com.ibs.ibsappidealproductcomplaintapproval.view.fragments.onsort", this);
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

            debugger;

            if (!this.onViewFilter) {
                this.onViewFilter = sap.ui.xmlfragment("com.ibs.ibsappidealproductcomplaintapproval.view.fragments.onfilter", this);
                this.getView().addDependent(this.onViewFilter);
            }
            this.onViewFilter.open();
        },
        handleConfirm2 : function (oEvent){
            debugger
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
        },
        onReset:function(oEvent){
            debugger;
            this.getView().byId("seachId").setValue("")
            this.getView().byId("sortTable").setType("Default")
            this.getView().byId("filtertble").setType("Default")
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

