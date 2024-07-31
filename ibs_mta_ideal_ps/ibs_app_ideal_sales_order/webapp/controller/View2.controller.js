sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/ui/core/BusyIndicator',
    "com/ibs/ibsappidealsalesorder/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageBox, BusyIndicator, formatter) {
        "use strict";
        var oDataModel, tableitems, headeritem, eventLog;
        var that, prno,previousData;
        var statusCode,id;
        return BaseController.extend("com.ibs.ibsappidealsalesorder.controller.View2", {
            formatter: formatter,
            onInit: function () {
                //debugger
                that = this;
                oDataModel = this.getOwnerComponent().getModel();

                    
                //     prno=previousData.PR_NO;
                //    this.readTable();
                //    that.headerData();
                //    that.Content("X");


                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("View2").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
                //debugger
                BusyIndicator.hide();
                var iWindowWidth = window.innerWidth;
                if (iWindowWidth < 600) {
                    this.getView().byId("idMTable").setVisible(true);
                    this.getView().byId("table").setVisible(false);
                }
                else {
                    this.getView().byId("table").setVisible(true);
                    this.getView().byId("idMTable").setVisible(false);
                }

                // id = oEvent.getParameter('arguments').D_loginId;
                prno = Number(oEvent.getParameters().arguments.PR_NO)
                previousData =that.getOwnerComponent().getModel("orderDetails").getData()
               statusCode =previousData.TO_STATUS.CODE
                 id= previousData.DISTRIBUTOR_ID

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrItems?$filter=PR_NO eq " + prno + "";
                that.oDataModel = this.getOwnerComponent().getModel();

                that.getView().byId("sapNO").setVisible(false)

                that.shipdetail();

               that.OpenEvent();
                that.userrole()
                that.visible()
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // //debugger
                        BusyIndicator.hide();
                        var tableitems = new JSONModel(data);
                        that.getView().setModel(tableitems, "iModel");
                        that.headerData();


                   

                        var headerprice=0
                        var headerTax=0
                         var headerGrand=0

                        for (var i = 0; i < data.value.length; i++) {

                       

                            headerprice += parseInt(data.value[i].NET_AMOUNT) * data.value[i].QUANTITY;

                            var iTax = data.value[i].QUANTITY * parseInt(data.value[i].NET_AMOUNT) * ((data.value[i].TAXES_AMOUNT)/100)
                            
                            var tableProTotal=  (data.value[i].QUANTITY * parseInt(data.value[i].NET_AMOUNT)) + iTax
                            headerTax += data.value[i].QUANTITY * parseInt(data.value[i].NET_AMOUNT) * ((data.value[i].TAXES_AMOUNT)/100)
                            headerGrand += tableProTotal
                            that.getView().getModel("iModel").setProperty("/value/" + i + "/TABLE_TOTAL", tableProTotal);
                        }
                        
                        that.getView().getModel("iModel").setProperty("/Totamt", headerprice)
                        that.getView().getModel("iModel").setProperty("/Totax", headerTax)
                        that.getView().getModel("iModel").setProperty("/TotalIcTax", headerGrand)



                        

                        var tableData = that.getView().getModel("iModel").getData().value
                        var imodelLen = data.value.length;
                        that.getView().byId("table").setVisibleRowCount(imodelLen);

                    },
                    error: function (e) {
                        ////debugger
                        BusyIndicator.hide()
                        MessageBox.error("error");
                    }
                });

            },

            visible : function(){
                //debugger
                if(statusCode=== 1){
                    this.getView().byId("id_cnaBTn").setVisible(true)
                }else{
                    this.getView().byId("id_cnaBTn").setVisible(false)
                }
            },
            headerData: function () {
                ////debugger
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
                        ////debugger
                        BusyIndicator.hide();
                        var headeritem = new JSONModel(data.value);
                        that.getView().setModel(headeritem, "headerData");

                        if (data.value[0].PR_STATUS === "3") {
                            that.getView().byId("sapNO").setVisible(true)
                        }

                    },
                    error: function (e) {
                        ////debugger
                        BusyIndicator.hide();
                        MessageBox.error("error");
                    }
                });
                //  this._oDSC.setShowSideContent(false)
            },


            navigateToView1: function () {
                ////debugger
                // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.navTo("View1", true);
                // var oHistory = History.getInstance();
                window.history.go(-1);

            },
            Content: function () {
                ////debugger
                // BusyIndicator.show();
                // oDataModel.refresh(true);
        
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
            },

            OpenEvent :function (){
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
                        ////debugger
                        BusyIndicator.hide();
                        //  eventLog.setData(data);
                        var eventLog = new JSONModel(data);
                        that.getView().setModel(eventLog, "eventData");

                    },
                    error: function (e) {
                        ////debugger
                        BusyIndicator.hide()
                        MessageBox.error("error");
                    }
                });
            },
            CloseEvent: function (oEvent) {
                this.getView().byId("DynamicSideContent").setShowSideContent(false);

            },
            onMainContent:function(sValue){
                ////debugger
                this.getView().byId("DynamicSideContent").setShowMainContent(sValue);
            },
            handleSideContentHide: function () {
                ////debugger
                this.getView().byId("DynamicSideContent").setShowSideContent(false);
                this.onMainContent(true);
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
            onExit: function () {

                this.getView().getModel("appView").setProperty("/layout", "OneColumn");
                that.getView().byId("sapNO").setVisible(false)
            },
            shipdetail: function () {
                ////debugger
                BusyIndicator.show();
                var suppQuo = "1100013"
                var oFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, suppQuo);
                that.oDataModel.read("/SHIPTOSet", {
                    filters: [oFilter],
                    success: function (oData, resp) {
                        ////debugger
                        BusyIndicator.hide();
                        var ship = new JSONModel(oData);
                        that.getView().setModel(ship, "shipDetail");

                    },
                    error: function (error) {
                        ////debugger
                        BusyIndicator.hide();
                        sap.m.MessageToast.show("Cannot load ship detail");
                    }

                });
            },

            RejectOrder: function (oEvent) {
                //debugger
                if (!this.reject) {
                    this.reject = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorder.view.fragments.reject", this);
                    this.getView().addDependent(this.reject);
                }
                this.reject.open();
                sap.ui.getCore().byId("inputcomment").setValue("")
            },
            CancelOrder1: function () {
                this.reject.close();
               
                
              
            },
            SubmitrejectOrder: function (oEvent) {
                //debugger
        
                var comments = sap.ui.getCore().byId("inputcomment").getValue();
                // this.CancelOrder1();
                BusyIndicator.show()
        
                var userdetails = that.getView().getModel("userModel").getData()
                var userrole = that.getOwnerComponent().getModel("userrole").getData()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath)
                var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
                var oPayload = {
                    "action": "CANCEL",
                    "appType": "PR",
                    "prHeader": [previousData],
                    "prCart": [],
                    "prItems": [],
                    "prEvent": [{
                        "PR_NO": prno ,
                        "EVENT_NO": 1,
                        "EVENT_CODE": "1",
                        "USER_ID": "starenterprize@gmail.com",
                        "USER_ROLE": "DIST",
                        "USER_NAME": "Star Enterprize",
                        "COMMENTS": comments,
                        "CREATION_DATE": null
                    }],
                    "userDetails": {
                        "USER_ROLE": "DIST",
                        "USER_ID": "starenterprize@gmail.com"
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
                        // BusyIndicator.hide()
                        that.CancelOrder1()
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    //debugger
                                    BusyIndicator.hide()
                                    that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                    var router = sap.ui.core.UIComponent.getRouterFor(that);
                                    router.navTo("RouteView1",
                                    { "loginId": id })
                                    sap.ui.getCore().byId("inputcomment").setValue("")
                                    
                                    
                                }
                            }
                        }
                        );
        
                    },
        
                    error: function (oError) {
                        ////debugger;
                        BusyIndicator.hide()
                      
                        MessageBox.error(JSON.parse(oError.responseText).error.message)
        
        
                    }
                });
        
            },

            userrole: function () {
                ////debugger
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
                        ////debugger
          
          
          
                        var headeritem = new JSONModel(data.value[0]);
                        that.getOwnerComponent().setModel(headeritem, "userrole");
          
          
          
                    },
                    error: function (oError) {
                        ////debugger
                        BusyIndicator.hide()
                        // MessageBox.error(e.responseText);
                        MessageBox.error(JSON.parse(oError.responseText))
          
                    }
                });
          
            },
        });
    });