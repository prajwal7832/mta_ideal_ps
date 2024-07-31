sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealproductcomplaint/model/down",
    "sap/ui/core/BusyIndicator"


],
    function (Controller, JSONModel,MessageToast,MessageBox,down,BusyIndicator) {
        "use strict";
        var that,previousData,attachdata,claimAttachMapJson,appModulePath,PRGroup,PR_Code, id,describtion;
        var prodescription;
       var  context;
        return Controller.extend("com.ibs.ibsappidealproductcomplaint.controller.ComplaintPage", {
            onInit: function () {
                debugger
              
                that = this;
                var nav = sap.ui.core.UIComponent.getRouterFor(this);
                nav.getRoute("ComplaintPage").attachPatternMatched(this._onRouteMatched, this);

                var getData = this.getOwnerComponent().getModel("Data").getData()
                var data = new JSONModel(getData)
                this.getOwnerComponent().setModel(data, "proddata")

               
                
            },
            _onRouteMatched: function (oEvent) {
                BusyIndicator.hide();
                that.selected = null;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);

                var g = this.getView().getParent().getParent();
                g.toBeginColumnPage(this.getView());
                id = oEvent.getParameter('arguments').loginId;
                this.readAttachData()
                this.userrole()
             
            },
           

            handleValueGroupHelpProGrop: function () {
                debugger
                if (!this.grpFragment) {
                    this.grpFragment = sap.ui.xmlfragment("com.ibs.ibsappidealproductcomplaint.view.fragments.progrpFragment", this);
                    this.getView().addDependent(this.grpFragment);
                    //this._delvrTemp = sap.ui.getCore().byId("delvrTempId").clone();
                }
                this.grpFragment.open();
            },
            ProCodehandleValueGroupHelp: function () {
                debugger
                if (!this.grpFragment) {
                    this.grpFragment = sap.ui.xmlfragment("com.ibs.ibsappidealproductcomplaint.view.fragments.proCodeFragment", this);
                    this.getView().addDependent(this.grpFragment);
                    //this._delvrTemp = sap.ui.getCore().byId("delvrTempId").clone();
                }
                this.grpFragment.open();
            },
            closeprocode : function(){
                this.grpFragment.close();
                this.grpFragment.destroy();
                this.grpFragment = null;
                
            },

            closeContactCountryDialog: function () {
                ////debugger
                this.grpFragment.close();
                this.grpFragment.destroy();
                this.grpFragment = null;
            },

            onclick : function(oEvent){
                debugger
                that.selected=oEvent.getSource();
                var onclickData=that.selected.getSelected() 
                

                if (!PRGroup){
                    MessageBox.error("Please add product group");
                    that.selected.setSelected(false);
                }else if(!PR_Code){
                    MessageBox.error("Please add product code");
                    that.selected.setSelected(false);
                }
                // else if(that.selected.getSelected() === true){
                //  this.getView().byId("submitBTN").setEnabled(true)
                // }else if(that.selected.getSelected() === false){
                //     this.getView().byId("submitBTN").setEnabled(false) 
                // }



            },
            SelectProGroup : function(oEvent){
                debugger
                var po_order_data = oEvent.getSource().getSelectedItem().getBindingContext("proddata").getObject()
               var model = new JSONModel(po_order_data);
                that.getOwnerComponent().setModel(model, "Select_po");
                var po_detail = this.getView().getModel("Select_po").getData()
                PRGroup = po_detail.ProGroup;
               this.getView().byId("id_Grp").setValue(PRGroup)
                 
               var tabelfile= this.getView().getModel("claimAttachMapJson").getData()[0].FILE_NAME;
                if(PRGroup && tabelfile){
                   this.getView().byId("submitBTN").setEnabled(true) 
               }

                this.closeContactCountryDialog()
            },
            SProCode: function(oEvent){
                debugger
                var podata = oEvent.getSource().getSelectedItem().getBindingContext("proddata").getObject()
                var model1 = new JSONModel(podata);
                 that.getOwnerComponent().setModel(model1, "Select_poCode");
                 var po_detail = this.getView().getModel("Select_poCode").getData()
                PR_Code = po_detail.ProCode;
                this.getView().byId("id_Procode").setValue(PR_Code)

                var tabelfile= this.getView().getModel("claimAttachMapJson").getData()[0].FILE_NAME;
                if(PR_Code && tabelfile){
                    this.getView().byId("submitBTN").setEnabled(true) 
                }
                this.closeprocode()

            },  
            navigateToView1: function () {
                debugger;
                if(that.selected === null){
                    // nothing
                }
                else{
                    that.selected.setSelected(false);
                }
                var g = this.getView().getParent().getParent();
                g.toBeginColumnPage(this.getView())
               
                prodescription = null
                  PRGroup = null
                  PR_Code= null
              

                if(claimAttachMapJson !== undefined){
                    claimAttachMapJson.setData(null)
                }
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMasterPage",{
                    "loginId":id
                });
                that.getView().byId("downloadid").setEnabled(false)
                that.getView().byId("deletBTN").setEnabled(false)
                this.getView().byId("id_Grp").setValue("")
                this.getView().byId("id_Desc").setValue("")
                this.getView().byId("id_Procode").setValue("")
                // this.getView().byId("submitBTN").selected(false)
                this.getView().byId("submitBTN").setEnabled(false) 
            },
            readAttachData : function(unit){
                debugger
                // if(unit != ""){
                    attachdata = [{
                        "ATTACH_CODE": 1,
                        "ATTACH_NO": 1,
                       
                    }]
                // }

                claimAttachMapJson = new JSONModel();
                claimAttachMapJson.setData(attachdata);
                this.getView().setModel(claimAttachMapJson, "claimAttachMapJson");
            },
            handleUpload : function(oEvent){
                debugger;
                var sbfileDetails = oEvent.getParameters("file").files;
                var filesize = sbfileDetails[0].size;
                var fileSizeInBytes = filesize;
                // Convert the bytes to Kilobytes (1 KB = 1024 Bytes)
                var fileSizeInKB = fileSizeInBytes / 1024;
                // Convert the KB to MegaBytes (1 MB = 1024 KBytes)
                var fileSizeInMB = fileSizeInKB / 1024;
    
                var fName = sbfileDetails[0].name;
    
                if (fileSizeInMB > 5) {
                    MessageBox.warning("File size should be less than or equal to 5MB", {
                        icon: MessageBox.Icon.WARNING,
                        title: "WARNING",
                        actions: sap.m.MessageBox.Action.OK,
                        emphasizedAction: sap.m.MessageBox.Action.OK
                    });
                } else if (fName.includes(".pdf") || fName.includes(".xlsx") || fName.includes(".docm") ||
                    fName.includes(".docx") || fName.includes(".jpg") || fName.includes(".txt")) {
                    // this.model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;
                    this.sourceData = oEvent.getSource();
    
                    // if (this.model === "G7Json" || this.model === "G6Json" || this.model === "G10Json" || this.model === "G22Json" ||
                    // 	this.model === "G23Json") {
                        // this.sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
                    // }
                    // else {
                        this.sbIndex = parseInt(oEvent.getSource().getBindingContext("claimAttachMapJson").getPath().split("/")[1]);
                    // }
    
                    this.sbfileUploadArr = [];
                    if (sbfileDetails.lenghth != 0) {
                        for (var i in sbfileDetails) {
                            var mimeDet = sbfileDetails[i].type,
                                fileName = sbfileDetails[i].name,
                                fileType = sbfileDetails[i].type;
                            this.sbfileName = fileName;
                            // Calling method....
                            this.sbBase64conversionMethod(mimeDet, fileName, sbfileDetails[i], fileType);
                        }
                    } else {
                        this.sbfileUploadArr = [];
                    }
                }
                else {
                    MessageBox.warning("Please select correct File Type");
                }
                },
                sbBase64conversionMethod: function (fileMime, fileName, fileDetails, fileType) {
                    // var context = this;
                    var that = this;
                    if (!FileReader.prototype.readAsBinaryString) {
                        FileReader.prototype.readAsBinaryString = function (fileData) {
                            var binary = "";
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var bytes = e.reader.result;
                                var length = bytes.byteLength;
                                for (var i = 0; i < length; i++) {
                                    binary += String.fromCharCode(bytes[i]);
                                }
                                that.sbbase64ConversionRes = btoa(binary);
                                that.sbfileUploadArr.push({
                                    "MimeType": fileMime,
                                    "FileName": fileName,
                                    "Content": that.sbbase64ConversionRes,
                                    "Type": fileType
                                });
                            };
    
                            reader.readAsArrayBuffer(fileData);
    
                        };
                    }
                    var reader = new FileReader();
                    reader.onload = function (readerEvt) {
                        var binaryString = readerEvt.target.result;
                        that.sbbase64ConversionRes = btoa(binaryString);
                        that.sbfileUploadArr = [];
                        that.sbfileUploadArr.push({
                            "MimeType": fileMime,
                            "FileName": fileName,
                            "Content": that.sbbase64ConversionRes,
                            "Type": fileType
                        });
                        that._sbgetUploadedFiles();
                    };
                    reader.readAsBinaryString(fileDetails);
                },
                _sbgetUploadedFiles: function () {
                    debugger
                    var that = this;
                    if (this.sbfileUploadArr.length != 0) {
                        for (var fdata in this.sbfileUploadArr) {
                            this.sbAttachmentArr = {
                                "FILE_NAME": this.sbfileUploadArr[fdata].FileName,
                                "FILE_MIMETYPE": this.sbfileUploadArr[fdata].MimeType,
                                "FILE_CONTENT": this.sbfileUploadArr[fdata].Content,
                                "FILE_TYPE": this.sbfileUploadArr[fdata].Type
                            };
                        }
                    }
       
                    if (!PRGroup){
                        MessageBox.error("Please add product group");
                        // that.selected.setSelected(false);
                    }else if(!PR_Code){
                        MessageBox.error("Please add product code");
                        // that.selected.setSelected(false);
                    }else if(PRGroup && PR_Code ){


                    this.sbfileUploadArr = [];
                    MessageBox.success("Your file has been uploaded successfully", {
                        actions: [MessageBox.Action.OK],
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                debugger
                                that.getView().byId("downloadid").setEnabled(true)
                                that.getView().byId("deletBTN").setEnabled(true)

                                prodescription=that.getView().byId("id_OrdDate").getValue();
                                
                                if(PRGroup && PR_Code && prodescription){
                                    that.getView().byId("submitBTN").setEnabled(true)
                                }
                                attachdata[that.sbIndex].FILE_CONTENT = that.sbAttachmentArr.FILE_CONTENT;
                                attachdata[that.sbIndex].FILE_MIMETYPE = that.sbAttachmentArr.FILE_MIMETYPE;
                                attachdata[that.sbIndex].FILE_NAME = that.sbAttachmentArr.FILE_NAME;
                                attachdata[that.sbIndex].FILE_TYPE = that.sbAttachmentArr.FILE_TYPE;
    
                                that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[1].setEnabled(false);
                                that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[3].setEnabled(true);
                                that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[4].setEnabled(true);
    
                                // var attachJson = new JSONModel();
                                // attachJson.setData(that.attachmentData);
                                // that.getView().setModel(attachJson, "attachJson");
    
                                // that.getView().byId("attachDisId").getRows()[parseInt(that.sbIndex)].getCells()[3].setEnabled(true);
                                // that.getView().byId("attachDisId").getRows()[parseInt(that.sbIndex)].getCells()[1].setEnabled(false);
    
                                // that.sbAttachmentArr = {};
                                that.getView().getModel("claimAttachMapJson").refresh(true);
                            }
    
                        }
                    })
                }
                },
                downloadFileContent: function (oEvent) {
                    debugger
                    this.sbIndex = parseInt(oEvent.getSource().getBindingContext("claimAttachMapJson").getPath().split("/")[1]);
                    var aFilter = [],
                    fileContent = null;
    
                    var data = this.getView().getModel("claimAttachMapJson").getData()[this.sbIndex];
    
                    // if(data.FILE_MIMETYPE === "text/plain")
                    // {
                    // 	var sFILE_CONTENT = atob(data.FILE_CONTENT);
                    // }
                    // sFILE_CONTENT = atob(data.FILE_CONTENT);
                    // sFILE_CONTENT = sFILE_CONTENT;
                    this.downloadAttachment(data.FILE_CONTENT, data.FILE_NAME, data.FILE_MIMETYPE);
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
                onDelete : function(oEvent){
                    debugger;
                    this.sbIndex = parseInt(oEvent.getSource().getBindingContext("claimAttachMapJson").getPath().split("/")[1]);
                    var oArray = this.getView().getModel("claimAttachMapJson").oData;
                    MessageBox.information("Are you sure you want to delete the file ?",{
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (Action) {
                            if(Action === "YES"){
                                // oArray.splice(this.sbIndex, 1);
                                var oModel = that.getView().getModel("claimAttachMapJson").getData()[that.sbIndex];
                                that.getView().byId("submitBTN").setEnabled(false)
                                oModel.FILE_CONTENT = null;
                                oModel.FILE_NAME = "";
                                oModel.FILE_MIMETYPE = null;
                                oModel.FILE_TYPE = "";
                                // oModel.ATTACH_VALUE = null;
                                // oModel.EXPIRY_DATE = null;
                                var enabledownload=that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[3];
                                enabledownload.setEnabled(false);
    
                                var enableDelete=that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[4];
                                enableDelete.setEnabled(false);
    
                                var enableUpload=that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[1];
                                enableUpload.setEnabled(true);
                                // that.getView().getModel("claimAttachMapJson").setData("");
                                that.getView().getModel("claimAttachMapJson").refresh(true);
                            }
                    }
                });
             },
             userrole: function () {
                debugger
                
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
             
             openSaveFragment : function(){
                debugger
                BusyIndicator.show();
             describtion=this.getView().byId("id_Desc").getValue();
                var userdetails = that.getView().getModel("userModel").getData()
                var userrole = that.getOwnerComponent().getModel("userrole").getData()
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var surl = appModulePath + "/odata/v4/ideal-product-complaint-srv/createProductComplaint";

             var filedata= this.getView().getModel("claimAttachMapJson").getData()
               
                var oPayload = {
                    "action": "CREATE",
                    "appType": "PPR",
                    "PprHeader": [
                        {
                            "PPR_NO":1,
                            "PROD_GRP":PRGroup,
                            "DISTRIBUTOR_ID":id,
                            "DISTRIBUTOR_NAME":userdetails.userName,
                            "PROD_CODE":PR_Code,
                            "PROD_UNKNOWN":"",
                            "FACTORY_NAME":"IDEAL",
                            "DESCRIPTION":describtion,
                            "STATUS":1,
                            "SALES_ASSOCIATE_ID":"",
                            "APPROVER_ROLE":"",
                            "APPROVER_LEVEL":1,
                            
                            "CREATED_ON":null
                        }
                    ],
                    "PprAttachment": [
                        {
                            "PPR_NO":1,
                            "ATTACH_CODE":filedata[0].ATTACH_CODE,
                            "FORM_ID":1,
                            "FILE_ID":1,
                            "FILE_NAME":filedata[0].FILE_NAME,
                            "FILE_TYPE":filedata[0].FILE_TYPE,
                            "FILE_MIMETYPE":filedata[0].FILE_MIMETYPE,
                            "FILE_CONTENT":filedata[0].FILE_CONTENT,
                            "UPLOAD_DATE":new Date()
                        }
                    ],
                    "PprEvent": [
                        {
                            "PPR_NO":1,
                            "EVENT_NO":1,
                            "EVENT_CODE":1,
                            "USER_NAME":userdetails.userName,
                            "USER_ROLE":userrole.USER_ROLE,
                            "USER_ID":userdetails.userId,
                            "REMARK":"",
                            "COMMENT":"Product complaint request created",
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
                        MessageBox.success(data.value.OUT_SUCCESS, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
                                    BusyIndicator.hide();

                                    // commented for testing purpose
                                    if(that.selected === null){
                                        // nothing
                                    }
                                    else{
                                        that.selected.setSelected(false);
                                    }
                                    if(claimAttachMapJson !== undefined){
                                        claimAttachMapJson.setData(null)
                                    }
                                    that.getView().byId("downloadid").setEnabled(false)
                                    that.getView().byId("deletBTN").setEnabled(false)
                                    that.getView().byId("id_Grp").setValue("")
                                    that.getView().byId("id_Desc").setValue("")
                                    that.getView().byId("id_Procode").setValue("")
                                    PRGroup= null;
                                    PR_Code= null;
                                    // that.getView().byId("submitBTN").selected(false)
                                    that.getView().byId("submitBTN").setEnabled(false)
                                    that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                    var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                    oRouter.navTo("RouteMasterPage", {
                                        "loginId":id
                                    });
                                  
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

             onUpload: function (e) {
                this._import(e.getParameter("files") && e.getParameter("files")[0]);
              },
              _import: function (file) {
                debugger
                // this.getView().byId("excelorder").setEnabled(true)
                that.allowUploadFileArr = [];
                submitBtnActivity = "incompleteUpload";
                var retailerProfileArr = [];
                var retailerBillingAddressArr = [];
                var retailerShipToAddressArr = []
                // var mergeSectionsArr = [];
                var sQueryArr = [];
                var sQueryArr3 = [];
                var sQueryArr2 = [];
                that.table1SpliceData = [];
                that.table2SpliceData = [];
        
                // sap.ui.core.BusyIndicator.show(0);
                jQuery.sap.delayedCall(5000, this, function () {
                  that.arrayData = [];
                  var excelData = {};
                  if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                      var data = e.target.result;
                      var workbook = XLSX.read(data, {
                        type: 'binary'
                      });
                      workbook.SheetNames.forEach(function (sheetName) {
                        // Here is your object for every sheet in workbook
                        excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        that.arrayData.push(excelData);
                      });
        
        
        
                      that.localModel = new JSONModel(that.arrayData[0]);
                      // that.localModel.setData(that.arrayData[0].splice(0,10));
                      // $.merge(that.table1SpliceData,that.localModel.getData());
                      that.getOwnerComponent().setModel(that.localModel, "localModel");
                      that.readCategories();
        
        
                    };
        
                    reader.readAsBinaryString(file);
                    sap.ui.core.BusyIndicator.hide();
                  }
                });
        
              },
              onTemplateDownload: function (oEvent) {
                debugger
                var url = appModulePath +"/odata/v4/ideal-purchase-creation-srv/PrTemplate(TEMPLATE_ID=1)/$value"   //26 - previous
                var context = this;
    
                $.ajax({
                        url: url,
                        type: "GET",
                        contentType: 'application/json',
                        // data: data,
                        success: function (Data, response) {
                        if (Data !== undefined) {
                            // Data = atob(Data);
                            context.downloadBackendAttachment(Data, "Retailer Onboarding Template.xlsx","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                        } else {
                            MessageBox.error("Template not found please contact Admin");
                        }
    
                    },
                    error: function (error) {
                        debugger
                        // var oXML = JSON.parse(error.responseText);
                        // var oXMLMsg = oXML.error["message"];
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
            downloadBackendAttachment: function (content, fileName, mimeType) {
                debugger
                // "data:application/octet-stream;base64," + 
                download("data:application/octet-stream;base64," +content, fileName, mimeType);
                var HttpRequest = new XMLHttpRequest();
                // x.open("GET", "http://danml.com/wave2.gif", true);
                HttpRequest.responseType = 'blob';
                HttpRequest.onload = function (e) {
                    download(HttpRequest.response, fileName, mimeType);
                };
                HttpRequest.send();
            },
            ProductOnserch: function (oEvent) {
                debugger
          
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                if (sQuery) {
                    var oFilter1 = [new sap.ui.model.Filter("ProDes", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("ProCode", sap.ui.model.FilterOperator.Contains, sQuery)];
                    var allFilters = new sap.ui.model.Filter(oFilter1, false);
                    pFilter.push(allFilters);
                }
          
                var listItem = sap.ui.getCore().byId("contactcntry_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            handleOTHContactCountrySearch: function (oEvent) {
                debugger
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                if (sQuery) {
                    var oFilter1 = [new sap.ui.model.Filter("ProGroup", sap.ui.model.FilterOperator.Contains, sQuery)];
                    var allFilters = new sap.ui.model.Filter(oFilter1, false);
                    pFilter.push(allFilters);
                }
        
                var listItem = sap.ui.getCore().byId("contactcntry");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            onGrpChange : function(oEvent){
                debugger
                var selectprogroup= this.getView().byId("id_Grp").getValue()
                
                var tabelfile= this.getView().getModel("claimAttachMapJson").getData()[0].FILE_NAME;
                if(!selectprogroup){
                this.getView().byId("submitBTN").setEnabled(false)
                }else if(selectprogroup && tabelfile){
                    this.getView().byId("submitBTN").setEnabled(true) 
                }

            },
            onproductChange : function(){
                debugger
                var selectprocode= this.getView().byId("id_Desc").getValue()
                var tabelfile= this.getView().getModel("claimAttachMapJson").getData()[0].FILE_NAME;
                if(!selectprocode){
                this.getView().byId("submitBTN").setEnabled(false)
                }else if(selectprocode && tabelfile){
                    this.getView().byId("submitBTN").setEnabled(true) 
                }
            }
        });
    });