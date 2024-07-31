sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/ui/core/BusyIndicator',
    "com/ibs/ibsappidealsalesorderapproval/model/formatter",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageBox, BusyIndicator, formatter, Spreadsheet, library, Filter, FilterOperator) {
        "use strict";

        var oDataModel, tableitems, headeritem, eventLog;
        var grpSelected, grupId, productSelectd, productgroup;
        var appId, appPath, appModulePath, gprocts;
        var that, prno, previousData, tableData, headerData, eventData, oDataModel2, stcokData, Pr_Status;
        var userData, level;
        return BaseController.extend("com.ibs.ibsappidealsalesorderapproval.controller.DetailPage", {
            formatter: formatter,
            onInit: function () {
                //debugger
                that = this;
                that._oDSC = this.byId("DynamicSideContent");
                oDataModel = that.getOwnerComponent().getModel();

                oDataModel2 = that.getOwnerComponent().getModel("onPremiseModel");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                oRouter.getRoute("DetailPage").attachPatternMatched(that.objectRouteMatched, that)


            },

            objectRouteMatched: function (oEvent) {
                //debugger
                BusyIndicator.hide()
                var flag = oEvent.getParameters().arguments.FLAG;
                if(flag === "true"){
                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                }else{
                this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                }

                this.getView().byId("StockValue").setVisible(false)
                that.getView().byId("stockColumn").setVisible(false);
                //    againstock = that.getView().byId("stockColumn").setVisible(false).mProperties.visible;

            
                appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                // previousData =that.getOwnerComponent().getModel("vendorDetail").getData()
                // userData = this.getOwnerComponent().getModel("userModel").getData();
                prno = Number(oEvent.getParameters().arguments.PR_NO)
                Pr_Status = oEvent.getParameters().arguments.PR_STATUS



                if (that.getUserData === undefined) {

                    var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                    var appPath = appId.replaceAll(".", "/");
                    appModulePath = jQuery.sap.getModulePath(appPath);
                    var attr = appModulePath + "/user-api/attributes";


                    // userData = that.getOwnerComponent().getModel("userModel").getData();
                    var id= "Purchase Request No" + " " + prno 
                    this.getView().byId("reqno").setText(id)

                    // that.firstloadfuction()
                    // that.readUserMasterEntities();
                    // this.visible();
                    // this.shipdetail();
                    // this.userrole()
                    // that.readTable();
                    // that.headerData();


                    return new Promise(function (resolve, reject) {
                        $.ajax({
                            url: attr,
                            type: 'GET',
                            contentType: 'application/json',
                            success: function (data, response) {
                                var obj = {
                                    userId: data.email.toLowerCase(),
                                    userName: data.firstname + " " + data.lastname
                                }
                                var oModel = new JSONModel(obj);
                                that.getOwnerComponent().setModel(oModel, "userModel");
    
                                userData = that.getOwnerComponent().getModel("userModel").getData();
                                that._sUserID = data.email.toLowerCase();
                                that.readUserMasterData(that._sUserID);
                                // that.readAccess(that._sUserID);
                            },
                            error: function (oError) {
                               BusyIndicator.hide();
                                MessageBox.error("Error while reading User Attributes");
                            }
                        });
                    });

                }
                else{
                    userData = this.getOwnerComponent().getModel("userModel").getData();
                    var id= "Purchase Request No:" + " " + prno 
                    this.getView().byId("reqno").setText(id)
                    that.firstloadfuction()
                    that.readUserMasterEntities();
                    this.visible();
                    this.shipdetail();
                    this.userrole()
                    // that.readTable();
                    // that.headerData();
                }
            },
            readUserMasterData : function(userEmail){
                var userDetailModel = new JSONModel();
    
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
    
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userEmail + "') and (ACTIVE eq 'X')";
                var data = { $expand: 'TO_USER_ENTITIES' };
    
                    $.ajax({
                        url: url,
                        type: "GET",
                        contentType: 'application/json',
                        data: data,
                        success: function (data, response) {
                            if(data.value.length === 0){
                                MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
                            }
                            else{
                                // if(data.value[0].TO_USER_ENTITIES.length > 0){
                                // 	that.checkUserId(requestNo,userEmail);
                                // }
                                // else{
                                // 	MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
                                // }
                                userData = that.getOwnerComponent().getModel("userModel").getData();
                        var id= "Purchase Request No:" + " " + prno 
                        that.getView().byId("reqno").setText(id)
        
                        that.firstloadfuction()
                    that.readUserMasterEntities();
                    // this.visible();
                    // this.shipdetail();
                    // this.userrole()
                    // that.readTable();
                    // that.headerData();
                            }
    
                            for(var i = 0;i<data.value.length; i++){
                                if(that._sUserID === data.value[i].USER_ID){
                                    if(i === 0)
                                    {
                                        sUserRole = data.value[i].USER_ROLE;
                                    }
                                    else{
                                        sUserRole = sUserRole +","+data.value[i].USER_ROLE;
                                    }
                                    
                                }
                            }
                        },
                        error: function (error) {
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
            },
                firstloadfuction : function(oEvent){
                    var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                    var appPath = appId.replaceAll(".", "/");
                    var appModulePath = jQuery.sap.getModulePath(appPath);
                    var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrItems?$filter=PR_NO eq " + prno + "";
                 //"/odata/v4/ideal-purchase-creation-srv/PrItems";
                    $.ajax({
                        url: url,
                        type: 'GET',
                        data: null,
                        contentType: 'application/json',
                        success: function (data, responce) {
                            //debugger
    
                            var tableitems = new JSONModel(data);
                            that.getOwnerComponent().setModel(tableitems, "iModel");
    
    
                            //   var omodel = new JSONModel(stcokData)
                            //   that.getView().setModel(omodel, "iModel")
    
                            //  tableData = that.getView().getModel("iModel").getData().value
    
                            // var totalIncludingTax = 0;
                            // var iTotalAmt = 0;
                            // var iTax = 0
                            // var iTotalTax = 0
    
                            var headerprice=0
                            var headerTax=0
                             var headerGrand=0
                            for (var i = 0; i < data.value.length; i++) {
                                
                                headerprice += parseInt(data.value[i].NET_AMOUNT) * data.value[i].QUANTITY;
                                var iTax = data.value[i].QUANTITY * parseInt(data.value[i].NET_AMOUNT) * ((data.value[i].TAXES_AMOUNT)/100)
                                var tableProTotal=  (data.value[i].QUANTITY * parseInt(data.value[i].NET_AMOUNT)) + iTax
                                headerTax += data.value[i].QUANTITY * parseInt(data.value[i].NET_AMOUNT) * ((data.value[i].TAXES_AMOUNT)/100)
                                headerGrand += tableProTotal
                                
                            }
                            that.getView().getModel("iModel").setProperty("/Totamt", headerprice)
                            that.getView().getModel("iModel").setProperty("/Totax", headerTax)
                            that.getView().getModel("iModel").setProperty("/TotalIcTax", headerGrand)
                            gprocts = that.getOwnerComponent().getModel("iModel").getData().TotalIcTax
    
    
    
                            that.headerData();
                            tableData = that.getView().getModel("iModel").getData().value
                            var imodelLen = data.value.length;
                            that.getView().byId("lineItemsList").setVisibleRowCount(imodelLen);
    
    
    
                        },
                        error: function (e) {
                            //debugger
                            BusyIndicator.hide();
                            MessageBox.error("error");
                        }
                    });
    
                    this._oDSC.setShowSideContent(false);

                },



            readUserMasterEntities: async function () {
                //debugger
                // hierarchyLevel = await that.calLevel();
                // that.calView(hierarchyLevel,userData.userId);
                that.checkUserId(prno, userData.userId)
            },


            checkUserId: function (prno, userId) {
                //debugger;

                // var aFilter = "REQUEST_NO eq '"+ reqNo +"' "ideal-claim-creation-srv/ClaimHeader?$filter=CR_NO eq "+ sLoginId

                // var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimHeader?$filter=CR_NO eq " + crNo + "";
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=PR_NO eq " + prno + "";


                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
                        //debugger;
                        // entityCode = data.value[0].ENTITY_CODE;
                        level = data.value[0].APPROVER_LEVEL;
                        that.readTable();
                        that.readAccess(level, userData.userId);
                        // that.calView(level,userData.userId);
                        that.visible()
                        that.shipdetail();
                        that.userrole()

                    },
                    error: function (error) {
                        //debugger;
                        BusyIndicator.hide();
                        var oXML, oXMLMsg;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText
                        }
                        MessageBox.error(oXMLMsg);
                    }
                });
            },
            calView: function (hierarchyLevel, userId) {
                //debugger;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=(TYPE eq 'CR') and (LEVEL eq " + hierarchyLevel + ") and (USER_IDS eq '" + userId + "')";
                // var data = { $expand: 'TO_USER_ENTITIES' };
                var hLevelArr = [];
                // return new Promise(function(resolve,reject){
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
                        // //debugger;
                        if (data.value.length === 0) {
                            MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
                        } else {
                            // var crNo = Number(oEvent.getParameters().arguments.CR_NO);

                        }
                    },
                    error: function (error) {
                        // ;
                        // BusyIndicator.hide();
                        var oXML, oXMLMsg;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText
                        }
                        MessageBox.error(oXMLMsg);
                    }
                });
            },

            readAccess: function (level, userEmail) {
                //debugger;
                // var userDetailModel = new JSONModel();
                // var vendorDetailsData2 = this.getOwnerComponent().getModel("vendorDetail").getData();
                // var eCode = vendorDetailsData2.ENTITY_CODE;
                // var appLevel = vendorDetailsData2.APPROVER_LEVEL;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var hType = "PR";
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=(ENTITY_CODE eq '1000') and (LEVEL eq " + level + ") and (TYPE eq '" + hType + "')";
                // var data = { $expand: 'TO_USER_ENTITIES' };
                // (USER_IDS eq '" + userEmail + "')

                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
                        //debugger;

                        var mHierarchyId = data.value.map((x) => { if (x.USER_IDS.includes(userData.userId)) { return x } });

                        // if(mHierarchyId[0].ACCESS_SENDBACK === true){
                        //     that.getView().byId("rejectBt").setVisible(true);
                        // }else{
                        //     that.getView().byId("rejectBt").setVisible(false);
                        // }

                        if (mHierarchyId[0].ACCESS_APPROVE === true) {
                            that.getView().byId("id_approve").setVisible(true);
                        } else {
                            that.getView().byId("id_approve").setVisible(false);
                        }

                        // if(mHierarchyId[0].ACCESS_HOLD === true){
                        //     that.getView().byId("Hold").setVisible(true);
                        // }else{
                        //     that.getView().byId("Hold").setVisible(false);
                        // }

                        if (mHierarchyId[0].ACCESS_REJECT === true) {
                            that.getView().byId("id_reject").setVisible(true);
                        } else {
                            that.getView().byId("id_reject").setVisible(false);
                        }
                    },
                    error: function (error) {
                        // //debugger;
                        // BusyIndicator.hide();
                        var oXML, oXMLMsg;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText
                        }
                        MessageBox.error(oXMLMsg);
                    }
                });
            },

            shipdetail: function () {
                //debugger

                var suppQuo = "1100013"
                var oFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, suppQuo);
                oDataModel2.read("/SHIPTOSet", {
                    filters: [oFilter],
                    success: function (oData, resp) {
                        //debugger
                        var ship = new JSONModel(oData);
                        that.getView().setModel(ship, "shipDetail");

                    },
                    error: function (error) {
                        //debugger
                        BusyIndicator.hide();
                        sap.m.MessageToast.show("Cannot load ship detail");
                    }

                });
            },



            handleHQCountry: function () {
                //debugger
                var shipform = this.getView().byId("shipfrom").getSelectedKey();
            },
            visible: function (oEvent) {
                //debugger
                this.getView().byId("lineItemsList");

                if (Pr_Status === "1") {
                    that.getView().byId("id_add").setVisible(true);
                    that.getView().byId("id_stock").setVisible(true);
                    that.getView().byId("id_approve").setVisible(true);
                    that.getView().byId("id_reject").setVisible(true);
                    that.getView().byId("deletColumn").setVisible(true);
                    // that.getView().byId("actionDelet").setVisible(true);
                    that.getView().byId("detailPage").setShowFooter(true);


                } else if (Pr_Status === "2") {
                    that.getView().byId("id_add").setVisible(false);
                    that.getView().byId("id_stock").setVisible(false);
                    that.getView().byId("id_approve").setVisible(false);
                    that.getView().byId("id_reject").setVisible(false);
                    that.getView().byId("deletColumn").setVisible(false);
                    // that.getView().byId("actionDelet").setVisible(false);
                    that.getView().byId("detailPage").setShowFooter(false);


                } else if (Pr_Status === "3") {
                    that.getView().byId("id_add").setVisible(false);
                    that.getView().byId("id_stock").setVisible(false);
                    that.getView().byId("id_approve").setVisible(false);
                    that.getView().byId("id_reject").setVisible(false);
                    that.getView().byId("deletColumn").setVisible(false);
                    // that.getView().byId("actionDelet").setVisible(false);


                } else if (Pr_Status === "4") {
                    that.getView().byId("id_add").setVisible(false);
                    that.getView().byId("id_stock").setVisible(false);
                    that.getView().byId("id_approve").setVisible(true);
                    that.getView().byId("id_reject").setVisible(true);
                    that.getView().byId("deletColumn").setVisible(false);
                    that.getView().byId("detailPage").setShowFooter(true);
                }else if( level === 1){

                    that.getView().byId("id_add").setVisible(true);
                    that.getView().byId("id_stock").setVisible(true);
                    that.getView().byId("id_approve").setVisible(true);
                    that.getView().byId("id_reject").setVisible(true);
                    that.getView().byId("deletColumn").setVisible(true);
                    // that.getView().byId("actionDelet").setVisible(true);
                    that.getView().byId("detailPage").setShowFooter(true);

                }


            },

            readTable: function () {
                //debugger
                BusyIndicator.show()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrItems?$filter=PR_NO eq " + prno + "";


                //"/odata/v4/ideal-purchase-creation-srv/PrItems";
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger
                        BusyIndicator.hide()
                        var tableitems = new JSONModel(data);
                        that.getOwnerComponent().setModel(tableitems, "iModel");


                        //   var omodel = new JSONModel(stcokData)
                        //   that.getView().setModel(omodel, "iModel")

                        //  tableData = that.getView().getModel("iModel").getData().value

                        var headerprice=0
                        var headerTax=0
                         var headerGrand=0
                        for (var i = 0; i < data.value.length; i++) {
                            
                            headerprice += parseInt(data.value[i].NET_AMOUNT) * data.value[i].QUANTITY;
                            var iTax = data.value[i].QUANTITY * parseInt(data.value[i].NET_AMOUNT) * ((data.value[i].TAXES_AMOUNT)/100)
                            var tableProTotal=  (data.value[i].QUANTITY * parseInt(data.value[i].NET_AMOUNT)) + iTax
                            headerTax += data.value[i].QUANTITY * parseInt(data.value[i].NET_AMOUNT) * ((data.value[i].TAXES_AMOUNT)/100)
                            headerGrand += tableProTotal
                            
                        }
                        that.getView().getModel("iModel").setProperty("/Totamt", headerprice)
                        that.getView().getModel("iModel").setProperty("/Totax", headerTax)
                        that.getView().getModel("iModel").setProperty("/TotalIcTax", headerGrand)
                        gprocts = that.getOwnerComponent().getModel("iModel").getData().TotalIcTax



                        that.headerData();
                        tableData = that.getView().getModel("iModel").getData().value
                        var imodelLen = data.value.length;

                        that.getView().byId("lineItemsList").setVisibleRowCount(imodelLen);


                    


                    },
                    error: function (oError) {
                        //debugger
                        BusyIndicator.hide()
                        // MessageBox.error("error");
                        MessageBox.error(JSON.parse(oError.responseText).error.message)
                    }
                });

            },

            headerData: function () {
                //debugger
                BusyIndicator.show();
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrHeader?$filter=PR_NO eq " + prno + "";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger
                        BusyIndicator.hide();
                        var headeritem = new JSONModel(data.value);
                        that.getView().setModel(headeritem, "headerData");

                        headerData = that.getView().getModel("headerData").getData()

                    },
                    error: function (oError) {
                        //debugger
                        BusyIndicator.hide()
                        // MessageBox.error("error");
                        MessageBox.error(JSON.parse(oError.responseText).error.message)

                    }
                });
                //  this._oDSC.setShowSideContent(false)
            },


            navigateToView1: function () {
                //debugger
                // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.navTo("View1", true);
                // var oHistory = History.getInstance();
                window.history.go(-1);

            },
            Content: function (flag) {
                //debugger
                // oDataModel.refresh(true);
                this._oDSC = this.byId("dynamicsidecontent");
                if (flag === 'X') {
                    this._oDSC.setShowSideContent(false);
                } else {
                    this._oDSC.setShowSideContent(true);

                }

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrEventLog?$filter=PR_NO eq " + prno + "";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger
                        //  eventLog.setData(data);
                        var eventLog = new JSONModel(data);
                        that.getView().setModel(eventLog, "eventData");
                        var eventData = that.getView().getModel("eventData").getData()
                    },
                    error: function (oError) {
                        //debugger
                        BusyIndicator.hide()
                        // MessageBox.error("error");
                        MessageBox.error(JSON.parse(oError.responseText).error.message)
                        
                    }
                });

            },
            CloseEvent: function (oEvent) {
                this._oDSC.setShowSideContent(false);

            },




            onApproveOrdr: function () {
                //debugger

                var visibleStock = this.getView().byId("StockValue").getVisible()
                //    if (againstock === false){
                //     MessageBox.error("Please check the quantity of stock.")
                //    }

                if (visibleStock === true) {

                    //   var submitcomments = sap.ui.getCore().byId("orderApproveComment").mProperties.value
                    // this.CancelOrder2();
                    // BusyIndicator.show()

                    tableData = that.getView().getModel("iModel").getData().value
                    var qut = "0"
                    var proqut=0;
                    var sFlag = true;
                    var QFlag = true;
                    var proQuntiFlag= true;
                    var MasAddedqutFlag= true
                    for (let i = 0; i < tableData.length; i++) {

                        if (tableData[i].QUANTITY > tableData[i].STOCK) {
                            var productname = tableData[i].MATERIAL_DESC
                            // this.getView().byId("lineItemsList").getRows()[i].getCells()[2].setProperty("valueState", "Error")


                            // that.getView().byId("inputQyt").setValueState(sap.ui.core.ValueState.error)
                            MessageBox.error(productname + " "+"Product Quantity is more than Stock");
                            sFlag = false;
                            //    break;
                        } else if (tableData[i].STOCK === qut) {
                            var productname = tableData[i].MATERIAL_DESC
                            MessageBox.error("Please update the quantity of " +" " +  productname + "to more than zero")
                            QFlag = false;

                           


                        } else if( tableData[i].QUANTITY === qut){
                            var productname = tableData[i].MATERIAL_DESC
                            MessageBox.error(productname + " "+"Product Quantity is more than Stock");
                            proQuntiFlag= false

                           

                        } else if(tableData[i].QUANTITY === proqut){
                            var productname = tableData[i].MATERIAL_DESC
                            MessageBox.error(productname + " "+"Product Quantity is more than Stock");
                            MasAddedqutFlag= false


                            // for (let i = 0; i < tableData.length; i++) {
                            //     if( productname === this.getView().byId("lineItemsList").getRows()[i].mAggregations.cells[0].mProperties.text){
                            //          this.getView().byId("lineItemsList").getRows()[i].getCells()[2].setProperty("valueState", "Error")
                            //     }else{
                            //         this.getView().byId("lineItemsList").getRows()[i].getCells()[2].setProperty("valueState", "None")
                            //     }
                                
                            // }
                        }
                        // delete tableData[i].STOCK

                    }

                    if (sFlag === true && QFlag === true &&  proQuntiFlag === true && MasAddedqutFlag === true) {
                        this.ssarpprove(tableData);
                    }
                    else {
                        BusyIndicator.hide()
                    }
                } else if (QFlag === false) {
                    MessageBox.error("Please check the quantity of stock.");
                }
                else {
                    MessageBox.error("Please check the quantity of stock.");
                }
            },

            userrole: function () {
                //debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var userdetails = this.getOwnerComponent().getModel("userModel").getData()
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userdetails.userId + "') and (ACTIVE eq 'X')";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger



                        var headeritem = new JSONModel(data.value[0]);
                        that.getOwnerComponent().setModel(headeritem, "userrole");



                    },
                    error: function (oError) {
                        ////debugger
                        BusyIndicator.hide()
                        // MessageBox.error(e.responseText);
                        MessageBox.error(JSON.parse(oError.responseText).error.message)

                    }
                });

            },
            ssarpprove: function () {
                // //debugger
                BusyIndicator.show()
                tableData = that.getView().getModel("iModel").getData().value
                for (let i = 0; i < tableData.length; i++) {
                    //debugger
                    delete tableData[i].STOCK

                }

                var userdetails = that.getView().getModel("userModel").getData()
                var userrole = that.getOwnerComponent().getModel("userrole").getData()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
                var oPayload = {
                    "action": "APPROVE",
                    "appType": "PR",
                    "prHeader": headerData,
                    "prCart": [],
                    "prItems": tableData,
                    "prEvent": [{
                        "PR_NO": 1,
                        "EVENT_NO": 1,
                        "EVENT_CODE": "1",
                        "USER_ID": userdetails.userId,
                        "USER_ROLE": userrole.USER_ROLE,
                        "USER_NAME": userdetails.userName,
                        "COMMENTS": "Purchase request approve",
                        "CREATION_DATE": null
                    }],
                    "userDetails": {
                        "USER_ROLE": userrole.USER_ROLE,
                        "USER_ID": userdetails.userId
                    }
                }
                oPayload.prHeader[0].GRAND_TOTAL = gprocts.toString();
                oPayload = JSON.stringify(oPayload)
                $.ajax({
                    type: "POST",
                    url: surl,
                    data: oPayload,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        //debugger;
                        BusyIndicator.hide()
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    //debugger
                                    that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                    var router = sap.ui.core.UIComponent.getRouterFor(that);
                                    router.navTo("RouteView1")
                                    // that.onExit()
                                    that.visible();

                                }
                            }
                        }

                        );
                    },

                    error: function (oError) {
                        // //debugger;
                        BusyIndicator.hide();
                        // MessageBox.error(result.value.OUT_ERROR);
                        // MessageBox.error(oError.responseText);

                        MessageBox.error(JSON.parse(oError.responseText).error.message)


                    }
                });

            },


            onExit: function () {
                //debugger
                this.getView().getModel("appView").setProperty("/layout", "OneColumn");
                // that.oDataModel2.refresh(true);
                // that.oDataModel.refresh(true);
                var checkVisble = this.getView().byId("stockColumn").getVisible()
                var formVisible = this.getView().byId("id_TableHead").getVisible()
                if (this.getView().byId("id_TableHead").getVisible() === formVisible &&
                    this.getView().byId("stockColumn").getVisible() === checkVisble) {

                    this.getView().byId("id_TableHead").setVisible(false)
                    this.getView().byId("stockColumn").setVisible(false)
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                oRouter.navTo("RouteView1");
            },


            RejectOrder: function (oEvent) {
                //debugger
                if (!this.reject) {
                    this.reject = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorderapproval.view.fragments.reject", this);
                    this.getView().addDependent(this.reject);
                }
                this.reject.open();
            },
            CancelOrder1: function () {
                this.reject.close();
                this.reject.destroy();
                this.reject = null;
            },



            SubmitrejectOrder: function (oEvent) {
                //debugger

                var comments = sap.ui.getCore().byId("inputcomment").getValue();
                this.CancelOrder1();
                BusyIndicator.show()
                var userdetails = that.getView().getModel("userModel").getData()
                var userrole = that.getOwnerComponent().getModel("userrole").getData()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath)
                var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
                var oPayload = {
                    "action": "REJECT",
                    "appType": "PR",
                    "prHeader": headerData,
                    "prCart": [],
                    "prItems": [],
                    "prEvent": [{
                        "PR_NO": 1,
                        "EVENT_NO": 1,
                        "EVENT_CODE": "1",
                        "USER_ID": userdetails.userId,
                        "USER_ROLE": userrole.USER_ROLE,
                        "USER_NAME": userdetails.userName,
                        "COMMENTS": comments,
                        "CREATION_DATE": null
                    }],
                    "userDetails": {
                        "USER_ROLE": userrole.USER_ROLE,
                        "USER_ID": userdetails.userId
                    }
                }

                oPayload = JSON.stringify(oPayload)
                $.ajax({
                    type: "POST",
                    url: surl,
                    data: oPayload,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        //debugger;
                        BusyIndicator.hide()
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    //debugger
                                    that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                    var router = sap.ui.core.UIComponent.getRouterFor(that);
                                    router.navTo("RouteView1")
                                    // that.onExit()
                                    that.visible();

                                }
                            }
                        }
                        );

                    },

                    error: function (oError) {
                        //debugger;
                        BusyIndicator.hide()
                        // MessageBox.error("Error");
                        MessageBox.error(JSON.parse(oError.responseText).error.message)


                    }
                });

            },
            onFullScreen: function () {

                if (this.getView().getModel("appView").getProperty("/layout") == "TwoColumnsMidExpanded") {
                    this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                    this.getView().getModel("appView").setProperty("/icon", "sap-icon://exit-full-screen");
                } else {
                    this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                    this.getView().getModel("appView").setProperty("/icon", "sap-icon://full-screen");
                }

            },

            handleValueGroupHelp: function () {
                //debugger
                if (!this.grpFragment) {
                    this.grpFragment = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorderapproval.view.fragments.grpFragment", this);
                    this.getView().addDependent(this.grpFragment);
                    //this._delvrTemp = sap.ui.getCore().byId("delvrTempId").clone();
                }
                // that.getView().setBusy(true);
                // var grpId = sap.ui.getCore().byId("grpF4Id");
                // var Filter1 = new sap.ui.model.Filter("Division", sap.ui.model.FilterOperator.EQ, that.headerData.results[0].BU_CODE);
                oDataModel2.read("/MaterialGroupsSet", {
                    urlParameters: {
                        $expand: "NavMaterialSet"
                    },
                    // filters: [Filter1],
                    success: function (oData, oResponse) {
                        //debugger

                        var model = new JSONModel(oData);
                        that.getView().setModel(model, "group");
                        that.grpFragment.open();
                    },
                    error: function (error) {
                        that.getView().setBusy(false);
                        MessageBox.warning("Error while reading data");
                    }
                });
            },




            handleValueProductHelp: function () {
                //debugger
                if (!this.prodFragment) {
                    this.prodFragment = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorderapproval.view.fragments.proFragment", this);
                    this.getView().addDependent(this.prodFragment);
                    //this._delvrTemp = sap.ui.getCore().byId("delvrTempId").clone();
                }
                // that.getView().setBusy(true);
                // var prodId = sap.ui.getCore().byId("prodF4Id");
                // var Filter1 = new sap.ui.model.Filter("Extwg", sap.ui.model.FilterOperator.EQ, that.Extwg);
                // var Filter2 = new sap.ui.model.Filter("MaterialGroup", sap.ui.model.FilterOperator.Contains, grupId);
                oDataModel2.read("/MaterialGroupsSet(MaterialGroup='" + grupId + "')", {

                    urlParameters: {
                        $expand: "NavMaterialSet"
                    },
                    // filters: [Filter2],

                    success: function (oData, oResponse) {
                        //debugger
                        // that.getView().setBusy(false);
                        var model = new JSONModel(oData);
                        that.getView().setModel(model, "material");
                        // prodId.setModel(model);
                        that.prodFragment.open();
                    },
                    error: function (error) {
                        BusyIndicator.hide();
                        that.getView().setBusy(false);
                        MessageBox.warning("Error while reading data");
                    }
                });
            },

            handleProdValueHelpClose: function (oEvent) {
                //debugger
                productSelectd = oEvent.mParameters.selectedItem.mProperties.description
                this.getView().byId("id_Item").setValue(productSelectd)

            },
            addItems: function (oEvent) {
                //debugger

                // that.getView().byId("id_add").setVisible(false);
                that.getView().byId("id_TableHead").setVisible(true);
                // that.getView().setModel(that.oViewModel, "val");
                this.getView().byId("id_Grp").setValue("");
                this.getView().byId("id_Qty").setValue("");
                this.getView().byId("id_Item").setValue("");
            },

            checkquntity: function (oEvent) {
                //debugger
                // var newQYT= oEvent.getSource().getValue();
                var newProdQyt = Number(this.getView().byId("id_Qty").getValue())
                // var newProdQyt =  (/[0-9]$/.test(newQYT))
                if (newProdQyt === 0 && newProdQyt === undefined) {
                    MessageBox.warning("Add more than zero quantity")
                    // that.getView().byId("id_Qty").setValueState(sap.ui.core.ValueState.Error);

                }
            },

            // onAddItem: function (oEvent) {
            //     //debugger
            //     if (!this.reject) {
            //         this.reject = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorderapproval.view.fragments.addProductmsg", this);
            //         this.getView().addDependent(this.reject);
            //     }
            //     this.reject.open();
            // },
            // cancleproduct: function () {
            //     this.reject.close();
            //     this.reject.destroy();
            //     this.reject = null;
            //     this.getView().byId("id_Qty").setValue("");
            //     this.getView().byId("id_Item").setValue("");
            //     this.getView().byId("id_Grp").setValue("");
            // },



            onAddItem: function (oEvent) {
                //debugger

                BusyIndicator.show()
                that.getView().byId("stockColumn").setVisible(false);
                that.getView().byId("StockValue").setVisible(false);
                that.getView().byId("stockText").setVisible(false);
                
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var Materialqyt = this.getView().byId("id_Qty").getValue()
                var userrole = that.getOwnerComponent().getModel("userrole").getData()
                var userdetails = that.getView().getModel("userModel").getData()
                var prItems = null;
                var prHistory = null;
                var prEvents = null;
                // var validflag = that.validateForm("U");
                // if (validflag === true) {
                // var Filter1 = new sap.ui.model.Filter("MaterialDes", sap.ui.model.FilterOperator.EQ, productSelectd);
                // var Filter2 = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, that.headerData.results[0].DISTRIBUTOR_ID);
                // var Filter3 = new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, that.Werks);
                // var Filter4 = new sap.ui.model.Filter("Shipmode", sap.ui.model.FilterOperator.EQ, "03");
                oDataModel2.read("/MaterialGroupsSet", {
                    urlParameters: {
                        $expand: "NavMaterialSet"
                    },
                    // filters: [Filter1],
                    success: function (oData, oResponse) {
                        //debugger
                        BusyIndicator.hide()
                        var model = new JSONModel(oData);
                        that.getView().setModel(model, "selectedProd");
                        var allData = that.getView().getModel("selectedProd").getData()

                        var sameProductFlag = false
                        var newEntry


                        if (grpSelected === undefined) {
                            MessageBox.warning("Please select Material Group")
                            // that.cancleproduct()
                        } else if (productSelectd === undefined) {
                            MessageBox.warning("Please select material")
                            // that.cancleproduct()
                        } else if (Materialqyt === "" || Materialqyt === "0" || Materialqyt === undefined) {
                            MessageBox.warning("Please select quantity")
                            // that.cancleproduct()
                        }

                        else {


                            MessageBox.success("Are sure you want add product?", {
                                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                emphasizedAction: MessageBox.Action.OK,
                                onClose: function (oAction) {
                                    if (oAction === 'OK') {
                                        //debugger

                                        for (let i = 0; i < allData.results.length; i++) {
                                            //debugger
                                            for (let k = 0; k < allData.results[i].NavMaterialSet.results.length; k++) {

                                                if (allData.results[i].NavMaterialSet.results[k].MaterialDes === productSelectd) {

                                                    newEntry = allData.results[i].NavMaterialSet.results[k];

                                                }
                                            }
                                        }

                                        for (let i = 0; i < tableData.length; i++) {
                                            if (newEntry.MaterialDes === tableData[i].MATERIAL_DESC) {
                                                sameProductFlag = true;
                                            }

                                        }



                                        if (sameProductFlag === true) {
                                            MessageBox.error("Material is already present, please update the quantity below table")
                                            this.getView().byId("id_Qty").setValue("");
                                            this.getView().byId("id_Item").setValue("");
                                            this.getView().byId("id_Grp").setValue("");
                                        } else {


                                            // var newtax = Number((tableRowData.TAXES_AMOUNT))
                                            // var taxInprc=Number((tableRowData.TAXES_AMOUNT)/100)
                                            // var newTotal = (Number(tableRowData.NET_AMOUNT) * Number(newquntity)) +  ((Number(tableRowData.NET_AMOUNT) * Number(newquntity))* taxInprc)




                                           // var total = newEntry.NetPrice * Materialqyt
                                            var tax = Number(newEntry.Cgst_per) + Number(newEntry.Sgst_per);
                                            var calTax=tax/100;
                                          var total = (Number(newEntry.NetPrice) * Number(Materialqyt)) +  ((Number(newEntry.NetPrice) * Number(Materialqyt))* calTax)

                                            var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
                                            var oPayload = {
                                                "action": "APPROVE",
                                                "appType": "ADD",
                                                "prHeader": headerData,
                                                "prCart": [],
                                                "prItems": [{
                                                    "PR_NO": prno,
                                                    "PR_ITEM_NO": 1,
                                                    "MATERIAL_CODE": newEntry.MaterialCode,
                                                    "MATERIAL_DESC": newEntry.MaterialDes,
                                                    "IMAGE_URL": newEntry.ImageUrl,
                                                    "HSN_CODE": "GOD",
                                                    "UNIT_OF_MEASURE": newEntry.Uom,
                                                    "QUANTITY": parseInt(Materialqyt),
                                                    "FREE_QUANTITY": null,
                                                    "STD_PRICE": null,
                                                    "BASE_PRICE": null,
                                                    "DISC_AMOUNT": null,
                                                    "DISC_PERC": null,
                                                    "NET_AMOUNT": newEntry.NetPrice,
                                                    "TOTAL_AMOUNT": total.toString(),
                                                    "CGST_PERC": newEntry.Cgst_per,
                                                    "CGST_AMOUNT": null,
                                                    "SGST_PERC": newEntry.Sgst_per,
                                                    "SGST_AMOUNT": null,
                                                    "IGST_PERC": newEntry.Igst_per,
                                                    "IGST_AMOUNT": null,
                                                    "TAXES_AMOUNT": tax.toString()
                                                }],
                                                "prEvent": [{
                                                    "PR_NO": prno,
                                                    "EVENT_NO": 1,
                                                    "EVENT_CODE": "1",
                                                    "USER_ID": userdetails.userId,
                                                    "USER_ROLE": userrole.USER_ROLE,
                                                    "USER_NAME": userdetails.userName,
                                                    "COMMENTS": newEntry.MaterialDes + " Material Added",
                                                    "CREATION_DATE": null
                                                }],
                                                "userDetails": {
                                                    "USER_ROLE": userrole.USER_ROLE,
                                                    "USER_ID": userdetails.userId
                                                }
                                            }
                                            oPayload = JSON.stringify(oPayload)
                                            $.ajax({
                                                type: "POST",
                                                url: surl,
                                                data: oPayload,
                                                contentType: "application/json; charset=utf-8",
                                                dataType: "json",
                                                success: function (result) {
                                                    //debugger;



                                                    BusyIndicator.hide()
                                                    that.getView().byId("id_TableHead").setVisible(false);
                                                    // that.cancleproduct();
                                                    MessageBox.success(result.value.OUT_SUCCESS, {
                                                        actions: [MessageBox.Action.OK],
                                                        emphasizedAction: MessageBox.Action.OK,

                                                        onClose: function (oAction) {
                                                            if (oAction === 'OK') {
                                                                //debugger
                                                                // this.getView().byId("id_Grp").setValue("");
                                                                // this.getView().byId("id_Qty").setValue("");
                                                                // this.getView().byId("id_Item").setValue("");
                                                                that.readTable()
                                                                // that.onMaterialstock();
                                                                // that.readTable()

                                                            }
                                                        }

                                                    }
                                                    );


                                                },

                                                error: function (oError) {
                                                    //debugger;
                                                    BusyIndicator.hide()
                                                    // MessageBox.error("Error");
                                                    MessageBox.error(JSON.parse(oError.responseText).error.message)


                                                }
                                            });


                                        }



                                    }
                                }

                            });



                        }





                    },
                    error: function (error) {
                        //debugger
                        BusyIndicator.hide()
                        that.getView().setBusy(false);
                        MessageBox.warning("Error while reading data");
                    }

                });
            },
            // },

            handleSideContentHide: function (oEvent) {
                this._oDSC.setShowSideContent(false);
            },


            handleSideContentShow: function (flag) {
                //debugger
                // oDataModel.refresh(true);
                // this._oDSC = this.byId("dynamicsidecontent");
                // if(flag === 'X'){
                //     this._oDSC.setShowSideContent(false);
                // } else {
                //     this._oDSC.setShowSideContent(true);

                // }

                var dynamicSideContentState = this.getView().byId("DynamicSideContent").getShowSideContent();
                var iWindowWidth = window.innerWidth;
                if (dynamicSideContentState === true) {
                    this.getView().byId("DynamicSideContent").setShowSideContent(false);
                }
                else {
                    this.getView().byId("DynamicSideContent").setShowSideContent(true);
                    if(iWindowWidth < 600){
                        this.onMainContent(false);
                    }
                }

                // this._oDSC.setShowSideContent(true);

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrEventLog?$expand=TO_EVENT_STATUS&$filter=PR_NO eq " + prno + "";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger
                        //  eventLog.setData(data);
                        var eventLog = new JSONModel(data);
                        that.getView().setModel(eventLog, "eventData");

                    },
                    error: function (e) {
                        //debugger
                        BusyIndicator.hide()
                        MessageBox.error("error");
                    }
                });
            },

            onMainContent:function(sValue){
                this.getView().byId("DynamicSideContent").setShowMainContent(sValue);
            },
            handleSideContentHide: function () {
                this.getView().byId("DynamicSideContent").setShowSideContent(false);
                this.onMainContent(true);
            },
            onMaterialstock: function (val) {
                //debugger

                
                BusyIndicator.show();
                that.getView().byId("stockColumn").setVisible(true);
                that.getView().byId("StockValue").setVisible(true);
                that.getView().byId("stockText").setVisible(true);
                stcokData = []
                var count = 0
                // var data = {stcokData : []}
                for (let i = 0; i < tableData.length; i++) {


                    var aFilter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, tableData[i].MATERIAL_CODE);
                    // var products = evt.getSource().getBindingContext("orderData").getObject();
                    oDataModel2.read("/STOCKSet", {

                        filters: [aFilter],

                        success: function (oData, oResponse) {
                            //debugger
                            BusyIndicator.hide();
                            // adding new proporty in current model if your new data present in  index style
                            that.getView().getModel("iModel").setProperty("/value/" + count + "/STOCK", oData.results[0].Stock)

                            stcokData.push(oData.results[0])
                            count++;



                        },
                        error: function (error) {
                            BusyIndicator.hide()
                            // that.getView().setBusy(false);
                            MessageBox.warning("Error while reading data");
                        }
                    });

                }

            },



            // quntityChange: function (oEvent) {
            //     //debugger
            //     var oqut=0
            //     var empty=oEvent.mParameters.newValue
            //     if(empty === ""){

            //     } else{
            //     BusyIndicator.show(0)
            //     var userdetails = that.getView().getModel("userModel").getData()
            //     var userrole = that.getOwnerComponent().getModel("userrole").getData()
            //     var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            //     var appPath = appId.replaceAll(".", "/");
            //     var appModulePath = jQuery.sap.getModulePath(appPath);
            //     var tablePath = oEvent.getSource().getBindingContext("iModel").getPath()
            //     var newquntity = Number(oEvent.mParameters.value)
            //     var tableRowData = oEvent.getSource().getBindingContext("iModel").getObject()
            //     var productStock = Number(tableRowData.STOCK)
                
            //     var newtax = Number((tableRowData.TAXES_AMOUNT))
            //     var taxInprc=Number((tableRowData.TAXES_AMOUNT)/100)
            //     var newTotal = (Number(tableRowData.NET_AMOUNT) * Number(newquntity)) +  ((Number(tableRowData.NET_AMOUNT) * Number(newquntity))* taxInprc)
            //     var rowIndedx = this.getView().byId("lineItemsList").getRows()

            //     //   for (let i = 0; index < rowIndedx.length; i++) {


            //     //   }
            //     if (newquntity > productStock) {
            //         //debugger
            //         BusyIndicator.hide()
            //         MessageBox.error("Quantity cannot be greater than stock");

             

            //     } 
            //     // else if(newquntity > oqut){
            //     //     BusyIndicator.hide()
            //     //     //   for (let i = 0; i < this.getView().byId("lineItemsList").getRows().length; i++) {
            //     //     //     this.getView().byId("lineItemsList").getRows()[i].getCells()[2].setProperty("valueState","None")

            //     //     // }
             

            //     // }
            //      else {
            //         BusyIndicator.hide()
            //         // this.getView().byId("lineItemsList").getRows()[1].getCells()[2].setProperty("valueState", "Information")
            //         var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
            //         ExcelSubmission : function(){
            //         contentType: "application/json; charset=utf-8",
            //         dataType: "json",
            //         success: function (result) {
            //             //debugger;
            //             BusyIndicator.hide()
            //             MessageBox.success(result.value.OUT_SUCCESS, {
            //                 actions: [MessageBox.Action.OK],
            //                 emphasizedAction: MessageBox.Action.OK,

            //                 onClose: function (oAction) {
            //                     if (oAction === 'OK') {
            //                         //debugger
            //                         that.readTable()
            //                         that.onMaterialstock();

            //                     }
            //                 }

            //             }
            //             );

            //         },

            //         error: function (oError) {
            //             //debugger;
            //             BusyIndicator.hide()
            //             // MessageBox.error("Error");
            //             MessageBox.error(JSON.parse(oError.responseText).error.message)

            //         }
            //     });

            //     }
            // }
            // },


         

            quntityChange: function (oEvent) {
                //debugger
                var oqut=0
                var empty=oEvent.mParameters.newValue
                if(empty === ""){

                } else{
                BusyIndicator.show(0)
                var userdetails = that.getView().getModel("userModel").getData()
                var userrole = that.getOwnerComponent().getModel("userrole").getData()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var tablePath = oEvent.getSource().getBindingContext("iModel").getPath()
                var newquntity = Number(oEvent.mParameters.value)
                var tableRowData = oEvent.getSource().getBindingContext("iModel").getObject()
                var productStock = Number(tableRowData.STOCK)
                
                var newtax = Number((tableRowData.TAXES_AMOUNT))
                var taxInprc=Number((tableRowData.TAXES_AMOUNT)/100)
                var newTotal = (Number(tableRowData.NET_AMOUNT) * Number(newquntity)) +  ((Number(tableRowData.NET_AMOUNT) * Number(newquntity))* taxInprc)
                var rowIndedx = this.getView().byId("lineItemsList").getRows()

                //   for (let i = 0; index < rowIndedx.length; i++) {


                //   }
                if (newquntity > productStock) {
                    //debugger
                    BusyIndicator.hide()
                    MessageBox.error("Quantity cannot be greater than stock");
                } 
                // else if(newquntity > oqut){
                //     BusyIndicator.hide()
                //     //   for (let i = 0; i < this.getView().byId("lineItemsList").getRows().length; i++) {
                //     //     this.getView().byId("lineItemsList").getRows()[i].getCells()[2].setProperty("valueState","None")

                //     // }
             

                // }
                 else {
                    BusyIndicator.hide()
                    // this.getView().byId("lineItemsList").getRows()[1].getCells()[2].setProperty("valueState", "Information")
                    var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
                    var oPayload = {
                        "action": "APPROVE",
                        "appType": "UPDATE",
                        "prHeader": headerData,
                        "prCart": [],
                        "prItems": [{
                            "PR_NO": prno,
                            "PR_ITEM_NO": tableRowData.PR_ITEM_NO,
                            "MATERIAL_CODE": tableRowData.MATERIAL_CODE,
                            "MATERIAL_DESC": tableRowData.MATERIAL_DESC,
                            "IMAGE_URL": tableRowData.IMAGE_URL,
                            "HSN_CODE": "GOD",
                            "UNIT_OF_MEASURE": tableRowData.UNIT_OF_MEASURE,
                            "QUANTITY": parseInt(newquntity),
                            "FREE_QUANTITY": null,
                            "STD_PRICE": null,
                            "BASE_PRICE": null,
                            "DISC_AMOUNT": null,
                            "DISC_PERC": null,
                            "NET_AMOUNT": tableRowData.NET_AMOUNT,
                            "TOTAL_AMOUNT": newTotal.toString(),
                            "CGST_PERC": tableRowData.CGST_PERC,
                            "CGST_AMOUNT": null,
                            "SGST_PERC": tableRowData.SGST_PERC,
                            "SGST_AMOUNT": null,
                            "IGST_PERC": tableRowData.IGST_PERC,
                            "IGST_AMOUNT": null,
                            "TAXES_AMOUNT": newtax.toString()
                        }],
                        "prEvent": [{
                            "PR_NO": prno,
                            "EVENT_NO": 1,
                            "EVENT_CODE": "1",
                            "USER_ID": userdetails.userId,
                            "USER_ROLE": userrole.USER_ROLE,
                            "USER_NAME": userdetails.userName,
                            "COMMENTS": tableRowData.MATERIAL_DESC + " materail updated",
                            "CREATION_DATE": null
                        }],
                        "userDetails": {
                            "USER_ROLE": userrole.USER_ROLE,
                            "USER_ID": userdetails.userId
                        }
                    }
                    
                oPayload = JSON.stringify(oPayload)
                $.ajax({
                    type: "POST",
                    url: surl,
                    data: oPayload,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        //debugger;
                        BusyIndicator.hide()
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,

                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    //debugger
                                    that.readTable()
                                    that.onMaterialstock();

                                }
                            }

                        }
                        );

                    },

                    error: function (oError) {
                        //debugger;
                        BusyIndicator.hide()
                        // MessageBox.error("Error");
                        MessageBox.error(JSON.parse(oError.responseText).error.message)

                    }
                });

                }
            }
            },

            handleDeleteListItem: function (oEvent) {
                //debugger
                // BusyIndicator.show()
                var userdetails = that.getView().getModel("userModel").getData()
                var userrole = that.getOwnerComponent().getModel("userrole").getData()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);

                MessageBox.confirm("Do you want delete the material?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (oAction) {
                        if (oAction === 'OK') {
                            //debugger


                            var tableRowData = oEvent.getSource().getBindingContext("iModel").getObject()
                            delete tableRowData.STOCK

                            // for ( var i=0; i<tableRowData.length; i++) {
                            //     //debugger;
                            //     delete tableRowData[i].STOCK 
                            //   }
                            var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
                            var oPayload = {
                                "action": "APPROVE",
                                "appType": "DELETE",
                                "prHeader": headerData,
                                "prCart": [],
                                "prItems": [tableRowData],
                                "prEvent": [{
                                    "PR_NO": prno,
                                    "EVENT_NO": 1,
                                    "EVENT_CODE": "1",
                                    "USER_ID": userdetails.userId,
                                    "USER_ROLE": userrole.USER_ROLE,
                                    "USER_NAME": userdetails.userName,
                                    "COMMENTS": tableRowData.MATERIAL_DESC + " material deleted",
                                    "CREATION_DATE": null
                                }],
                                "userDetails": {
                                    "USER_ROLE": userrole.USER_ROLE,
                                    "USER_ID": userdetails.userId
                                }
                            }

                            oPayload = JSON.stringify(oPayload)
                            $.ajax({
                                type: "POST",
                                url: surl,
                                data: oPayload,
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (result) {
                                    //debugger;
                                    BusyIndicator.hide()
                                    MessageBox.success(result.value.OUT_SUCCESS, {
                                        actions: [MessageBox.Action.OK],
                                        emphasizedAction: MessageBox.Action.OK,

                                        onClose: function (oAction) {
                                            if (oAction === 'OK') {
                                                //debugger
                                                that.readTable()
                                                that.onMaterialstock();

                                            }
                                        }

                                    }
                                    );

                                },
                                error: function (oError) {
                                    //debugger;
                                    BusyIndicator.hide();
                                    // MessageBox.error("Error");
                                    MessageBox.error(JSON.parse(oError.responseText).error.message)

                                }
                            });

                        }
                        else if (oAction === "CANCEL") {


                        }
                    }

                });

            },

            printReq: function () {
                //debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
                var tabeldata = this.getView().getModel("iModel").getData();
                var headerData = this.getView().getModel("headerData").getData();
                sessionStorage.setItem("info", JSON.stringify(tabeldata));
                sessionStorage.setItem("header", JSON.stringify(headerData));
                // window.open("https://port8080-workspaces-ws-f2dfm.us10.applicationstudio.cloud.sap/print.html?PR_NO="  + prno )
                window.open(appModulePath + "/print.html?PR_NO=" + prno)
                // window.open( surl + "/print.html?PR_NO=" + prno);
            },

            createColumnConfig: function () {
                //debugger;
                var aCols = [];

                aCols.push({
                    label: "Material Desc",
                    property: 'MATERIAL_DESC'
                });

                aCols.push({
                    label: "HSN Code",
                    property: 'HSN_CODE'

                });

                aCols.push({
                    label: "Quantity",
                    property: 'QUANTITY'

                });

                aCols.push({
                    label: "Stock",
                    property: 'STOCK'

                });

                aCols.push({
                    label: "Net Amount",
                    property: 'NET_AMOUNT'
                });

                aCols.push({
                    label: "CGST Perc",
                    property: 'CGST_PERC'
                });

                aCols.push({
                    label: "SGST Perc",
                    property: 'SGST_PERC'
                });
                aCols.push({
                    label: "Tax Amount",
                    property: 'TAXES_AMOUNT'
                });
                aCols.push({
                    label: "Total Amount",
                    property: 'TOTAL_AMOUNT'
                });

                return aCols;
            },

            onExport: function () {
                //debugger

                var currentDate = new Date();
                // var fName = newDate + ".xlsx";

                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "MM/dd/yy" });

                // Format the date
                var formattedDate = dateFormat.format(currentDate);
                var fName = "Purchase Order" + " " + formattedDate + ".xlsx";

                var oSettings, oSheet, aColumns, aCols;

                that.oTable = this.byId("lineItemsList");

                var oBinding = that.oTable.getBinding("rows");
                var data = [];
                aCols = this.createColumnConfig();

                var ModelData = this.getView().getModel("iModel")

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: "Level",
                        sheetName: "RFM"
                    },
                    dataSource: oBinding,
                    fileName: fName,
                    worker: false
                };
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().then(function () {
                    //debugger;
                    MessageToast.show("Spreadsheet Export Has Finished");
                }).finally(function (error) {
                    //debugger;
                    oSheet.destroy();
                });

            },




            handleOTHContactCountrySearch: function (oEvent) {
                //debugger
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                if (sQuery) {
                    var oFilter1 = [new sap.ui.model.Filter("MaterialGroupDes", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("MaterialGroup", sap.ui.model.FilterOperator.Contains, sQuery)];
                    var allFilters = new sap.ui.model.Filter(oFilter1, false);
                    pFilter.push(allFilters);
                }

                var listItem = sap.ui.getCore().byId("contactcntry_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },


            contactOTHCountrySelection: function (oEvent) {
                //debugger
                // grpSelected = oEvent.mParameters.selectedItem.mProperties.description
                // grupId = oEvent.mParameters.selectedItem.mProperties.

                grpSelected = oEvent.getSource().getSelectedItem().getBindingContext("group").getObject().MaterialGroupDes
                grupId = oEvent.getSource().getSelectedItem().getBindingContext("group").getObject().MaterialGroup
                this.getView().byId("id_Grp").setValue(grpSelected)
                this.closeContactCountryDialog()

                //  this.getView().byId("id_Item").setValue(grpSelected.title)

            },
            closeContactCountryDialog: function () {
                //debugger
                this.grpFragment.close();
                this.grpFragment.destroy();
                this.grpFragment = null;
            },


            ProductOnserch: function (oEvent) {
                //debugger

                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                if (sQuery) {
                    var oFilter1 = [new sap.ui.model.Filter("MaterialCode", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("MaterialDes", sap.ui.model.FilterOperator.Contains, sQuery)];
                    var allFilters = new sap.ui.model.Filter(oFilter1, false);
                    pFilter.push(allFilters);
                }

                var listItem = sap.ui.getCore().byId("contactcntry_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            closeContactCountryDialog1: function () {
                //debugger
                this.prodFragment.close();
                this.prodFragment.destroy();
                this.prodFragment = null;
            },
            MaterialSelection1: function (oEvent) {
                //debugger
                // grpSelected = oEvent.mParameters.selectedItem.mProperties.description
                // grupId = oEvent.mParameters.selectedItem.mProperties.

                productgroup = oEvent.getSource().getSelectedItem().getBindingContext("material").getObject().MaterialCode
                productSelectd = oEvent.getSource().getSelectedItem().getBindingContext("material").getObject().MaterialDes
                this.getView().byId("id_Item").setValue(productSelectd)


                
                this.closeContactCountryDialog1()
                //  this.getView().byId("id_Item").setValue(grpSelected.title)

            },

        });
    });