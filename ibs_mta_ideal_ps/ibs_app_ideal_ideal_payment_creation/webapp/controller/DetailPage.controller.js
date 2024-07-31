sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "com/ibs/ibsappidealidealpaymentcreation/model/formatter",
    "com/ibs/ibsappidealidealpaymentcreation/model/down"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, BusyIndicator, MessageBox, formatter, down) {
        "use strict";
        var id;
        var that;
        var sFull, sPartial, sCredit, sCheques;
        var appModulePath;
        var obj, PR_NO;
        var sbfileDetails;
        var finduserdetails, finduserrole;
        var uLoadedfile;
        var oAttachment, payment;
        var attachJson, oMode1,file_Selected;
        var model, oMinDateModel,oMaxDateModel;
        return BaseController.extend("com.ibs.ibsappidealidealpaymentcreation.controller.DetailPage", {
            formatter: formatter,
            onInit: function () {
                that = this;
                var nav = sap.ui.core.UIComponent.getRouterFor(this);
                nav.getRoute("DetailPage").attachPatternMatched(this._onRouteMatched, this);

                // oMinDateModel = new JSONModel({
                //     minDate: new Date()
                // });
                // this.getOwnerComponent().setModel(oMinDateModel, "minDateModel");

                 oMaxDateModel = new JSONModel({
                    maxDate: new Date()
                });
                this.getOwnerComponent().setModel(oMaxDateModel, "maxDateModel");

                payment = []


                oAttachment = {
                    results: []
                }

                obj = {
                    results: []
                }
                oMode1 = new JSONModel(obj.results);
                that.getOwnerComponent().setModel(oMode1, "attachJson1");

            },


            _onRouteMatched: function (oEvent) {
                debugger
                var g = this.getView().getParent().getParent();
                g.toBeginColumnPage(this.getView())

                id = oEvent.getParameter('arguments').loginId;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                this.getView().byId("RB1-4").setSelected(true)
                that.userrole()
                that.onRadioButtonSelect()

                oAttachment = {
                    results: []
                }

            },
            handleValueGroupHelp: function () {
                debugger
                if (!this.grpFragment) {
                    this.grpFragment = sap.ui.xmlfragment("com.ibs.ibsappidealidealpaymentcreation.view.fragments.poFragment", this);
                    this.getView().addDependent(this.grpFragment);
                    //this._delvrTemp = sap.ui.getCore().byId("delvrTempId").clone();
                }
                this.grpFragment.open();
                var prstatus = "3";
                var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PrHeader?$filter=DISTRIBUTOR_ID eq '" + id + "' and PR_STATUS eq '" + prstatus + "'";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger
                        // for (var i = 0; i < data.value.length; i++) {
                        //     if (data.value[i].PR_NO === null || data.value[i].PR_NO === undefined || data.value[i].PR_NO === "") {
                        //         data.value[i].PR_NO = data.value[i].PR_NO;
                        //     } else {
                        //         data.value[i].PR_NO = data.value[i].PR_NO.toString();
                        //     }
                        //     // data.value[i].PR_CREATION_DATE = String(new Date(data.value[i].PR_CREATION_DATE));
                        // }



                        var model = new JSONModel(data);
                        that.getOwnerComponent().setModel(model, "Po_data");

                        // tablethat.getView().getModel("Po_data").getData();
                        // that.getView().getModel("supplier").refresh(true)




                    },
                    error: function (e) {
                        debugger
                        BusyIndicator.hide()
                        MessageBox.error(e.responseText);
                    }
                });

            },
            contactOTHCountrySelection: function (oEvent) {
                debugger
                var po_order_data = oEvent.getSource().getSelectedItem().getBindingContext("Po_data").getObject()
                model = new JSONModel(po_order_data);
                that.getOwnerComponent().setModel(model, "Select_po");
                var po_detail = this.getView().getModel("Select_po").getData()
                PR_NO = po_detail.PR_NO;
                this.event();

                this.closeContactCountryDialog()

            },



            closeContactCountryDialog: function () {
                //debugger
                this.grpFragment.close();
                this.grpFragment.destroy();
                this.grpFragment = null;
            },



            handleUpload: function (oEvent) {
                debugger;

                sbfileDetails = oEvent.getParameters("file").files;
                 file_Selected=sbfileDetails[0].name
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
                    // this.sbIndex = parseInt(oEvent.getSource().getBindingContext("claimAttachMapJson").getPath().split("/")[1]);
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
                debugger
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
            _sbgetUploadedFiles: function (oEvent) {
                debugger;



                var that = this;
                oAttachment.results = that.getView().getModel("attachJson1").getData();





                // if (oAttachment.results === null) {

                //     oAttachment = {
                //         results: []
                //     }
                // }
                    // if (this.sbfileUploadArr.length === 0) {
                    //     for (var fdata in this.sbfileUploadArr) {
                    //         var sbAttachmentArr = {
                    //             "FILE_NAME": this.sbfileUploadArr[fdata].FileName,
                    //             "FILE_MIMETYPE": this.sbfileUploadArr[fdata].MimeType,
                    //             "FILE_CONTENT": this.sbfileUploadArr[fdata].Content,
                    //             "FILE_TYPE": this.sbfileUploadArr[fdata].Type
                    //         };
                    //         oAttachment.results.push(sbAttachmentArr)

                    //     }
                    //     attachJson = new JSONModel(oAttachment.results);
                    //     that.getOwnerComponent().setModel(attachJson, "attachJson1");
                    //     MessageBox.success("Your file has been uploaded successfully", {
                    //         actions: [MessageBox.Action.OK],
                    //         onClose: function (oAction) {
                    //             if (oAction === "OK") {
    
                    //                 that.getView().byId("fileUploader").setValue("")
    
                    //             }
    
                    //         }
                    //     })

                    //  } else {.




                    var duFlag=true;
                    if (this.sbfileUploadArr.length != 0) {
                         if(oAttachment.results.length === 0){
                            for (var fdata in this.sbfileUploadArr) {
                                var sbAttachmentArr = {
                                    "FILE_NAME": this.sbfileUploadArr[fdata].FileName,
                                    "FILE_MIMETYPE": this.sbfileUploadArr[fdata].MimeType,
                                    "FILE_CONTENT": this.sbfileUploadArr[fdata].Content,
                                    "FILE_TYPE": this.sbfileUploadArr[fdata].Type
                                };
                                oAttachment.results.push(sbAttachmentArr)
    
                            }
                            attachJson = new JSONModel(oAttachment.results);
                            that.getOwnerComponent().setModel(attachJson, "attachJson1");
                        
                            MessageBox.success("Your file has been uploaded successfully", {
                                actions: [MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    if (oAction === "OK") {
        
                                        that.getView().byId("fileUploader").setValue("")
        
                                    }
        
                                }
                            })
                         } else if(oAttachment.results.length != 0){

                            for (let i = 0; i < oAttachment.results.length; i++) {
                                if(oAttachment.results[i].FILE_NAME === file_Selected){
                                    duFlag= false
                                } 
                            } if (duFlag=== true){
                                    for (var fdata in this.sbfileUploadArr) {
                                        var sbAttachmentArr = {
                                            "FILE_NAME": this.sbfileUploadArr[fdata].FileName,
                                            "FILE_MIMETYPE": this.sbfileUploadArr[fdata].MimeType,
                                            "FILE_CONTENT": this.sbfileUploadArr[fdata].Content,
                                            "FILE_TYPE": this.sbfileUploadArr[fdata].Type
                                        };
                                        oAttachment.results.push(sbAttachmentArr)
            
                                    }
                                    attachJson = new JSONModel(oAttachment.results);
                                    that.getOwnerComponent().setModel(attachJson, "attachJson1");
                                
                                    MessageBox.success("Your file has been uploaded successfully", {
                                        actions: [MessageBox.Action.OK],
                                        onClose: function (oAction) {
                                            if (oAction === "OK") {
                
                                                that.getView().byId("fileUploader").setValue("")
                
                                            }
                
                                        }
                                    })
                                }else if(duFlag=== false){
                                    MessageBox.error("This file is already uploaded.")
                                    that.getView().byId("fileUploader").setValue("")
                                }

                                
                            // }

                         }
            
                    }

                   

                


            },



            onDelete: function (oEvent) {
                debugger
                MessageBox.information("Are you sure you want to delete the file ?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (Action) {
                        if (Action === "YES") {
                            debugger
                            // that.getView().byId("fileUploader").setValue("")
                            var oSelectedItem = oEvent.getSource().getParent();
                            var nIndex = oSelectedItem.getParent().indexOfItem(oSelectedItem);
                            // var sFileName = oSelectedItem.getCells()[0].getText();
                            // oSelectedItem.getParent().removeItem(oSelectedItem);

                            var oModel = that.getView().getModel("attachJson1").getData();
                            // oModel.splice(0,Number(nIndex));
                            oModel.splice(nIndex, 1);
                            that.getView().getModel("attachJson1").setData(oModel);
                            // obj.results.splice(nIndex,1);


                            that.getView().getModel("attachJson1").refresh(true);




                        }
                    }
                });

            },

            downloadFileContent: function (oEvent) {
                debugger
                this.sbIndex = parseInt(oEvent.getSource().getBindingContext("attachJson1").getPath().split("/")[1]);
                var aFilter = [],
                    fileContent = null;

                var data = this.getView().getModel("attachJson1").getData()[this.sbIndex];

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
            event: function () {
                debugger

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrEventLog?$filter=PR_NO eq " + PR_NO + "";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger
                        //  eventLog.setData(data);
                        var eventLog = new JSONModel(data);
                        that.getView().setModel(eventLog, "eventData");
                        var eventData = that.getView().getModel("eventData").getData()
                    },
                    error: function (e) {
                        debugger
                        BusyIndicator.hide()
                        MessageBox.error("error");
                    }
                });


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
                        BusyIndicator.hide()
                        MessageBox.error(e.responseText);
                    }
                });

            },
            onRadioButtonSelect: function () {
                debugger
                sFull = this.getView().byId("RB1-4").getSelected()
                sPartial = this.getView().byId("RB1-5").getSelected()
                sCredit = this.getView().byId("RB1-6").getSelected()
                sCheques = this.getView().byId("RB1-7").getSelected()
                // var sCredi = this.getView().byId("RB1-8").getSelected()

                if (sFull === true) {
                    this.getView().byId("f_full").setVisible(true)
                    this.getView().byId("f_partial").setVisible(false)
                    this.getView().byId("f_Excep").setVisible(false)
                    this.getView().byId("f_Cheques").setVisible(false)
                    this.getView().byId("f_letter").setVisible(false)

                    // this.getView().byId("partAmount").setValue("")
                    this.getView().byId("f_utr").setValue("")
                    this.getView().byId("f_credit").setValue("")
                    this.getView().byId("f_note").setValue("")
                    this.getView().byId("DP4").setValue("")

                    this.getView().byId("E_number").setValue("")
                    this.getView().byId("E_details").setValue("")

                    this.getView().byId("cque").setValue("")
                    // this.getView().byId("pdc_amount").setValue("")
                    this.getView().byId("DP5").setValue("")



                } else if (sPartial === true) {
                    this.getView().byId("f_full").setVisible(false)
                    this.getView().byId("f_partial").setVisible(true)
                    this.getView().byId("f_Excep").setVisible(false)
                    this.getView().byId("f_Cheques").setVisible(false)
                    this.getView().byId("f_letter").setVisible(false)


                    this.getView().byId("id_payment").setValue("")
                    this.getView().byId("DP1").setValue("")

                    this.getView().byId("E_number").setValue("")
                    this.getView().byId("E_details").setValue("")

                    this.getView().byId("cque").setValue("")
                    // this.getView().byId("pdc_amount").setValue("")
                    this.getView().byId("DP5").setValue("")


                } else if (sCredit === true) {
                    this.getView().byId("f_full").setVisible(false)
                    this.getView().byId("f_partial").setVisible(false)
                    this.getView().byId("f_Excep").setVisible(true)
                    this.getView().byId("f_Cheques").setVisible(false)
                    this.getView().byId("f_letter").setVisible(false)

                    this.getView().byId("id_payment").setValue("")
                    this.getView().byId("DP1").setValue("")

                    // this.getView().byId("partAmount").setValue("")
                    this.getView().byId("f_utr").setValue("")
                    this.getView().byId("f_credit").setValue("")
                    this.getView().byId("f_note").setValue("")
                    this.getView().byId("DP4").setValue("")

                    this.getView().byId("cque").setValue("")
                    // this.getView().byId("pdc_amount").setValue("")
                    this.getView().byId("DP5").setValue("")




                }
                else if (sCheques === true) {
                    this.getView().byId("f_full").setVisible(false)
                    this.getView().byId("f_partial").setVisible(false)
                    this.getView().byId("f_Excep").setVisible(false)
                    this.getView().byId("f_Cheques").setVisible(true)
                    this.getView().byId("f_letter").setVisible(false)

                    this.getView().byId("id_payment").setValue("")
                    this.getView().byId("DP1").setValue("")

                    // this.getView().byId("partAmount").setValue("")
                    this.getView().byId("f_utr").setValue("")
                    this.getView().byId("f_credit").setValue("")
                    this.getView().byId("f_note").setValue("")
                    this.getView().byId("DP4").setValue("")

                    this.getView().byId("E_number").setValue("")
                    this.getView().byId("E_details").setValue("")
                }
                else {
                    this.getView().byId("f_full").setVisible(true)
                    this.getView().byId("f_partial").setVisible(false)
                    this.getView().byId("f_Excep").setVisible(false)
                    this.getView().byId("f_Cheques").setVisible(false)
                    this.getView().byId("f_letter").setVisible(false)

                    this.getView().byId("id_payment").setValue("")
                    this.getView().byId("DP1").setValue("")

                    // this.getView().byId("partAmount").setValue("")
                    this.getView().byId("f_utr").setValue("")
                    this.getView().byId("f_credit").setValue("")
                    this.getView().byId("f_note").setValue("")
                    this.getView().byId("DP4").setValue("")

                    this.getView().byId("E_number").setValue("")
                    this.getView().byId("E_details").setValue("")
                }



                // else if (sCredi === true) {
                //     this.getView().byId("f_full").setVisible(false)
                //     this.getView().byId("f_partial").setVisible(false)
                //     this.getView().byId("f_Excep").setVisible(false)
                //     this.getView().byId("f_Cheques").setVisible(false)
                //     this.getView().byId("f_letter").setVisible(true)
                // } 
            },
            openSaveFragment: function () {
                debugger
                // BusyIndicator.show()
                var redioBtn= this.getView().byId("rbg1").getSelectedButton().mProperties.text
                if (!PR_NO) {
                    BusyIndicator.hide();
                    MessageBox.error("Please fill SO Details");

                }

                else if (PR_NO) {
                    var po_detail = this.getView().getModel("Select_po").getData()
                    finduserdetails = this.getOwnerComponent().getModel("userModel").getData()
                    finduserrole = this.getOwnerComponent().getModel("userrole").getData()

                    // var eventData = that.getView().getModel("eventData").getData()
                    
                    var utpcode = this.getView().byId("id_payment").getValue()
                    var date = this.getView().byId("DP1").getDateValue()
                    if (date === null) {

                    } else {
                        // var oDate = new Date(date);
                        // var sDate = oDate.toISOString().split('T')[0];


                        var timezoneOffset1 = date.getTimezoneOffset() * 60000;
                        var sDate = new Date(date.getTime() - timezoneOffset1).toISOString().split('T')[0];
                    }

                    /////Partial Payment
                    
                    var f_utr = this.getView().byId("f_utr").getValue()
                    var f_credit = this.getView().byId("f_credit").getValue()
                    var f_note = this.getView().byId("f_note").getValue()
                    var date1 = this.getView().byId("DP4").getDateValue()
                    if (date1 === null) {
                    } else {
                        

                        var timezoneOffset2 = date1.getTimezoneOffset() * 60000;
                        var sDate1 = new Date(date1.getTime() - timezoneOffset2).toISOString().split('T')[0];
                    }
                    var f_amount = parseInt(po_detail.GRAND_TOTAL)

                    ////expo crede
                    var E_number = this.getView().byId("E_number").getValue()
                    var E_details = this.getView().byId("E_details").getValue()

                    ///pdc
                    var cque = this.getView().byId("cque").getValue()
                    var date2 = this.getView().byId("DP5").getDateValue()
                    if (date2 === null) {

                    } else {
                     

                        var timezoneOffset3 = date2.getTimezoneOffset() * 60000;
                        var sDate2 = new Date(date2.getTime() - timezoneOffset3).toISOString().split('T')[0];


                    }
                    var pdc_amount = parseInt(po_detail.GRAND_TOTAL)





                    if (sFull === undefined) {
                        if (!utpcode) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill UTR no ");
                        }
                        else if (!date) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill date");
                        }
                        else if (utpcode && date) {
                            payment = {
                                "SAP_ORDER_NO": "0",
                                "POP_NO": 1,
                                "DISTRIBUTOR_ID": po_detail.DISTRIBUTOR_ID,
                                "DISTRIBUTOR_NAME": finduserdetails.userName,
                                "PR_SAP_NO": po_detail.SAP_SO_NO.toString(),
                                "CREATION_DATE": null,
                                "PAYMENT_TYPE":redioBtn,
                                "OFFLINE_FP_UTR": utpcode,
                                "OFFLINE_FP_DATE": sDate,
                                "OFFLINE_FP_AMOUNT": parseInt(po_detail.GRAND_TOTAL),
                                "OFFLINE_PP_UTR": null,
                                "OFFLINE_PP_DATE": null,
                                "OFFLINE_PP_UTR_AMT": null,
                                "OFFLINE_PP_CREDIT_NOTE_NO": null,
                                "OFFLINE_PP_CREDIT_NOTE_AMT": null,
                                "PDC_NO": null,
                                "PDC_DATE": null,
                                "PDC_AMT": null,
                                "EXCRDT_DAYS": null,
                                "DIST_COMMENTS": "My Payment",
                                "PAY_NOW_UTR": null,
                                "PAY_NOW_TRASAC_NO": null,
                                "PAY_NOW_DATE": null,
                                "PAY_NOW_AMT": null,
                                "DOC_POST": null,
                                "ATTACH": null,
                                "STATUS": 1,
                                "AR_AMOUNT_ENTERED": null,
                                "LAST_UPDATED_DATE": null,
                                "APPROVER_LEVEL": 2,
                                "APPROVER_ROLE": "SA"
                            }
                            this.palcepayment()

                        }

                    }
                    else if (sFull === true) {
                        if (!utpcode) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill UTR no ");
                        }
                        else if (!date) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill date");
                        }
                        else if (utpcode && date) {
                            payment = {
                                "SAP_ORDER_NO": "0",
                                "POP_NO": 1,
                                "DISTRIBUTOR_ID": po_detail.DISTRIBUTOR_ID,
                                "DISTRIBUTOR_NAME": finduserdetails.userName,
                                "PR_SAP_NO": po_detail.SAP_SO_NO.toString(),
                                "CREATION_DATE": null,
                                "PAYMENT_TYPE":redioBtn,
                                "OFFLINE_FP_UTR": utpcode,
                                "OFFLINE_FP_DATE": sDate,
                                "OFFLINE_FP_AMOUNT": parseInt(po_detail.GRAND_TOTAL),
                                "OFFLINE_PP_UTR": null,
                                "OFFLINE_PP_DATE": null,
                                "OFFLINE_PP_UTR_AMT": null,
                                "OFFLINE_PP_CREDIT_NOTE_NO": null,
                                "OFFLINE_PP_CREDIT_NOTE_AMT": null,
                                "PDC_NO": null,
                                "PDC_DATE": null,
                                "PDC_AMT": null,
                                "EXCRDT_DAYS": null,
                                "DIST_COMMENTS": "My Payment",
                                "PAY_NOW_UTR": null,
                                "PAY_NOW_TRASAC_NO": null,
                                "PAY_NOW_DATE": null,
                                "PAY_NOW_AMT": null,
                                "DOC_POST": null,
                                "ATTACH": null,
                                "STATUS": 1,
                                "AR_AMOUNT_ENTERED": null,
                                "LAST_UPDATED_DATE": null,
                                "APPROVER_LEVEL": 2,
                                "APPROVER_ROLE": "SA"
                            }
                            this.palcepayment()
                        }

                    } else if (sPartial === true) {

                        if (!f_utr) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill UTR no ");
                        }
                        else if (!f_credit) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill credit note amount");
                        }
                        else if (!f_note) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill credit Note");
                        }
                        else if (!date1) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill date");
                        } else if (!f_amount) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill amount");
                        }
                        else if (f_utr && f_credit && f_note && f_note && date1 && f_amount) {
                            payment = {
                                "SAP_ORDER_NO": "0",
                                "POP_NO": 1,
                                "DISTRIBUTOR_ID": po_detail.DISTRIBUTOR_ID,
                                "DISTRIBUTOR_NAME": finduserdetails.userName,
                                "PR_SAP_NO": po_detail.SAP_SO_NO.toString(),
                                "CREATION_DATE": null,
                                "PAYMENT_TYPE":redioBtn,
                                "OFFLINE_FP_UTR": null,
                                "OFFLINE_FP_DATE": null,
                                "OFFLINE_FP_AMOUNT": null,
                                "OFFLINE_PP_UTR": f_utr,
                                "OFFLINE_PP_DATE": sDate1,
                                "OFFLINE_PP_UTR_AMT": parseInt(po_detail.GRAND_TOTAL),
                                "OFFLINE_PP_CREDIT_NOTE_NO": f_note,
                                "OFFLINE_PP_CREDIT_NOTE_AMT": parseInt(f_credit),
                                "PDC_NO": null,
                                "PDC_DATE": null,
                                "PDC_AMT": null,
                                "EXCRDT_DAYS": null,
                                "DIST_COMMENTS": "My Payment",
                                "PAY_NOW_UTR": null,
                                "PAY_NOW_TRASAC_NO": null,
                                "PAY_NOW_DATE": null,
                                "PAY_NOW_AMT": null,
                                "DOC_POST": null,
                                "ATTACH": null,
                                "STATUS": 1,
                                "AR_AMOUNT_ENTERED": null,
                                "LAST_UPDATED_DATE": null,
                                "APPROVER_LEVEL": 1,
                                "APPROVER_ROLE": ""
                            }
                            this.palcepayment()
                        }
                    } else if (sCredit === true) {

                        if (!E_number) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill number of days ");
                        }

                        else if (E_number) {
                            payment = {
                                "SAP_ORDER_NO": "0",
                                "POP_NO": 1,
                                "DISTRIBUTOR_ID": po_detail.DISTRIBUTOR_ID,
                                "DISTRIBUTOR_NAME": finduserdetails.userName,
                                "PR_SAP_NO": po_detail.SAP_SO_NO.toString(),
                                "CREATION_DATE": null,
                                "PAYMENT_TYPE":redioBtn,
                                "OFFLINE_FP_UTR": null,
                                "OFFLINE_FP_DATE": null,
                                "OFFLINE_FP_AMOUNT": null,
                                "OFFLINE_PP_UTR": null,
                                "OFFLINE_PP_DATE": null,
                                "OFFLINE_PP_UTR_AMT": null,
                                "OFFLINE_PP_CREDIT_NOTE_NO": null,
                                "OFFLINE_PP_CREDIT_NOTE_AMT": null,
                                "PDC_NO": null,
                                "PDC_DATE": null,
                                "PDC_AMT": null,
                                "EXCRDT_DAYS": parseInt(E_number),
                                "DIST_COMMENTS": "My Payment",
                                "PAY_NOW_UTR": null,
                                "PAY_NOW_TRASAC_NO": null,
                                "PAY_NOW_DATE": null,
                                "PAY_NOW_AMT": null,
                                "DOC_POST": null,
                                "ATTACH": null,
                                "STATUS": 1,
                                "AR_AMOUNT_ENTERED": null,
                                "LAST_UPDATED_DATE": null,
                                "APPROVER_LEVEL": 2,
                                "APPROVER_ROLE": "SA"
                            }
                            this.palcepayment()
                        }
                    } else if (sCheques === true) {
                        if (!cque) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill PDC no ");
                        }
                        else if (!date2) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill PDC date");
                        } else if (!pdc_amount) {
                            BusyIndicator.hide();
                            MessageBox.error("Please fill amount");
                        }
                        else if (cque && date2 && pdc_amount) {
                            payment = {
                                "SAP_ORDER_NO": "0",
                                "POP_NO": 1,
                                "DISTRIBUTOR_ID": po_detail.DISTRIBUTOR_ID,
                                "DISTRIBUTOR_NAME": finduserdetails.userName,
                                "PR_SAP_NO": po_detail.SAP_SO_NO.toString(),
                                "CREATION_DATE": null,
                                "PAYMENT_TYPE":redioBtn,
                                "OFFLINE_FP_UTR": null,
                                "OFFLINE_FP_DATE": null,
                                "OFFLINE_FP_AMOUNT": null,
                                "OFFLINE_PP_UTR": null,
                                "OFFLINE_PP_DATE": null,
                                "OFFLINE_PP_UTR_AMT": null,
                                "OFFLINE_PP_CREDIT_NOTE_NO": null,
                                "OFFLINE_PP_CREDIT_NOTE_AMT": null,
                                "PDC_NO": parseInt(cque),
                                "PDC_DATE": sDate2,
                                "PDC_AMT": parseInt(po_detail.GRAND_TOTAL),
                                "EXCRDT_DAYS": null,
                                "DIST_COMMENTS": "My Payment",
                                "PAY_NOW_UTR": null,
                                "PAY_NOW_TRASAC_NO": null,
                                "PAY_NOW_DATE": null,
                                "PAY_NOW_AMT": null,
                                "DOC_POST": null,
                                "ATTACH": null,
                                "STATUS": 1,
                                "AR_AMOUNT_ENTERED": null,
                                "LAST_UPDATED_DATE": null,
                                "APPROVER_LEVEL": 2,
                                "APPROVER_ROLE": "SA"
                            }
                            this.palcepayment()
                        }
                    }

                }


            },


            palcepayment: function (oEvent) {


                BusyIndicator.show();
                var po_detail = this.getView().getModel("Select_po").getData()

                this.getView().getModel("attachJson1").getData() || null

                //    var fileDetails=  obj.results || null


                uLoadedfile = []
                for (let i = 0; i < this.getView().getModel("attachJson1").getData().length; i++) {
                    var fileDetails = {
                        "POP_NO": Number(po_detail.PR_NO),
                        "ATTACH_CODE": null,
                        "FILE_ID": 1,
                        "FILE_CONTENT": this.getView().getModel("attachJson1").getData()[i].FILE_CONTENT,
                        "FILE_MIMETYPE": this.getView().getModel("attachJson1").getData()[i].FILE_MIMETYPE,
                        "FILE_TYPE": this.getView().getModel("attachJson1").getData()[i].FILE_TYPE,
                        "FILE_NAME": this.getView().getModel("attachJson1").getData()[i].FILE_NAME,
                        "CREATION_DATE": null
                    }
                    uLoadedfile.push(fileDetails)
                }


                var surl = appModulePath + "/odata/v4/ideal-payments-creation-srv/createPayment";


                var oPayload = {
                    "action": "CREATE",
                    "appType": "PAY",
                    "paymentsHeader": [payment],
                    "paymentsAttachments": uLoadedfile,
                    "paymentsEventLog": [{
                        "POP_NO": Number(PR_NO),
                        "EVENT_NO": 1,
                        "EVENT_CODE": 1,
                        "USER_ID": finduserdetails.userId,
                        "USER_ROLE": finduserrole.USER_ROLE,
                        "USER_NAME": finduserdetails.userName,
                        "COMMENTS": "Payment request created",
                        "CREATION_DATE": null
                    }],
                    "userDetails": {
                        "USER_ROLE": finduserrole.USER_ROLE,
                        "USER_ID": finduserdetails.userId
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

                                    that.getView().byId("id_Grp").setValue("")
                                    that.getView().byId("id_creDate").setValue("")
                                    that.getView().byId("id_payMeth").setValue("")
                                    // that.getView().byId("id_OrdTy").setValue("")
                                    that.getView().byId("id_OrdDate").setValue("")
                                    that.getView().byId("id_toAmo").setValue("")

                                    that.getView().byId("id_fdate").setValue("")
                                    that.getView().byId("id_payment").setValue("")
                                    that.getView().byId("DP1").setValue("")

                                    that.getView().byId("partAmount").setValue("")
                                    that.getView().byId("f_utr").setValue("")
                                    that.getView().byId("f_credit").setValue("")
                                    that.getView().byId("f_note").setValue("")
                                    that.getView().byId("DP4").setValue("")

                                    that.getView().byId("E_number").setValue("")
                                    that.getView().byId("E_details").setValue("")

                                    that.getView().byId("cque").setValue("")
                                    that.getView().byId("pdc_amount").setValue("")
                                    that.getView().byId("DP5").setValue("")
                                    
                                    if (attachJson === undefined || oMode1 === undefined) {
                                        that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                        var router = sap.ui.core.UIComponent.getRouterFor(that);
                                        router.navTo("RouteMasterPage", {
                                            "loginId": id
                                        });
                                    } else {
                                        attachJson.setData(null)
                                        oMode1.setData(null)

                                        that.getView().byId("id_Grp").setValue("")
                                        that.getView().byId("id_creDate").setValue("")
                                        that.getView().byId("id_payMeth").setValue("")
                                        // that.getView().byId("id_OrdTy").setValue("")
                                        that.getView().byId("id_OrdDate").setValue("")
                                        that.getView().byId("id_toAmo").setValue("")

                                        that.getView().byId("id_fdate").setValue("")
                                        that.getView().byId("id_payment").setValue("")
                                        that.getView().byId("DP1").setValue("")

                                        that.getView().byId("partAmount").setValue("")
                                        that.getView().byId("f_utr").setValue("")
                                        that.getView().byId("f_credit").setValue("")
                                        that.getView().byId("f_note").setValue("")
                                        that.getView().byId("DP4").setValue("")

                                        that.getView().byId("E_number").setValue("")
                                        that.getView().byId("E_details").setValue("")

                                        that.getView().byId("cque").setValue("")
                                        that.getView().byId("pdc_amount").setValue("")
                                        that.getView().byId("DP5").setValue("")


                                        // this.getView().byId("shiftdetail").setValue("");
                                        that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                        var router = sap.ui.core.UIComponent.getRouterFor(that);
                                        router.navTo("RouteMasterPage", {
                                            "loginId": id
                                        });

                                    }
                                }
                            }
                        }
                        );
                    },

                    error: function (oError) {
                        debugger;
                        BusyIndicator.hide()
                        MessageBox.error(oError.responseText);

                    }

                });


            },






            handleOTHContactCountrySearch: function (oEvent) {
                debugger
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                if (sQuery) {
                    var oFilter1 = [new sap.ui.model.Filter("SAP_SO_NO", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("PR_CREATION_DATE", sap.ui.model.FilterOperator.Contains, sQuery)];
                    var allFilters = new sap.ui.model.Filter(oFilter1, false);
                    pFilter.push(allFilters);
                }

                var listItem = sap.ui.getCore().byId("contactcntry_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },


            navigateToView1: function () {
                debugger
                var g = this.getView().getParent().getParent();
                g.toBeginColumnPage(this.getView())

                this.getView().byId("id_Grp").setValue("")
                this.getView().byId("id_creDate").setValue("")
                this.getView().byId("id_payMeth").setValue("")
                // this.getView().byId("id_OrdTy").setValue("")
                this.getView().byId("id_OrdDate").setValue("")
                this.getView().byId("id_toAmo").setValue("")

                this.getView().byId("id_fdate").setValue("")

                this.getView().byId("id_payment").setValue("")
                this.getView().byId("DP1").setValue("")

                this.getView().byId("partAmount").setValue("")
                this.getView().byId("f_utr").setValue("")
                this.getView().byId("f_credit").setValue("")
                this.getView().byId("f_note").setValue("")
                this.getView().byId("DP4").setValue("")

                this.getView().byId("E_number").setValue("")
                this.getView().byId("E_details").setValue("")

                this.getView().byId("cque").setValue("")
                this.getView().byId("pdc_amount").setValue("")
                this.getView().byId("DP5").setValue("")

                if (attachJson === undefined || oMode1 === undefined) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMasterPage", {
                        "loginId": id
                    });
                } else {
                    attachJson.setData(null);
                    oMode1.setData(null)


                    // if (attachJson !== undefined) {
                    //     // this.getView().getModel("blankJson").setData("");
                    //     attachJson.setData(null);
                    // }

                    // if (oMode1 !== undefined) {
                    //     // this.getView().getModel("blankJson").setData("");
                    //     oMode1.setData(null);
                    // }
                    // that.getOwnerComponent().getModel("attachJson1").setData("")

                    this.getView().byId("id_Grp").setValue("")
                    this.getView().byId("id_creDate").setValue("")
                    this.getView().byId("id_payMeth").setValue("")
                    // this.getView().byId("id_OrdTy").setValue("")
                    this.getView().byId("id_OrdDate").setValue("")
                    this.getView().byId("id_toAmo").setValue("")

                    this.getView().byId("id_fdate").setValue("")

                    this.getView().byId("id_payment").setValue("")
                    this.getView().byId("DP1").setValue("")

                    this.getView().byId("partAmount").setValue("")
                    this.getView().byId("f_utr").setValue("")
                    this.getView().byId("f_credit").setValue("")
                    this.getView().byId("f_note").setValue("")
                    this.getView().byId("DP4").setValue("")

                    this.getView().byId("E_number").setValue("")
                    this.getView().byId("E_details").setValue("")

                    this.getView().byId("cque").setValue("")
                    this.getView().byId("pdc_amount").setValue("")
                    this.getView().byId("DP5").setValue("")


                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMasterPage", {
                        "loginId": id
                    });
                }
            }
        });
    });