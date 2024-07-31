sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "com/ibs/ibsappidealpaymentapproval/model/formatter",
    "com/ibs/ibsappidealpaymentapproval/model/down"
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox,BusyIndicator,formatter,down) {
        "use strict";
        var oDataModel,userData;
        var that,prno,SAP_SO_NO,ostatus;
        var appId, appPath, appModulePath;
        var dfullpay,dppay,dpdcpay;
        var level;
        var File_id;
        var selectedFileName;
        var sUserRole;
        var exday;
        return Controller.extend("com.ibs.ibsappidealpaymentapproval.controller.DetailPage", {
            formatter: formatter,
            onInit: function () {
                BusyIndicator.hide()
                that = this;
                that._oDSC = this.byId("DynamicSideContent");
                oDataModel = that.getOwnerComponent().getModel();

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("DetailPage").attachPatternMatched(this.objectRouteMatched, this);
            },
            objectRouteMatched :function(oEvent){
                debugger
                
                BusyIndicator.hide()
                var flag = oEvent.getParameters().arguments.FLAG;
                if(flag === "true"){
                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                }else{
                this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                }
                
                appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                // previousData =that.getOwnerComponent().getModel("vendorDetail").getData()
                prno = oEvent.getParameters().arguments.PR_NO;
                
                if (that.getUserData === undefined) {

                    var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                    var appPath = appId.replaceAll(".", "/");
                    appModulePath = jQuery.sap.getModulePath(appPath);
                    var attr = appModulePath + "/user-api/attributes";
        
                    userData = this.getOwnerComponent().getModel("userModel").getData();
                    var id= "Payment Request No:" + " " + prno 
                    this.getView().byId("reqno").setText(id)
    


                    // that.readUserMasterEntities();
                    // // that.popread()
                    // // that.readData();
                    // that.fileData();
                    // that.userrole();

                    
                    
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
                    } else {
                        userData = this.getOwnerComponent().getModel("userModel").getData();
                        var id= "Payment Request No:" + " " + prno 
                        this.getView().byId("reqno").setText(id)
        
                        that.readUserMasterEntities();
                        // that.popread()
                        // that.readData();
                        that.fileData();
                        that.userrole();
                    }
            },
            readUserMasterData : function(userEmail){
                debugger
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
                        var id= "Payment Request No:" + " " + prno 
                        that.getView().byId("reqno").setText(id)
        
                        that.readUserMasterEntities();
                        // that.popread()
                        // that.readData();
                        that.fileData();
                        that.userrole();
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
            readUserMasterEntities: async function () {
                debugger
                // hierarchyLevel = await that.calLevel();
                // that.calView(hierarchyLevel,userData.userId);
                that.checkUserId(prno,userData.userId)
            },
    
            checkUserId : function(prno,userId){
                debugger;
    
                // var aFilter = "REQUEST_NO eq '"+ reqNo +"' "ideal-claim-creation-srv/ClaimHeader?$filter=CR_NO eq "+ sLoginId

                // var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimHeader?$filter=CR_NO eq " + crNo + "";
                
                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=POP_NO eq " + prno + "";


                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
                        debugger;
                        // entityCode = data.value[0].ENTITY_CODE;
                        level = data.value[0].APPROVER_LEVEL;
                        that.popread();
                        that.readAccess(level, userData.userId);
                        // that.calView(level,userData.userId);
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
            },
            calView : function(hierarchyLevel,userId){
                debugger;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=(TYPE eq 'CR') and (LEVEL eq " + hierarchyLevel + ") and (USER_IDS eq '" + userId +"')";
                // var data = { $expand: 'TO_USER_ENTITIES' };
                    var hLevelArr = [];
                    // return new Promise(function(resolve,reject){
                    $.ajax({
                        url: url,
                        type: "GET",
                        contentType: 'application/json',
                        // data: data,
                        success: function (data, response) {
                            debugger;
                            if(data.value.length === 0){
                                MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
                            }else{
                                // var crNo = Number(oEvent.getParameters().arguments.CR_NO);
                               
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

            readAccess: function(level, userEmail){
                debugger;
                // var userDetailModel = new JSONModel();
                // var vendorDetailsData2 = this.getOwnerComponent().getModel("vendorDetail").getData();
                // var eCode = vendorDetailsData2.ENTITY_CODE;
                // var appLevel = vendorDetailsData2.APPROVER_LEVEL;\
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var hType = "PAY";
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=(ENTITY_CODE eq '1000') and (LEVEL eq " + level + ") and (TYPE eq '" + hType + "')";
                // var data = { $expand: 'TO_USER_ENTITIES' };
                // (USER_IDS eq '" + userEmail + "')
        
                    $.ajax({
                        url: url,
                        type: "GET",
                        contentType: 'application/json',
                        // data: data,
                        success: function (data, response) {
                            debugger;
        
                            var mHierarchyId = data.value.map((x)=>{if(x.USER_IDS.includes(userData.userId)){return x}});
                            
                            if(mHierarchyId[0].ACCESS_SENDBACK === true){
                                that.getView().byId("rejectBt").setVisible(true);
                                // that.getView().byId("edtBTn").setVisible(true);
                              
                            }else{
                                that.getView().byId("rejectBt").setVisible(false);
                                
                               
                            }
        
                            if(mHierarchyId[0].ACCESS_APPROVE === true){
                                that.getView().byId("approveBt").setVisible(true);
                                
                            }else{
                                that.getView().byId("approveBt").setVisible(false);
                            }
        
                            if(mHierarchyId[0].ACCESS_HOLD === true){
                                that.getView().byId("Hold").setVisible(true);
                            }else{
                                that.getView().byId("Hold").setVisible(false);
                            }
        
                            // if(mHierarchyId[0].ACCESS_EDIT === true){
                            //     that.getView().byId("editBtn").setVisible(true);
                            // }else{
                            //     that.getView().byId("editBtn").setVisible(false);
                            // }
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
            },


            tableVisble :function(){
                debugger
                if (dfullpay) {
                    this.getView().byId("fullpaymet").setVisible(true)
                    this.getView().byId("particalPay").setVisible(false)
                    this.getView().byId("pdc").setVisible(false)
                    this.getView().byId("exdays").setVisible(false)
                    
                }else if(dppay){
                    this.getView().byId("fullpaymet").setVisible(false)
                    this.getView().byId("particalPay").setVisible(true)
                    this.getView().byId("pdc").setVisible(false)
                    this.getView().byId("exdays").setVisible(false)
                }else if(dpdcpay){
                    this.getView().byId("fullpaymet").setVisible(false)
                    this.getView().byId("particalPay").setVisible(false)
                    this.getView().byId("pdc").setVisible(true)
                    this.getView().byId("exdays").setVisible(false)
                }else if(exday){
                    this.getView().byId("fullpaymet").setVisible(false)
                    this.getView().byId("particalPay").setVisible(false)
                    this.getView().byId("pdc").setVisible(false)
                    this.getView().byId("exdays").setVisible(true)
                }

            },

            f_visible : function(){
                debugger
                if(ostatus === 1){
                    // detailPageId
                    that.getView().byId("detailPageId").setShowFooter(true);
                 
                }else if (ostatus === 2){
                    that.getView().byId("detailPageId").setShowFooter(true);
                    
                }else if(ostatus === 3){
                    that.getView().byId("detailPageId").setShowFooter(true);
                    
                }else if(ostatus === 4){
                    that.getView().byId("detailPageId").setShowFooter(false);
                    
                }else if(ostatus === 5){
                    that.getView().byId("detailPageId").setShowFooter(false);
                    that.getView().byId("edtBTn").setVisible(true);
                }else if(ostatus === 7){
                    that.getView().byId("detailPageId").setShowFooter(true);
                    
                }

            },
            popread : function(){
                debugger

                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsHeader?$filter=POP_NO eq " + prno + "&$expand=TO_STATUS";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger
                       
                        var tableitems = new JSONModel(data);
                        that.getOwnerComponent().setModel(tableitems, "popread");
                         SAP_SO_NO =that.getOwnerComponent().getModel("popread").getData().value[0].PR_SAP_NO
                          ostatus= that.getOwnerComponent().getModel("popread").getData().value[0].STATUS
                          that.f_visible(); 
                         that.readData();
                         
                         
                         var alldata=that.getOwnerComponent().getModel("popread").getData().value[0]
                         dfullpay= alldata.OFFLINE_FP_UTR
                         dppay=alldata.OFFLINE_PP_UTR
                        dpdcpay= alldata.PDC_NO
                        exday= alldata.EXCRDT_DAYS
                        that.tableVisble();
                     

                    },
                    error: function (e) {
                        debugger
                        BusyIndicator.hide();
                        MessageBox.error("error");
                    }
                });
            },




            readData : function(){
                debugger
                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PrHeader?$expand=TO_STATUS&$filter=SAP_SO_NO eq '" + SAP_SO_NO + "'";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger
                       
                        var tableitems = new JSONModel(data);
                        that.getOwnerComponent().setModel(tableitems, "iModel");
                        // var alldata=that.getOwnerComponent().getModel("iModel").getData().value[0]
                       
                    },
                    error: function (e) {
                        debugger
                        BusyIndicator.hide();
                        MessageBox.error("error");
                    }
                });
            },


            CloseEvent: function (oEvent) {
                this._oDSC.setShowSideContent(false);
        
              },
            Content : function(flag){
                debugger
                // oDataModel. refresh(true);
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


                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsEventLog?$expand=TO_EVENT_STATUS&$filter=POP_NO eq " + prno + "";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger
                       
                        var tableitems = new JSONModel(data);
                        that.getOwnerComponent().setModel(tableitems, "eventData");
                       
                      

                    },
                    error: function (e) {
                        debugger
                        BusyIndicator.hide();
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
            
            userrole: function(){
                debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var userdetails =  this.getOwnerComponent().getModel("userModel").getData()
                var url = appModulePath +"/odata/v4/ideal-purchase-creation-srv/MasterIdealUsers?$filter=(EMAIL eq '"+ userdetails.userId +"') and (ACTIVE eq 'X')";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger
                     
                     var headeritem = new JSONModel(data.value[0]);
                    that.getOwnerComponent().setModel(headeritem, "userrole"); 
                  


                    },
                    error: function (e) {
                        debugger
                        BusyIndicator.hide();
                        MessageBox.error(e.responseText);
                    }
                });

            },
            onApprove : function(){
                debugger
                BusyIndicator.show()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var surl = appModulePath + "/odata/v4/ideal-payments-creation-srv/createPayment";
                var alldata=that.getOwnerComponent().getModel("popread").getData().value[0]
                var filedata=that.getOwnerComponent().getModel("fileModel").getData()
                var userdetails =  this.getOwnerComponent().getModel("userModel").getData();
                var userrole=this.getView().getModel("userrole").getData()

               var oPayload= {
                    "action": "APPROVE",
                    "appType": "PAY",
                    "paymentsHeader": [alldata],
                    "paymentsAttachments": [],
                    "paymentsEventLog":[{
                        
                            
                                "POP_NO": alldata.POP_NO,
                                "EVENT_NO": 1,
                                "EVENT_CODE": 1,
                                "USER_ID": userdetails.userId,
                                "USER_ROLE": userrole.USER_ROLE,
                                "USER_NAME": userdetails.userName,
                                "COMMENTS": "Payment Approved",
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
                        debugger;
                        BusyIndicator.hide();
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    debugger
                                    // this.getView().byId("shiftdetail").setValue("");
                                    that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                    var router = sap.ui.core.UIComponent.getRouterFor(that);
                                    router.navTo("RouteMasterPage");

                                }
                            }
                        }
                        );
                    },
                    error: function (oError) {
                        debugger;
                        BusyIndicator.hide();
                        // MessageBox.error(oError.responseText);
                        MessageBox.error(JSON.parse(oError.responseText).error.message)

                    }
                });

                
            },


            onReject :function(){
                debugger
                BusyIndicator.show()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var surl = appModulePath + "/odata/v4/ideal-payments-creation-srv/createPayment";
                var alldata=that.getOwnerComponent().getModel("popread").getData().value[0]
                var filedata=that.getOwnerComponent().getModel("fileModel").getData()
                var userdetails =  this.getOwnerComponent().getModel("userModel").getData();
                var userrole=this.getView().getModel("userrole").getData()

                var oPayload= {
                    "action": "SENDBACK",
                    "appType": "PAY",
                    "paymentsHeader": [alldata],
                    "paymentsAttachments": [],
                    "paymentsEventLog":[{
                        
                            
                                "POP_NO": alldata.POP_NO,
                                "EVENT_NO": 1,
                                "EVENT_CODE": 1,
                                "USER_ID": userdetails.userId,
                                "USER_ROLE": userrole.USER_ROLE,
                                "USER_NAME": userdetails.userName,
                                "COMMENTS": "Payment SendBack",
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
                        debugger;
                        BusyIndicator.hide();
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    debugger
                                    // this.getView().byId("shiftdetail").setValue("");
                                    that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                    var router = sap.ui.core.UIComponent.getRouterFor(that);
                                    router.navTo("RouteMasterPage");

                                }
                            }
                        }
                        );
                    },
                    error: function (oError) {
                        debugger;
                        BusyIndicator.hide();
                        MessageBox.error(oError.responseText);

                    }
                });

            },
            onhold :function(){
                debugger
                BusyIndicator.show()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var surl = appModulePath + "/odata/v4/ideal-payments-creation-srv/createPayment";
                var alldata=that.getOwnerComponent().getModel("popread").getData().value[0]
                var filedata=that.getOwnerComponent().getModel("fileModel").getData()
                var userdetails =  this.getOwnerComponent().getModel("userModel").getData();
                var userrole=this.getView().getModel("userrole").getData()

                var oPayload= {
                    "action": "HOLD",
                    "appType": "PAY",
                    "paymentsHeader": [alldata],
                    "paymentsAttachments": [],
                    "paymentsEventLog":[{
                        
                            
                                "POP_NO": alldata.POP_NO,
                                "EVENT_NO": 1,
                                "EVENT_CODE": 1,
                                "USER_ID": userdetails.userId,
                                "USER_ROLE": userrole.USER_ROLE,
                                "USER_NAME": userdetails.userName,
                                "COMMENTS": "Payment On Hold",
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
                        debugger;
                        BusyIndicator.hide();
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    debugger
                                    // this.getView().byId("shiftdetail").setValue("");
                                    that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                    var router = sap.ui.core.UIComponent.getRouterFor(that);
                                    router.navTo("RouteMasterPage");

                                }
                            }
                        }
                        );
                    },
                    error: function (oError) {
                        debugger;
                        BusyIndicator.hide();
                        MessageBox.error(oError.responseText);

                    }
                });

            },

            // paymethod:function(){
            //     debugger
            //     var alldata=that.getOwnerComponent().getModel("iModel").getData().value[0]
            //     var id=alldata.DISTRIBUTOR_ID
            //     var prNO=alldata.PR_SAP_NO;
            //    var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            //    var appPath = appId.replaceAll(".", "/");
            //    var appModulePath = jQuery.sap.getModulePath(appPath);
            //     var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and SAP_SO_NO eq '" + prNO+"'";
            //     $.ajax({
            //         url: url,
            //         type: 'GET',
            //         data: null,
            //         contentType: 'application/json',
            //         success: function (data, responce) {
            //             debugger
            //             var model = new JSONModel(data);
            //             that.getOwnerComponent().setModel(model, "paymentMothod");
                       

            //         },
            //         error: function (e) {
            //             debugger
            //              BusyIndicator.hide();
            //             MessageBox.error(e.responseText);
            //         }
            //     });

            // },

      

            f_download : function(oEvent){
                debugger
                
                     selectedFileName =oEvent.getSource().getBindingContext("fileModel").getObject().FILE_NAME
                    
            
                    // var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsAttachments?$filter=POP_NO eq " + prno + "";
                    var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsAttachments(POP_NO=" + prno + ",FILE_ID="+File_id+")/$value";
                    $.ajax({
                        url: url,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (data, responce) {
                            debugger
                            that.fileType(data);
                            // context.downloadFileContent('text/plain', 1,'CLAIM REQUEST PAYLOAD.txt', 'text/plain', data);
                            
                        },
                        error: function (error) {
                            BusyIndicator.hide();
                            var oXMLMsg, oXML;
                            if (context.isValidJsonString(error.responseText)) {
                                oXML = JSON.parse(error.responseText);
                                oXMLMsg = oXML.error["message"];
                            } else {
                                oXMLMsg = error.responseText;
                            }
                            MessageBox.error(oXMLMsg);
                        }
                    });
            },

            fileType : function(data){
                debugger;
                // var iDocId = "(CR_NO eq " + iDocId + ")";

                var path = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsAttachments?$filter=POP_NO eq " + prno + "";
                var FILE_CONTENT = data;
                $.ajax({
                    url: path,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger;
                        for (let i = 0; i < data.value.length; i++) {
                            if(selectedFileName === data.value[i].FILE_NAME){
                          that.downloadFileContent(data.value[i].FILE_TYPE || null, data.value[i].SR_NO || null, data.value[i].FILE_NAME, data.value[i].FILE_MIMETYPE, FILE_CONTENT);

                            }
                            
                        }


                        // if (data.value.length > 0) {
                        //     that.downloadFileContent(data.value[0].FILE_TYPE || null, data.value[0].SR_NO || null, data.value[0].FILE_NAME, data.value[0].FILE_MIMETYPE, FILE_CONTENT);
                        // } else {
                        //     MessageBox.error("Attachments are empty.");
                        // }
                    },
                    error: function (error) {
                        debugger;
                        BusyIndicator.hide();
                        var oXMLMsg, oXML;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText;
                        }
                        MessageBox.error(oXMLMsg);
                    }
                });
            },
            downloadFileContent: function (iFILE_TYPE, iSR_NO, sFILE_NAME, sFILE_MIMETYPE, sFILE_CONTENT) {
                debugger 
                // this.sbIndex = parseInt(oEvent.getSource().getBindingContext("aModel").getPath().split("/")[1]);
                var aFilter = [],
                fileContent = null;
        
                // var data = this.getView().getModel("aModel").getData()[this.sbIndex];
        
                // if(data.FILE_MIMETYPE === "text/plain")
                // {
                // 	var sFILE_CONTENT = atob(data.FILE_CONTENT);
                // }
                // sFILE_CONTENT = atob(data.FILE_CONTENT);
                // sFILE_CONTENT = sFILE_CONTENT;
                this.downloadAttachment(sFILE_CONTENT, sFILE_NAME, sFILE_MIMETYPE);
            },
            downloadAttachment: function (content, fileName, mimeType) {
             debugger
                download("data:application/octet-stream;base64," + content, fileName, mimeType);
                var HttpRequest = new XMLHttpRequest();
                // x.open("GET", "http://danml.com/wave2.gif", true);
                HttpRequest.responseType = 'blob';
                HttpRequest.onload = function (e) {
                    download(HttpRequest.response, fileName, mimeType);
                }
                HttpRequest.send();
            },







            fileData : function(){
                debugger
                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsAttachments?$filter=POP_NO eq " + prno + "";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger
                       
                        var tableitems = new JSONModel(data);
                        that.getOwnerComponent().setModel(tableitems, "fileModel");

                        for (let i = 0; i < data.value.length; i++) {
                            File_id= data.value[i].FILE_ID
                                
                            }

                    },
                    error: function (e) {
                        debugger
                        BusyIndicator.hide();
                        MessageBox.error("error");
                    }
                });
            },


            onFullScreen:function(){
 
                if(this.getView().getModel("appView").getProperty("/layout") == "TwoColumnsMidExpanded"){
                    this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                    this.getView().getModel("appView").setProperty("/icon", "sap-icon://exit-full-screen");
                }else{
                    this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                    this.getView().getModel("appView").setProperty("/icon", "sap-icon://full-screen");
                }
            },
            onExit:function(){
                this.getView().getModel("appView").setProperty("/layout", "OneColumn");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                oRouter.navTo("RouteMasterPage");
            },
      
        });
    });