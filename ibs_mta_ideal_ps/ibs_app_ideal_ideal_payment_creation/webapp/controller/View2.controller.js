sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealidealpaymentcreation/model/formatter",
    "com/ibs/ibsappidealidealpaymentcreation/model/down",
    "sap/ui/core/BusyIndicator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox,formatter,down,BusyIndicator) {
        "use strict";
        var oDataModel;
        var id;
        var that,prno,SAP_SO_NO;
        var appId, appPath, appModulePath;
        var dfullpay,dppay,dpdcpay;
        var File_id,exday;
        var ostatus;
        var fullutrupdted,fullutrlastupdated;
        var pputrupdate,pputrlastupdate;
        var pdcutrupdate,pdcutrlastupdate;
        var excidayupdted,excidedayslastupdate;
        var payment,fullpayu_Date;
        return Controller.extend("com.ibspl.ideal.idealpaymentcreation.controller.View2", {
            formatter: formatter,
            onInit: function () {
                that = this;
                that._oDSC = this.byId("DynamicSideContent");
                oDataModel = that.getOwnerComponent().getModel();

            const oRouter = this.getOwnerComponent().getRouter();
oRouter.getRoute("View2").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched :function(oEvent){
                //debugger
                appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                // previousData =that.getOwnerComponent().getModel("vendorDetail").getData()
                prno = oEvent.getParameters().arguments.PR_NO
                id = "1100013"
                var id= "Payment Request No:" + " " + prno 
                this.getView().byId("reqno").setText(id)
                that.popread()
                // that.readData();
                that.fileData();
                that.userrole(); 
                that._readTimelineData()
               
             
                
            },
            tableVisble :function(){
                //debugger
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
                        for (var i = 0; i <data.value.length; i++) {
                            
                            data.value[i].OFFLINE_PP_DATE= new Date(data.value[i].OFFLINE_PP_DATE)
                            data.value[i].OFFLINE_FP_DATE= new Date(data.value[i].OFFLINE_FP_DATE)
                            data.value[i].PDC_DATE= new Date(data.value[i].PDC_DATE)
                         }

                        var tableitems = new JSONModel(data);
                        that.getOwnerComponent().setModel(tableitems, "popread");
                         SAP_SO_NO =that.getOwnerComponent().getModel("popread").getData().value[0].PR_SAP_NO
                         ostatus= that.getOwnerComponent().getModel("popread").getData().value[0].STATUS

                      
                        //  PAYMENT_TYPE =that.getOwnerComponent().getModel("popread").getData().value[0].PAYMENT_TYPE
                         that.readData();
                         
                         var alldata=that.getOwnerComponent().getModel("popread").getData().value[0]
                         dfullpay= alldata.OFFLINE_FP_UTR
                         dppay=alldata.OFFLINE_PP_UTR
                        dpdcpay= alldata.PDC_NO
                         exday= alldata.EXCRDT_DAYS
                        that.tableVisble();
                        that.f_visible()
                     

                    },
                    error: function (e) {
                        //debugger
                        BusyIndicator.hide()
                        MessageBox.error("error");
                    }
                });
                // this._oDSC.setShowSideContent(false);
            },




            readData : function(){
                //debugger
                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PrHeader?$expand=TO_STATUS&$filter=SAP_SO_NO eq '" + SAP_SO_NO + "'";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger
                       
                        var tableitems = new JSONModel(data);
                        that.getOwnerComponent().setModel(tableitems, "iModel");
                        // var alldata=that.getOwnerComponent().getModel("iModel").getData().value[0]
                       
                    },
                    error: function (e) {
                        //debugger
                        MessageBox.error("error");
                    }
                });
            },
            CloseEvent: function (oEvent) {
                this._oDSC.setShowSideContent(false);
        
              },
            Content : function(flag){
                //debugger
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
            onMainContent:function(sValue){
                this.getView().byId("DynamicSideContent").setShowMainContent(sValue);
            },
            handleSideContentHide: function () {
                this.getView().byId("DynamicSideContent").setShowSideContent(false);
                this.onMainContent(true);
            },
            _readTimelineData : function(){
                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsEventLog?$expand=TO_EVENT_STATUS&$filter=POP_NO eq " + prno + "";

                
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger
                       
                        var tableitems = new JSONModel(data);
                        that.getOwnerComponent().setModel(tableitems, "eventData");
                       
                      

                    },
                    error: function (e) {
                        //debugger
                        MessageBox.error("error");
                    }
                });
            },

            fileData : function(){
                //debugger
                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsAttachments?$filter=POP_NO eq " + prno + "";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger
                       
                        var tableitems = new JSONModel(data);
                        that.getOwnerComponent().setModel(tableitems, "fileModel");

                        for (let i = 0; i < data.value.length; i++) {
                        File_id= data.value[i].FILE_ID
                            
                        }

                    },
                    error: function (e) {
                        //debugger
                        BusyIndicator.hide()
                        MessageBox.error("error");
                    }
                });
            },

            f_download : function(){
                //debugger
                    var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsAttachments(POP_NO=" + prno + ",FILE_ID="+File_id+")/$value";
                    $.ajax({
                        url: url,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (data, responce) {
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
                //debugger;
                // var iDocId = "(CR_NO eq " + iDocId + ")";

                var path = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsAttachments?$filter=POP_NO eq " + prno + "";
                var FILE_CONTENT = data;
                $.ajax({
                    url: path,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data, responce) {
                        //debugger;
                        if (data.value.length > 0) {
                            that.downloadFileContent(data.value[0].FILE_TYPE || null, data.value[0].SR_NO || null, data.value[0].FILE_NAME, data.value[0].FILE_MIMETYPE, FILE_CONTENT);
                        } else {
                            MessageBox.error("Attachments are empty.");
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
                //debugger 
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
             //debugger
                download("data:application/octet-stream;base64," + content, fileName, mimeType);
                var HttpRequest = new XMLHttpRequest();
                // x.open("GET", "http://danml.com/wave2.gif", true);
                HttpRequest.responseType = 'blob';
                HttpRequest.onload = function (e) {
                    download(HttpRequest.response, fileName, mimeType);
                }
                HttpRequest.send();
            },


            userrole: function(){
                //debugger
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
                        //debugger
                     
                     var headeritem = new JSONModel(data.value[0]);
                    that.getOwnerComponent().setModel(headeritem, "userrole"); 
                  


                    },
                    error: function (e) {
                        ////debugger
                        BusyIndicator.hide()
                        MessageBox.error(e.responseText);
                    }
                });

            },
            onApprove : function(){
                //debugger
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
                        //debugger;
                        // BusyIndicator.hide();
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    //debugger
                                    // this.getView().byId("shiftdetail").setValue("");
                                    var router = sap.ui.core.UIComponent.getRouterFor(that);
                                    router.navTo("RouteView1", {
                                        "loginId": id
                                    });

                                }
                            }
                        }
                        );
                    },
                    error: function (oError) {
                        //debugger;
                        BusyIndicator.hide()
                        MessageBox.error(oError.responseText);

                    }
                });

                
            },


            onReject :function(){
                //debugger
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
                        //debugger;
                        // BusyIndicator.hide();
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    //debugger
                                    // this.getView().byId("shiftdetail").setValue("");
                                    var router = sap.ui.core.UIComponent.getRouterFor(that);
                                    router.navTo("RouteView1", {
                                        "loginId": id
                                    });

                                }
                            }
                        }
                        );
                    },
                    error: function (oError) {
                        //debugger;
                        BusyIndicator.hide()
                        MessageBox.error(oError.responseText);

                    }
                });

            },
            onhold :function(){
                //debugger

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
                        //debugger;
                        // BusyIndicator.hide();
                        MessageBox.success(result.value.OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (oAction) {
                                if (oAction === 'OK') {
                                    //debugger
                                    // this.getView().byId("shiftdetail").setValue("");
                                    var router = sap.ui.core.UIComponent.getRouterFor(that);
                                    router.navTo("RouteView1", {
                                        "loginId": id
                                    });

                                }
                            }
                        }
                        );
                    },
                    error: function (oError) {
                        //debugger;
                        BusyIndicator.hide()
                        MessageBox.error(oError.responseText);

                    }
                });

            },

 
            f_visible : function(){
                //debugger
    

            if(ostatus === 1){
                that.getView().byId("detailPageId").setShowFooter(false);
                that.getView().byId("edtBTn").setVisible(false);
                 that.getView().byId("id_sapDoucment").setVisible(false);
                that.getView().byId("sapDO_NO").setVisible(false);
            }else if (ostatus === 2){
                that.getView().byId("detailPageId").setShowFooter(false);
                that.getView().byId("edtBTn").setVisible(false);
                that.getView().byId("id_sapDoucment").setVisible(false);
                that.getView().byId("sapDO_NO").setVisible(false);
            }else if(ostatus === 3){
                that.getView().byId("detailPageId").setShowFooter(false);
                that.getView().byId("edtBTn").setVisible(false);
                that.getView().byId("id_sapDoucment").setVisible(true);
                that.getView().byId("sapDO_NO").setVisible(true);
            }else if(ostatus === 4){
                that.getView().byId("detailPageId").setShowFooter(false);
                that.getView().byId("edtBTn").setVisible(false);
                that.getView().byId("id_sapDoucment").setVisible(false);
                that.getView().byId("sapDO_NO").setVisible(false);
            }else if(ostatus === 5){
                that.getView().byId("detailPageId").setShowFooter(true);
                that.getView().byId("edtBTn").setVisible(true);
                that.getView().byId("id_sapDoucment").setVisible(false);
                that.getView().byId("sapDO_NO").setVisible(false);
            }else if(ostatus === 7){
                that.getView().byId("detailPageId").setShowFooter(false);
                that.getView().byId("edtBTn").setVisible(false);
                that.getView().byId("id_sapDoucment").setVisible(false);
                that.getView().byId("sapDO_NO").setVisible(false);
            }

            },
  

            editValues : function(oEvent){
                //debugger
               var clickedit= this.getView().byId("edtBTn").mProperties.visible
               that.getView().byId("detailPageId").setShowFooter(true);
               that.getView().byId("save").setVisible(true)

            var enableG25 = this.getView().byId("fullpaymet").getItems()[0].getCells()[0];
            enableG25.setEditable(true);
                
            var enableG = this.getView().byId("fullpaymet").getItems()[0].getCells()[2];
            enableG.setEditable(true);

            var enableG1 = this.getView().byId("particalPay").getItems()[0].getCells()[0];
            enableG1.setEditable(true);

            var enableG2 = this.getView().byId("particalPay").getItems()[0].getCells()[2];
            enableG2.setEditable(true);

            var enableG3 = this.getView().byId("particalPay").getItems()[0].getCells()[3];
            enableG3.setEditable(true);

            var enableG4 = this.getView().byId("particalPay").getItems()[0].getCells()[4];
            enableG4.setEditable(true);


            var enableG5 = this.getView().byId("pdc").getItems()[0].getCells()[0];
            enableG5.setEditable(true);

            var enableG6 = this.getView().byId("pdc").getItems()[0].getCells()[2];
            enableG6.setEditable(true);

            var enableG7 = this.getView().byId("exdays").getItems()[0].getCells()[0];
            enableG7.setEditable(true);

            },

            utrInput : function(oEvent){
                //debugger
                 fullutrupdted=oEvent.mParameters.newValue
                 fullutrlastupdated=oEvent.oSource._lastValue

            }, 
            pp_utr : function(oEvent){
                pputrupdate=oEvent.mParameters.newValue
                pputrlastupdate=oEvent.oSource._lastValue
            },
            pdc_utr : function(oEvent){
                pdcutrupdate=oEvent.mParameters.newValue
                pdcutrlastupdate=oEvent.oSource._lastValue

            },
            exciedDays : function(oEvent){
                excidayupdted=oEvent.mParameters.newValue
                excidedayslastupdate=oEvent.oSource._lastValue
            },
            fullpayhandleChange : function(oEvent){
                //debugger

                fullpayu_Date= oEvent.mParameters.newValue
            },
            Saveeditable : function(oEvent){
                debugger
                BusyIndicator.show()
                var alldata=that.getOwnerComponent().getModel("popread").getData().value[0]
              

                var fp_utr= this.getView().byId("fullpaymet").getItems()[0].getCells()[0].mProperties.value
                var fpay_date=this.getView().byId("fullpaymet").getItems()[0].getCells()[2].mProperties.value
                if(fpay_date !==""){
                var oDate1 = new Date(this.getView().getModel("popread").getData().value[0].OFFLINE_FP_DATE);
                var sDatef= oDate1.toISOString().split('T')[0]
                }

               var pp_utr= this.getView().byId("particalPay").getItems()[0].getCells()[0].mProperties.value
               var ppay_date=this.getView().byId("particalPay").getItems()[0].getCells()[2].mProperties.value
                if(ppay_date !== ""){
                        var oDate = new Date(this.getView().getModel("popread").getData().value[0].OFFLINE_PP_DATE);
                        // new Date(ppay_date);
                        var sDatepp= oDate.toISOString().split('T')[0]
                    }
                    
               var pp_crenotedamt=this.getView().byId("particalPay").getItems()[0].getCells()[3].mProperties.value
               var simpleAmount = pp_crenotedamt.split('.')[0].replace(/,/g, '');
                var pp_credamt = parseInt(simpleAmount, 10);
                
               var pp_crednote=this.getView().byId("particalPay").getItems()[0].getCells()[4].mProperties.value


              var pdc_utr=this.getView().byId("pdc").getItems()[0].getCells()[0].mProperties.value
                var paydc_Date=this.getView().byId("pdc").getItems()[0].getCells()[2].mProperties.value
                if(paydc_Date !== ""){
                var oDate2 = new Date(this.getView().getModel("popread").getData().value[0].PDC_DATE);
                var sDatepdc= oDate2.toISOString().split('T')[0]
                }

                var exdy=this.getView().byId("exdays").getItems()[0].getCells()[0].mProperties.value


                // alldata.OFFLINE_FP_DATE

            
                //     if(fullutrupdted === fullutrlastupdated ){
                //         BusyIndicator.hide()
                //         MessageBox.error("Please Edit some data")
                //            }  else if(fullutrupdted !== fullutrlastupdated ){
                //            payment = {
                //                "SAP_ORDER_NO": "0",
                //                "POP_NO": alldata.POP_NO,
                //                "DISTRIBUTOR_ID": alldata.DISTRIBUTOR_ID,
                //                "DISTRIBUTOR_NAME": alldata.DISTRIBUTOR_NAME,
                //                "PR_SAP_NO": alldata.PR_SAP_NO.toString(),
                //                "CREATION_DATE": null,
                //                "PAYMENT_TYPE":alldata.PAYMENT_TYPE,
                //                "OFFLINE_FP_UTR": fp_utr || null,
                //                "OFFLINE_FP_DATE": fpay_date || null,
                //                "OFFLINE_FP_AMOUNT": parseInt(alldata.OFFLINE_FP_AMOUNT) || null,
                //                "OFFLINE_PP_UTR": pp_utr || null,
                //                "OFFLINE_PP_DATE": ppay_date || null,
                //                "OFFLINE_PP_UTR_AMT": alldata.OFFLINE_PP_UTR_AMT || null,
                //                "OFFLINE_PP_CREDIT_NOTE_NO": pp_crednote.toString()|| null,
                //                "OFFLINE_PP_CREDIT_NOTE_AMT": Number(pp_credamt) || null,
                //                "PDC_NO": pdc_utr || null,
                //                "PDC_DATE": paydc_Date || null,
                //                "PDC_AMT": alldata.PDC_AMT || null,
                //                "EXCRDT_DAYS": Number(exdy)|| null,
                //                "DIST_COMMENTS": alldata.DIST_COMMENTS,
                //                "PAY_NOW_UTR": null,
                //                "PAY_NOW_TRASAC_NO": null,   
                //                "PAY_NOW_DATE": null,
                //                "PAY_NOW_AMT": null,
                //                "DOC_POST": null,
                //                "ATTACH": null,
                //                "STATUS": alldata.STATUS,
                //                "AR_AMOUNT_ENTERED": null,
                //                "LAST_UPDATED_DATE":alldata.LAST_UPDATED_DATE,
                //                "APPROVER_LEVEL": alldata.APPROVER_LEVEL,
                //                "APPROVER_ROLE": alldata.APPROVER_ROLE
                //            }
                //            this.saveorder()
                //   } 
                //   else if( pputrupdate === pputrlastupdate){
                //     BusyIndicator.hide()
                //     MessageBox.error("Please Edit some data")
                //   } else if (pputrupdate !== pputrlastupdate){
                //       payment = {
                //         "SAP_ORDER_NO": "0",
                //         "POP_NO": alldata.POP_NO,
                //         "DISTRIBUTOR_ID": alldata.DISTRIBUTOR_ID,
                //         "DISTRIBUTOR_NAME": alldata.DISTRIBUTOR_NAME,
                //         "PR_SAP_NO": alldata.PR_SAP_NO.toString(),
                //         "CREATION_DATE": null,
                //         "PAYMENT_TYPE":alldata.PAYMENT_TYPE,
                //         "OFFLINE_FP_UTR": fp_utr || null,
                //         "OFFLINE_FP_DATE": fpay_date || null,
                //         "OFFLINE_FP_AMOUNT": parseInt(alldata.OFFLINE_FP_AMOUNT) || null,
                //         "OFFLINE_PP_UTR": pp_utr || null,
                //         "OFFLINE_PP_DATE": ppay_date || null,
                //         "OFFLINE_PP_UTR_AMT": alldata.OFFLINE_PP_UTR_AMT || null,
                //         "OFFLINE_PP_CREDIT_NOTE_NO": pp_crednote.toString()|| null,
                //         "OFFLINE_PP_CREDIT_NOTE_AMT": Number(pp_credamt) || null,
                //         "PDC_NO": pdc_utr || null,
                //         "PDC_DATE": paydc_Date || null,
                //         "PDC_AMT": alldata.PDC_AMT || null,
                //         "EXCRDT_DAYS": Number(exdy)|| null,
                //         "DIST_COMMENTS": alldata.DIST_COMMENTS,
                //         "PAY_NOW_UTR": null,
                //         "PAY_NOW_TRASAC_NO": null,   
                //         "PAY_NOW_DATE": null,
                //         "PAY_NOW_AMT": null,
                //         "DOC_POST": null,
                //         "ATTACH": null,
                //         "STATUS": alldata.STATUS,
                //         "AR_AMOUNT_ENTERED": null,
                //         "LAST_UPDATED_DATE":alldata.LAST_UPDATED_DATE,
                //         "APPROVER_LEVEL": alldata.APPROVER_LEVEL,
                //         "APPROVER_ROLE": alldata.APPROVER_ROLE
                //     }
                //     this.saveorder()
                //   } else if (pdcutrupdate === pdcutrlastupdate){
                //     BusyIndicator.hide()
                //     MessageBox.error("Please Edit some data")

                //   }else if(pdcutrupdate !== pdcutrlastupdate){
                //       payment = {
                //         "SAP_ORDER_NO": "0",
                //         "POP_NO": alldata.POP_NO,
                //         "DISTRIBUTOR_ID": alldata.DISTRIBUTOR_ID,
                //         "DISTRIBUTOR_NAME": alldata.DISTRIBUTOR_NAME,
                //         "PR_SAP_NO": alldata.PR_SAP_NO.toString(),
                //         "CREATION_DATE": null,
                //         "PAYMENT_TYPE":alldata.PAYMENT_TYPE,
                //         "OFFLINE_FP_UTR": fp_utr || null,
                //         "OFFLINE_FP_DATE": ppay_date || null,
                //         "OFFLINE_FP_AMOUNT": parseInt(alldata.OFFLINE_FP_AMOUNT) || null,
                //         "OFFLINE_PP_UTR": pp_utr || null,
                //         "OFFLINE_PP_DATE": pp_date || null,
                //         "OFFLINE_PP_UTR_AMT": alldata.OFFLINE_PP_UTR_AMT || null,
                //         "OFFLINE_PP_CREDIT_NOTE_NO": pp_crednote.toString()|| null,
                //         "OFFLINE_PP_CREDIT_NOTE_AMT": Number(pp_credamt) || null,
                //         "PDC_NO": pdc_utr || null,
                //         "PDC_DATE": paydc_Date || null,
                //         "PDC_AMT": alldata.PDC_AMT || null,
                //         "EXCRDT_DAYS": Number(exdy)|| null,
                //         "DIST_COMMENTS": alldata.DIST_COMMENTS,
                //         "PAY_NOW_UTR": null,
                //         "PAY_NOW_TRASAC_NO": null,   
                //         "PAY_NOW_DATE": null,
                //         "PAY_NOW_AMT": null,
                //         "DOC_POST": null,
                //         "ATTACH": null,
                //         "STATUS": alldata.STATUS,
                //         "AR_AMOUNT_ENTERED": null,
                //         "LAST_UPDATED_DATE":alldata.LAST_UPDATED_DATE,
                //         "APPROVER_LEVEL": alldata.APPROVER_LEVEL,
                //         "APPROVER_ROLE": alldata.APPROVER_ROLE
                //     }
                //     this.saveorder()
                //   }else if(excidayupdted === excidedayslastupdate){
                //     BusyIndicator.hide()
                //     MessageBox.error("Please Edit some data")
                //   } else if(excidayupdted !== excidedayslastupdate){
                //       payment = {
                //         "SAP_ORDER_NO": "0",
                //         "POP_NO": alldata.POP_NO,
                //         "DISTRIBUTOR_ID": alldata.DISTRIBUTOR_ID,
                //         "DISTRIBUTOR_NAME": alldata.DISTRIBUTOR_NAME,
                //         "PR_SAP_NO": alldata.PR_SAP_NO.toString(),
                //         "CREATION_DATE": null,
                //         "PAYMENT_TYPE":alldata.PAYMENT_TYPE,
                //         "OFFLINE_FP_UTR": fp_utr || null,
                //         "OFFLINE_FP_DATE": fpay_date || null,
                //         "OFFLINE_FP_AMOUNT": parseInt(alldata.OFFLINE_FP_AMOUNT) || null,
                //         "OFFLINE_PP_UTR": pp_utr || null,
                //         "OFFLINE_PP_DATE": ppay_date || null,
                //         "OFFLINE_PP_UTR_AMT": alldata.OFFLINE_PP_UTR_AMT || null,
                //         "OFFLINE_PP_CREDIT_NOTE_NO": pp_crednote.toString()|| null,
                //         "OFFLINE_PP_CREDIT_NOTE_AMT": Number(pp_credamt) || null,
                //         "PDC_NO": pdc_utr || null,
                //         "PDC_DATE": paydc_Date || null,
                //         "PDC_AMT": alldata.PDC_AMT || null,
                //         "EXCRDT_DAYS": Number(exdy)|| null,
                //         "DIST_COMMENTS": alldata.DIST_COMMENTS,
                //         "PAY_NOW_UTR": null,
                //         "PAY_NOW_TRASAC_NO": null,   
                //         "PAY_NOW_DATE": null,
                //         "PAY_NOW_AMT": null,
                //         "DOC_POST": null,
                //         "ATTACH": null,
                //         "STATUS": alldata.STATUS,
                //         "AR_AMOUNT_ENTERED": null,
                //         "LAST_UPDATED_DATE":alldata.LAST_UPDATED_DATE,
                //         "APPROVER_LEVEL": alldata.APPROVER_LEVEL,
                //         "APPROVER_ROLE": alldata.APPROVER_ROLE
                //     }
                //     this.saveorder()
                //   } 


                      payment = {
                        "SAP_ORDER_NO": "0",
                        "POP_NO": alldata.POP_NO,
                        "DISTRIBUTOR_ID": alldata.DISTRIBUTOR_ID,
                        "DISTRIBUTOR_NAME": alldata.DISTRIBUTOR_NAME,
                        "PR_SAP_NO": alldata.PR_SAP_NO.toString(),
                        "CREATION_DATE": null,
                        "PAYMENT_TYPE":alldata.PAYMENT_TYPE,
                        "OFFLINE_FP_UTR": fp_utr || null,
                        "OFFLINE_FP_DATE": sDatef || null,
                        "OFFLINE_FP_AMOUNT": parseInt(alldata.OFFLINE_FP_AMOUNT) || null,
                        "OFFLINE_PP_UTR": pp_utr || null,
                        "OFFLINE_PP_DATE": sDatepp || null,
                        "OFFLINE_PP_UTR_AMT": alldata.OFFLINE_PP_UTR_AMT || null,
                        "OFFLINE_PP_CREDIT_NOTE_NO": pp_crednote.toString()|| null,
                        "OFFLINE_PP_CREDIT_NOTE_AMT": parseInt(pp_credamt) || null,
                        "PDC_NO": pdc_utr || null,
                        "PDC_DATE": sDatepdc || null,
                        "PDC_AMT": alldata.PDC_AMT || null,
                        "EXCRDT_DAYS": Number(exdy)|| null,
                        "DIST_COMMENTS": alldata.DIST_COMMENTS,
                        "PAY_NOW_UTR": null,
                        "PAY_NOW_TRASAC_NO": null,   
                        "PAY_NOW_DATE": null,
                        "PAY_NOW_AMT": null,
                        "DOC_POST": null,
                        "ATTACH": null,
                        "STATUS": alldata.STATUS,
                        "AR_AMOUNT_ENTERED": null,
                        "LAST_UPDATED_DATE":alldata.LAST_UPDATED_DATE,
                        "APPROVER_LEVEL": alldata.APPROVER_LEVEL,
                        "APPROVER_ROLE": alldata.APPROVER_ROLE
                    }
                    this.saveorder()
            },

