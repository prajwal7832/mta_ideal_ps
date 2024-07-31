// sap.ui.define([
//     "sap/ui/core/mvc/Controller"

// ],
// function (Controller) {
//     "use strict";
   
//     return Controller.extend("com.ibs.ibsappidealproductcomplaint.controller.DetailPage", {
//         onInit: function () {
           
//         },
  

//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealproductcomplaint/model/formatter",
    "com/ibs/ibsappidealproductcomplaint/model/down",
    "sap/ui/core/BusyIndicator"
    
],
function (Controller,JSONModel,MessageBox,formatter,down,BusyIndicator) {
    "use strict";
    var that,prno;
    var oDataModel;
  
    var File_id,Form_id;
    var selectedFileName;
    var appId,appPath,appModulePath;
    return Controller.extend("com.ibs.ibsappidealproductcomplaint.controller.DetailPage", {
        formatter: formatter,
        onInit: function () {
            
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
            var id= "PPR Request No.:" + " " + prno 
            this.getView().byId("reqno").setText(id)
            this.readData();
            this.fileData();
            this._readTimelineData();
            
        },
        readData : function(){
            //debugger
            var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprHeader?$filter=PPR_NO eq " + prno + "&$expand=TO_STATUS";

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
                    // BusyIndicator.hide();
                    MessageBox.error("error");
                }
            });
        },
   
        _readTimelineData : function(){
            var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprEvent?$filter=PPR_NO eq " + prno + "";

            
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
        Content : function(){
            ////debugger
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
            //debugger
            var url = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprAttachment?$filter=PPR_NO eq " + prno + "";

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
                        Form_id=  data.value[i].FORM_ID 
                        }

               

                },
                error: function (e) {
                    ////debugger
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
                        //debugger
                        that.fileType(data);
                        // context.downloadFileContent('text/plain', 1,'CLAIM REQUEST PAYLOAD.txt', 'text/plain', data);
                        
                    },
                    error: function (error) {
                        //debugger
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

            var path = appModulePath + "/odata/v4/ideal-product-complaint-srv/PprAttachment?$filter=PPR_NO eq " + prno + "";
            var FILE_CONTENT = data;
            $.ajax({
                url: path,
                type: 'GET',
                contentType: 'application/json',
                success: function (data, responce) {
                    //debugger;
                    for (let i = 0; i < data.value.length; i++) {
                        if(selectedFileName === data.value[i].FILE_NAME){
                      that.downloadFileContent(data.value[i].FILE_TYPE || null, data.value[i].SR_NO || null, data.value[i].FILE_NAME, data.value[i].FILE_MIMETYPE, FILE_CONTENT);

                        }
                        
                    }


                 
                },
                error: function (error) {
                    ////debugger;
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

        CloseEvent: function (oEvent) {
            this._oDSC.setShowSideContent(false);
    
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
