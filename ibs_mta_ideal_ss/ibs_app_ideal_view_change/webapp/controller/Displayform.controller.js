sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealviewchange/model/formatter",
	"../model/down",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,BusyIndicator,JSONModel,MessageBox,formatter,down) {
        "use strict";
        var retailerId,appModulePath,context,that,oView,retailerModel;

        return Controller.extend("com.ibs.ibsappidealviewchange.controller.Displayform", {
            formatter:formatter,
            onInit: function () {
                that = this;
                context = this;
                oView = context.getView();
                retailerModel = new JSONModel();

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteDisplayform").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched:function(oEvent){
                BusyIndicator.hide();
                
                retailerId = oEvent.getParameter("arguments").RETAILER_ID;

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                this.readData(retailerId);
                this.readAddressType();
            },
            onBack:function(){
                if(retailerModel !== undefined){
                    retailerModel.setData(null);
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMasterpage");
            },
            readData:function(retailerId){
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerDetails?$filter=(RETAILER_ID eq '"+ retailerId+"')&$expand=TO_ADDRESS($expand=TO_COUNTRY,TO_REGION,TO_CITY,TO_ADDRESS_TYPE),TO_RETAILER_TYPE";
                var data = { $expand: 'TO_REGION,TO_COUNTRY,TO_RETAILER_TYPE,TO_CITY' };
                this.postAjaxs(url,"GET","null","retailerData");
            },
            readAddressType:function(){
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/AddressTypeMaster";
                this.postAjaxs(url,"GET","null","addreessTypeModel");
            },
            readAttchments:function(retailerId,distributorId){
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerAttachments?$filter=RETAILER_ID eq '"+ retailerId + "' and DISTRIBUTOR_ID eq '"+distributorId+"'";
                this.postAjaxs(url,"GET","null","retailerAttchmentsModel");
            },            
            postAjaxs: function (url, type, data, model) {
            
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    data: data,
                    success: function (data, response) {
                        BusyIndicator.hide();
                        if(model === "retailerAttchmentsModel" || model === "addreessTypeModel"){
                            var oModel = new JSONModel(data.value);
                            that.getView().setModel(oModel,model);
                        }
                        else if(model === "retailerData"){
                            retailerModel = new JSONModel(data.value[0]);
                            that.getView().setModel(retailerModel,model);
                            that.readAttchments(data.value[0].RETAILER_ID,data.value[0].DISTRIBUTOR_ID);
                            oView.byId("trAddId").setVisibleRowCount(data.value[0].TO_ADDRESS.length);
                        }
                        else if(model === "retailerAttachmentContent"){
                            var attachmentData = that.getView().getModel("retailerAttchmentsModel").getData()[0];
                            context.downloadFileContent(attachmentData.FILE_TYPE,attachmentData.FILE_ID, attachmentData.FILE_NAME, attachmentData.FILE_MIMETYPE, data);
                        }
                        else{
                            retailerModel = new JSONModel(data.value[0]);
                            that.getView().setModel(retailerModel,model);
                        }
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
            onDownload:function(oEvent){
                var attachmentData = oEvent.getSource().getBindingContext("retailerAttchmentsModel").getObject()
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerAttachments(DISTRIBUTOR_ID='"+attachmentData.DISTRIBUTOR_ID+"',RETAILER_ID='"+attachmentData.RETAILER_ID+"',FILE_ID="+attachmentData.FILE_ID+")/$value";
                this.postAjaxs(url,"GET","null","retailerAttachmentContent");
                // var oDownloadData = oEvent.getSource().getBindingContext("retailerAttchmentsModel").getObject();
            },
            downloadFileContent: function (iREQUEST_NO, iSR_NO, sFILE_NAME, sFILE_MIMETYPE, sFILE_CONTENT) {

                var aFilter = [],
                    fileContent = null;
                // sFILE_CONTENT = atob(sFILE_CONTENT);
                sFILE_CONTENT = sFILE_CONTENT;
                context.downloadAttachment(sFILE_CONTENT, sFILE_NAME, sFILE_MIMETYPE);
    
            },
            downloadAttachment: function (content, fileName, mimeType) {
                download("data:application/octet-stream;base64," + content, fileName, mimeType);
                var HttpRequest = new XMLHttpRequest();
                // x.open("GET", "http://danml.com/wave2.gif", true);
                HttpRequest.responseType = 'blob';
                HttpRequest.onload = function (e) {
                    download(HttpRequest.response, fileName, mimeType);
                }
                HttpRequest.send();
    
            },
            isValidJsonString: function (sDataString) {
                var value = null;
                var oArrObj = null;
                var sErrorMessage = "";
                try {
                    if (sDataString === null || sDataString === "" || sDataString === undefined) {
                        throw "No data found.";
                    }
    
                    value = JSON.parse(sDataString);
                    if (toString.call(value) === '[object Object]' && Object.keys(value).length > 0) {
                        return true;
                    } else {
                        throw "Error";
                    }
                } catch (errorMsg) {
                    if (errorMsg === "No data found.") {
                        sErrorMessage = errorMsg;
                    } else {
                        sErrorMessage = "Invalid JSON data."
                    }
                    return false;
                }
                return true;
            }
        });
    });