saveorder : function(){
    debugger
    BusyIndicator.show()
    var alldata=that.getOwnerComponent().getModel("popread").getData().value[0]
    var userdetails =  this.getOwnerComponent().getModel("userModel").getData();
      var userrole=this.getView().getModel("userrole").getData()
    var surl = appModulePath + "/odata/v4/ideal-payments-creation-srv/createPayment";
    var oPayload = {
        "action": "UPDATE",
        "appType": "PAY",
        "paymentsHeader": [payment],
        "paymentsAttachments": [{
            "POP_NO": alldata.POP_NO,
            "ATTACH_CODE": null,
            "FILE_ID": 1,
            "FILE_CONTENT":null, 
            "FILE_MIMETYPE":null, 
            "FILE_TYPE":null,
            "FILE_NAME":null,
            "CREATION_DATE": null
        }],
        "paymentsEventLog": [{
            "POP_NO": alldata.POP_NO,
            "EVENT_NO": 1,
            "EVENT_CODE": 1,
            "USER_ID": userdetails.userId,
            "USER_ROLE": userrole.USER_ROLE,
            "USER_NAME": userdetails.userName,
            "COMMENTS": "Payment Updated",
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
            BusyIndicator.hide();
            MessageBox.success(result.value.OUT_SUCCESS, {
                actions: [MessageBox.Action.OK],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (oAction) {
                    if (oAction === 'OK') {
                        //debugger
                            that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                            var router = sap.ui.core.UIComponent.getRouterFor(that);
                            router.navTo("RouteMasterPage", {
                                "loginId": id
                            });
                     
                    }
                }
            }
        );
        },

        error: function (oError) {
            //debugger;
            BusyIndicator.hide()
            MessageBox.error(oError.responseText);

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
                that.CloseEvent()
                that.f_visible()
            },
            
        });
    });