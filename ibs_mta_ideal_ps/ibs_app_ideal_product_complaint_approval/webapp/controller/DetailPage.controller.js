sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealproductcomplaintapproval/model/formatter",
    "com/ibs/ibsappidealproductcomplaintapproval/model/down",
    "sap/ui/core/BusyIndicator"
],
function (Controller,JSONModel,MessageBox,formatter,down,BusyIndicator) {
    "use strict";
    var that,prno,level,userId;
    var oDataModel,userData;
    var o_status,sUserRole;
    var File_id,Form_id;
    var selectedFileName;
    var appId,appPath,appModulePath;
    return Controller.extend("com.ibs.ibsappidealproductcomplaintapproval.controller.DetailPage", {
        formatter: formatter,
        onInit: function () {
            BusyIndicator.hide();
                that = this;
                that._oDSC = this.byId("DynamicSideContent");
                oDataModel = that.getOwnerComponent().getModel();

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("DetailPage").attachPatternMatched(this.objectRouteMatched, this);
        },
        objectRouteMatched :function(oEvent){
            debugger
            BusyIndicator.hide();
            appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);
            // previousData =that.getOwnerComponent().getModel("vendorDetail").getData()
            prno = oEvent.getParameters().arguments.PR_NO;
            
            var flag = oEvent.getParameters().arguments.FLAG;
            if(flag === "true"){
            this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            }else{
            this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
            }



            if (that.getUserData === undefined) {

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var attr = appModulePath + "/user-api/attributes";


                // userData = that.getOwnerComponent().getModel("userModel").getData();
                var id= "PPR Request No.:" + " " + prno 
                this.getView().byId("reqno").setText(id)

            // that.readData();
            // that.readUserMasterEntities();
            // that.fileData();
            // that.userrole();
            // that._readTimelineData();
            


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
                var id= "PPR Request No.:" + " " + prno 
                this.getView().byId("reqno").setText(id)

            that.readData();
            that.readUserMasterEntities();
            that.fileData();
            that.userrole();
            that._readTimelineData();
            }
        },
        readUserMasterData : function(userEmail){
            var userDetailModel = new JSONModel();

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);

            var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userEmail + "') and (ACTIVE eq 'X')";
            var data = { $expand: 'TO_USER_ENTITIES' };
            var context
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
                            var id= "PPR Request No.:" + " " + prno 
                            that.getView().byId("reqno").setText(id)
                            
                            that._readTimelineData()
                            that.userrole();
                            that.fileData();
                    that.readData()
                that.readUserMasterEntities();
              
             
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
        readData : function(){
            debugger
            var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=PPR_NO eq " + prno + "&$expand=TO_STATUS";

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
                    o_status=data.value[0].TO_STATUS.CODE
                    that.visible();
                },
                error: function (e) {
                    debugger
                    BusyIndicator.hide();
                    MessageBox.error("error");
                }
            });
        },

        readUserMasterEntities: async function () {
            //debugger
            // hierarchyLevel = await that.calLevel();
            // that.calView(hierarchyLevel,userData.userId);
            that.checkUserId(prno, userData.userId)
        },
        checkUserId: function (prno, userId) {
            debugger;

            // var aFilter = "REQUEST_NO eq '"+ reqNo +"' "ideal-claim-creation-srv/ClaimHeader?$filter=CR_NO eq "+ sLoginId

            // var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimHeader?$filter=CR_NO eq " + crNo + "";
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var url = appModulePath + "odata/v4/ideal-product-complaint-srv/PprHeader?$filter=PPR_NO eq " + prno + "";


            $.ajax({
                url: url,
                type: "GET",
                contentType: 'application/json',
                // data: data,
                success: function (data, response) {
                    debugger;
                    // entityCode = data.value[0].ENTITY_CODE;
                    level = data.value[0].APPROVER_LEVEL;
                
                    that.readAccess(level, userData.userId);
                    // that.calView(level,userData.userId);
                    
                    that.fileData();
                    that.userrole();
                    that._readTimelineData();

                },
                error: function (error) {
                    debugger;
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
            debugger;
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
                    debugger;
                    if (data.value.length === 0) {
                        MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
                    } else {
                        // var crNo = Number(oEvent.getParameters().arguments.CR_NO);

                    }
                },
                error: function (error) {
                    
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
            debugger;
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
                    debugger;

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
                    debugger;
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

        visible : function(){
        debugger
         if(o_status === 1){
            that.getView().byId("detailPageId").setShowFooter(true);
         } else if(o_status === 3){
            that.getView().byId("detailPageId").setShowFooter(false);
         }else if(o_status === 4){
            that.getView().byId("detailPageId").setShowFooter(false);
         }
        },
        downloadAttachment: function (content, fileName, mimeType) {
            debugger
            download("data:application/octet-stream;base64," + content, fileName, mimeType);
               // download("data:application/octet-stream;base64," + content, fileName, mimeType);
               var HttpRequest = new XMLHttpRequest();
               // x.open("GET", "http://danml.com/wave2.gif", true);
               HttpRequest.responseType = 'blob';
               HttpRequest.onload = function (e) {
                   download(HttpRequest.response, fileName, mimeType);
               }
               HttpRequest.send();
           },
        _readTimelineData : function(){
            var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprEvent?$filter=PPR_NO eq " + prno + "";

            
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
                    MessageBox.error("error");
                }
            });
        },
        Content : function(){
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
        },
        fileData : function(){
            debugger
            var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprAttachment?$filter=PPR_NO eq " + prno + "";

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
                        Form_id=  data.value[i].FORM_ID 
                        }

               

                },
                error: function (e) {
                    //debugger
                    BusyIndicator.hide();
                    MessageBox.error("error");
                }
            });
        },
        f_download : function(oEvent){
            debugger
            
                 selectedFileName =oEvent.getSource().getBindingContext("fileModel").getObject().FILE_NAME
                
        
                // var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsAttachments?$filter=POP_NO eq " + prno + "";
                var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprAttachment(PPR_NO=" + prno + ",FILE_ID="+File_id+",FORM_ID="+Form_id+")/$value";
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
                        debugger
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

            var path = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprAttachment?$filter=PPR_NO eq " + prno + "";
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


                 
                },
                error: function (error) {
                    //debugger;
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
        

        CloseEvent: function (oEvent) {
            this._oDSC.setShowSideContent(false);
    
          },
          userrole: function () {
            debugger
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
                    debugger



                    var headeritem = new JSONModel(data.value[0]);
                    that.getOwnerComponent().setModel(headeritem, "userrole");



                },
                error: function (e) {
                    //debugger
                    BusyIndicator.hide();
                    MessageBox.error(e.responseText);
                }
            });

        },
          onApprove : function(){
            debugger
            BusyIndicator.show();
            var filedata=that.getOwnerComponent().getModel("fileModel").getData()
            var headerdata= that.getOwnerComponent().getModel("iModel").getData()
            var userdetails = that.getView().getModel("userModel").getData()
            var userrole = that.getOwnerComponent().getModel("userrole").getData()
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var surl = appModulePath + "/odata/v4/ideal-product-complaint-srv/createProductComplaint";

        //  var filedata= this.getView().getModel("claimAttachMapJson").getData()
           
            var oPayload = {
                "action": "APPROVE",
                "appType": "PPR",
                "PprHeader": [
                    {
                        "PPR_NO":headerdata.value[0].PPR_NO,
                        "PROD_GRP":headerdata.value[0].PROD_GRP,
                        "DISTRIBUTOR_ID":headerdata.value[0].DISTRIBUTOR_ID,
                        "DISTRIBUTOR_NAME":headerdata.value[0].DISTRIBUTOR_NAME,
                        "PROD_CODE":headerdata.value[0].PROD_CODE,
                        "PROD_UNKNOWN":headerdata.value[0].PROD_UNKNOWN,
                        "FACTORY_NAME":headerdata.value[0].FACTORY_NAME,
                        "DESCRIPTION":headerdata.value[0].DESCRIPTION,
                        "STATUS":headerdata.value[0].STATUS,
                        "SALES_ASSOCIATE_ID":headerdata.value[0].SALES_ASSOCIATE_ID,
                        "APPROVER_ROLE":headerdata.value[0].APPROVER_ROLE,
                        "APPROVER_LEVEL":headerdata.value[0].APPROVER_LEVEL,
                        
                        "CREATED_ON":null
                    }
                ],
                "PprAttachment": [
                    {
                        "PPR_NO":headerdata.value[0].PPR_NO,
                        "ATTACH_CODE":filedata.value[0].ATTACH_CODE,
                        "FORM_ID":1,
                        "FILE_ID":1,
                        "FILE_NAME":filedata.value[0].FILE_NAME,
                        "FILE_TYPE":filedata.value[0].FILE_TYPE,
                        "FILE_MIMETYPE":filedata.value[0].FILE_MIMETYPE,
                        "FILE_CONTENT":filedata.value[0].FILE_CONTENT,
                        "UPLOAD_DATE":new Date()
                    }
                ],
                "PprEvent": [
                    {
                        "PPR_NO":headerdata.value[0].PPR_NO,
                        "EVENT_NO":1,
                        "EVENT_CODE":1,
                        "USER_NAME":userdetails.userName,
                        "USER_ROLE":userrole.USER_ROLE,
                        "USER_ID":userdetails.userId,
                        "REMARK":"",
                        "COMMENT":"Product complaint request approved",
                        "CREATION_DATE":null
                    }
                ],
                "userDetails": {
                    "USER_ROLE": userrole.USER_ROLE,
                    "USER_ID": userdetails.userId
                }
            }
            var Postdata = JSON.stringify(oPayload);

            $.ajax({
                url: surl,
                type: 'POST',
                data: Postdata,
                contentType: 'application/json',
                success: function (data, responce) {
                    debugger;
                    BusyIndicator.hide();
                    MessageBox.success(data.value.OUT_SUCCESS, {
                        actions: [MessageBox.Action.OK],
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                // BusyIndicator.hide();

                                // commented for testing purpose
                               
                                that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                oRouter.navTo("RouteMasterPage");
                            }
                        }
                    });
                },
                error: function (e) {
                    debugger
                    BusyIndicator.hide();
                    var oXMLMsg, oXML;
                    // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                    if (that.isValidJsonString(e.responseText)) {
                        oXML = JSON.parse(e.responseText);
                        oXMLMsg = oXML.error["message"];
                    } else {
                        oXMLMsg = e.responseText;
                    }
                    MessageBox.error(oXMLMsg);
                }
            });
          },
          rejectFrag: function (oEvent) {
            debugger
            BusyIndicator.show();
            if (!this.reject) {
                this.reject = sap.ui.xmlfragment("com.ibs.ibsappidealproductcomplaintapproval.view.fragments.reject", this);
                this.getView().addDependent(this.reject);
            }
            BusyIndicator.hide();
            this.reject.open();
        },
        CancelOrder1: function () {
            this.reject.close();
            this.reject.destroy();
            this.reject = null;
        },
          SubmitrejectOrder : function(){
            debugger
            BusyIndicator.show();
            var comments = sap.ui.getCore().byId("inputcomment").getValue();
                this.CancelOrder1();
            var filedata=that.getOwnerComponent().getModel("fileModel").getData()
            var headerdata= that.getOwnerComponent().getModel("iModel").getData()
            var userdetails = that.getView().getModel("userModel").getData()
            var userrole = that.getOwnerComponent().getModel("userrole").getData()
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var surl = appModulePath + "/odata/v4/ideal-product-complaint-srv/createProductComplaint";

        
           
            var oPayload = {
                "action": "REJECT",
                "appType": "PPR",
                "PprHeader": [
                    {
                        "PPR_NO":headerdata.value[0].PPR_NO,
                        "PROD_GRP":headerdata.value[0].PROD_GRP,
                        "DISTRIBUTOR_ID":headerdata.value[0].DISTRIBUTOR_ID,
                        "DISTRIBUTOR_NAME":headerdata.value[0].DISTRIBUTOR_NAME,
                        "PROD_CODE":headerdata.value[0].PROD_CODE,
                        "PROD_UNKNOWN":headerdata.value[0].PROD_UNKNOWN,
                        "FACTORY_NAME":headerdata.value[0].FACTORY_NAME,
                        "DESCRIPTION":headerdata.value[0].DESCRIPTION,
                        "STATUS":headerdata.value[0].STATUS,
                        "SALES_ASSOCIATE_ID":headerdata.value[0].SALES_ASSOCIATE_ID,
                        "APPROVER_ROLE":headerdata.value[0].APPROVER_ROLE,
                        "APPROVER_LEVEL":headerdata.value[0].APPROVER_LEVEL,
                        
                        "CREATED_ON":null
                    }
                ],
                "PprAttachment": [
                    {
                        "PPR_NO":headerdata.value[0].PPR_NO,
                        "ATTACH_CODE":filedata.value[0].ATTACH_CODE,
                        "FORM_ID":1,
                        "FILE_ID":1,
                        "FILE_NAME":filedata.value[0].FILE_NAME,
                        "FILE_TYPE":filedata.value[0].FILE_TYPE,
                        "FILE_MIMETYPE":filedata.value[0].FILE_MIMETYPE,
                        "FILE_CONTENT":filedata.value[0].FILE_CONTENT,
                        "UPLOAD_DATE":new Date()
                    }
                ],
                "PprEvent": [
                    {
                        "PPR_NO":headerdata.value[0].PPR_NO,
                        "EVENT_NO":1,
                        "EVENT_CODE":1,
                        "USER_NAME":userdetails.userName,
                        "USER_ROLE":userrole.USER_ROLE,
                        "USER_ID":userdetails.userId,
                        "REMARK":"",
                        "COMMENT":comments,
                        "CREATION_DATE":null
                    }
                ],
                "userDetails": {
                    "USER_ROLE": userrole.USER_ROLE,
                    "USER_ID": userdetails.userId
                }
            }
            var Postdata = JSON.stringify(oPayload);

            $.ajax({
                url: surl,
                type: 'POST',
                data: Postdata,
                contentType: 'application/json',
                success: function (data, responce) {
                    debugger;
                    BusyIndicator.hide();
                    MessageBox.success(data.value.OUT_SUCCESS, {
                        actions: [MessageBox.Action.OK],
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                // BusyIndicator.hide();

                                // commented for testing purpose
                               
                                that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                oRouter.navTo("RouteMasterPage");
                            }
                        }
                    });
                },
                error: function (e) {
                    debugger
                    BusyIndicator.hide();
                    var oXMLMsg, oXML;
                    // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                    if (that.isValidJsonString(e.responseText)) {
                        oXML = JSON.parse(e.responseText);
                        oXMLMsg = oXML.error["message"];
                    } else {
                        oXMLMsg = e.responseText;
                    }
                    MessageBox.error(oXMLMsg);
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