sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/ui/core/message/Message",
    "sap/ui/model/json/JSONModel",
    "../model/down",
    "../model/jszip",
    "../model/xlsx",
    "com/ibs/ibsappidealsalesorder/model/formatter"
  

  ],
  function (Controller, MessageToast, Filter, FilterOperator, BusyIndicator, MessageBox, MessagePopover,
    MessageItem, Message, JSONModel, down, jszip, xlsx, formatter) {
    "use strict";
    var prno;
    var appModulePath;
    var submitBtnActivity, context, that, oView;
    var retailerData, paymen_method;
    var oDataModel2,grpSelected,grupId,productgroup,productSelectd;
    var newEntry=[];
    var shiptype,shipname,tabledata;
    var proaddTable;
    var tCompre=[]
    return Controller.extend("com.ibs.ibsappidealsalesorder.controller.View4", {
      formatter: formatter,
      onInit: function () {
        //debugger;
        that = this;
        context = this;
        oView = context.getView();
        that.oDataModel = this.getOwnerComponent().getModel();
        oDataModel2 = that.getOwnerComponent().getModel();

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("View4").attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        //debugger
        BusyIndicator.hide();
        var flag = oEvent.getParameters().arguments.FLAG;
        if(flag === "true"){
          
          var data = this.getOwnerComponent().getModel("iModel").getData();
          var tData=new JSONModel(data.value);
          that.getOwnerComponent().setModel(tData, "tModel");
        }else{
          
          newEntry=[];
          tabledata = new JSONModel();
        that.getOwnerComponent().setModel(tabledata, "tModel");
         proaddTable=that.getOwnerComponent().getModel("tModel").getData().length
        }

        var g = this.getView().getParent().getParent();
        g.toBeginColumnPage(this.getView());

        var currentDate= new Date()
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "dd.MM.YYYY"
        });
        var sFormattedDate = oDateFormat.format(currentDate);
        this.getView().byId("id_Date").setValue(sFormattedDate)

        prno = Number(oEvent.getParameters().arguments.D_loginId)

        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        appModulePath = jQuery.sap.getModulePath(appPath);
        this.userrole();
        this.headerData();
        this.shipdetail()


      },

      onUpload: function (e) {
        this._import(e.getParameter("files") && e.getParameter("files")[0]);
      },
      _import: function (file) {
        //debugger
        this.getView().byId("excelorder").setEnabled(true)
        that.allowUploadFileArr = [];
        submitBtnActivity = "incompleteUpload";
        var retailerProfileArr = [];
        var retailerBillingAddressArr = [];
        var retailerShipToAddressArr = []
        var mergeSectionsArr = [];
        var sQueryArr = [];
        var sQueryArr3 = [];
        var sQueryArr2 = [];
        that.table1SpliceData = [];
        that.table2SpliceData = [];

        sap.ui.core.BusyIndicator.show(0);
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

      onBack: function () {
        debugger
        BusyIndicator.show(0);
        
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteView1", {
          "loginId": prno
        });

      },
      handleValueChange: function (oEvent) {
        //debugger
        sap.ui.getCore().fileUploadArr = [];
        var fileData = oEvent.getParameters("items").files[0];
        this.fileDecodingMethod(fileData, "001", fileData);
      },
      fileDecodingMethod: function (uploadedFileData, DocNum, fileData) {
        //debugger
        var that = this;
        var fileMime = uploadedFileData.type;
        var fileName = uploadedFileData.name;
        if (!FileReader.prototype.readAsBinaryString) {
          FileReader.prototype.readAsBinaryString = function (fileData) {
            var binary = "";
            var reader = new FileReader();
            reader.onload = function (e) {
              var bytes = new Uint8Array(reader.result);
              var length = bytes.byteLength;
              for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              that.base64ConversionRes = btoa(binary);
              sap.ui.getCore().fileUploadArr.push({
                "DocumentType": DocNum,
                "MimeType": fileMime,
                "FileName": fileName,
                "Content": that.base64ConversionRes,
              });
            };
            reader.readAsArrayBuffer(fileData);
          };
        }
        var reader = new FileReader();
        reader.onload = function (readerEvt) {
          var binaryString = readerEvt.target.result;
          that.base64ConversionRes = btoa(binaryString);
          that.templateUpload(that.base64ConversionRes, fileData);
          //  sap.ui.getCore().fileUploadArr.push({
          //   "DocumentType": DocNum,
          //   "MimeType": fileMime,
          //   "FileName": fileName,
          //   "Content": that.base64ConversionRes
          //  });
          // that.uploadFileData();
        };
        reader.readAsBinaryString(uploadedFileData);
      },

      retailerDupCheck: function (sValue) {
        //debugger
        var dupRetailerProfileArr = [];
        var result1 = sValue.filter(function (a) {
          var key = distributorId + '|' + a["RETAILER ID"];
          if (!this[key]) {
            this[key] = true;
            return true;
          }
          else {
            dupRetailerProfileArr.push({
              "section": 2,
              "description": "The duplicate retailer profile data has been found of retailer ID " + a["RETAILER ID"] + ".",
              "subtitle": "Duplicate Field",
              "type": "Warning",
              "subsection": "Retailer Profile"
            });
            // dupRetailerProfileArr.push("The duplicate retailer profile data has been found of retailer ID "+a["RETAILER ID"]+".");
          }
        }, Object.create(null));
        return dupRetailerProfileArr;
      },


      templateUpload: function (sValue, fileData) {
        //debugger
        var url = appModulePath + "/OData/v4/ideal-purchase-creation-srv/templateUpload";
        // var fileData = oEvent.getParameters("items").files[0];

        var oPayload =
        {
          "prTemplate": [
            {
              "TEMPLATE_ID": 1,
              "TEMPLATE_NAME": fileData.name,
              "TEMPLATE_CONTENT": btoa(sValue),
              "TEMPLATE_MIMETYPE": fileData.type,
              "TEMPLATE_TYPE": fileData.type

            }
          ]
        }
        var data = JSON.stringify(oPayload);
        this.postAjaxs(url, "POST", data, "uploadTemplate");
      },
      postAjaxs: function (url, type, data, model) {

        $.ajax({
          url: url,
          type: type,
          contentType: 'application/json',
          data: data,
          success: function (data, response) {
            //debugger
            BusyIndicator.hide();
            MessageBox.success(data.value, {
              actions: [MessageBox.Action.OK],
              onClose: function (oAction) {
                if (oAction === "OK") {
                  context.onBack();
                }
              }
            });
            // MessageBox.success(data.value);
          },
          error: function (error) {
            //debugger
            BusyIndicator.hide();
            var oXMLMsg, oXML;
            if (context.isValidJsonString(error.responseText)) {
              oXML = JSON.parse(error.responseText);
              if (oXML.error['code'] === "301") {
                that.dupRegisteredTaxId(oXML.error['message']);
              }
              else {
                oXMLMsg = oXML.error.message;
                MessageBox.error(oXMLMsg);
              }
            } else {
              oXMLMsg = error.responseText;
              MessageBox.error(oXMLMsg);
            }
          }
        });
      },

      onTemplateDownload: function (oEvent) {
        //debugger
        BusyIndicator.show();
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath)
        var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrTemplate(TEMPLATE_ID=1)/$value"  //26 - previous
        // var url = appModulePath + "/odata/v4/ideal-payments-creation-srv/PaymentsAttachments(POP_NO=" + prno + ",FILE_ID="+File_id+")/$value";
        var context = this;

        $.ajax({
          url: url,
          type: "GET",
          contentType: 'application/json',
          // data: data,
          success: function (Data, response) {
            //debugger
            BusyIndicator.hide();
            if (Data !== undefined) {
              // Data = atob(Data);
              context.downloadAttachment(Data, "Material list.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            } else {
              MessageBox.error("Template not found please contact Admin");
            }

          },
          error: function (error) {
            //debugger
            // var oXML = JSON.parse(error.responseText);
            // var oXMLMsg = oXML.error["message"];
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

      onDownload: function (oEvent) {
        var context = this;
        var attachObj;
        var attachModel = oEvent.getSource().mBindingInfos.enabled.parts[0].model;
        attachObj = oEvent.getSource().getBindingContext(attachModel).getObject();
        context.downloadAttachment(attachObj.FILE_CONTENT, attachObj.FILE_NAME, attachObj.FILE_MIMETYPE);

      },

      downloadAttachment: function (content, fileName, mimeType) {
        // "data:application/octet-stream;base64," + 
        download("data:application/octet-stream;base64," + content, fileName, mimeType);
        var HttpRequest = new XMLHttpRequest();
        // x.open("GET", "http://danml.com/wave2.gif", true);
        HttpRequest.responseType = 'blob';
        HttpRequest.onload = function (e) {
          download(HttpRequest.response, fileName, mimeType);
        };
        HttpRequest.send();
      },

      onRefresh: function () {
        //debugger
        that.localModel.setData(null);


        that.getView().byId("messagePopoverBtn").setVisible(false);

        that.getView().byId("Table1").setVisibleRowCount(0);
       

        this.getView().byId("oCountLocalModel").setVisible(false);
     
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
          error: function (e) {
            ////debugger
            BusyIndicator.hide();
            MessageBox.error(e.responseText);
          }
        });

      },
      shipdetail: function () {
        //debugger
     BusyIndicator.show(0);
        var suppQuo = "1100013"
        var oFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, suppQuo);
        that.oDataModel.read("/SHIPTOSet", {
            filters: [oFilter],
            success: function (oData, resp) {
                //debugger
                BusyIndicator.hide(0);
                var ship = new JSONModel(oData);
                that.getOwnerComponent().setModel(ship, "shipDetail");

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
			shiptype = this.getView().byId("shiftdetail").getSelectedKey();
			shipname = this.getView().byId("shiftdetail").mAggregations.items[0].mProperties.text

      // var shipset = new JSONModel(shipname);
      // that.getOwnerComponent().setModel(shipset, "setship");

			if(shipname){
				that.getView().byId("shiftdetail").setValueState(sap.ui.core.ValueState.None)
			}
			


		},
      headerData: function () {
        //debugger

        var suppQuo = "1100013"
        var oFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, suppQuo);
        that.oDataModel.read("/PTERMSet", {
          filters: [oFilter],
          success: function (oData, resp) {
            //debugger
            var ship1 = new JSONModel(oData);
            that.getView().setModel(ship1, "headerData");
            paymen_method = that.getView().getModel("headerData").getData().results[0].Zterm

          },
          error: function (error) {
            //debugger
            BusyIndicator.hide();
            sap.m.MessageToast.show("Cannot load ship detail");
          }

        });

      },
      readCategories: function () {
        //debugger

        // var oFilter = new sap.ui.model.Filter("MaterialCode", sap.ui.model.FilterOperator.EQ, materialcode);
        that.oDataModel.read("/MaterialGroupsSet", {
          urlParameters: {
            $expand: "NavMaterialSet"
          },
          // filters: [oFilter],
          success: function (oData, resp) {
            //debugger
          
            BusyIndicator.hide();

           var excelUploda = that.getOwnerComponent().getModel("localModel").getData();

            for(var i = 0; i<excelUploda.length;i++){
              var item = {
                MaterialCode: excelUploda[i].MATERIAL_CODE,
                MaterialDes:excelUploda[i].MATERIAL_DES,
                Quantity:excelUploda[i].QUANTITY

              }
              newEntry.push(item);
            }
            
             tabledata = new JSONModel(newEntry);
            that.getOwnerComponent().setModel(tabledata, "tModel");

            var retailerData= that.getOwnerComponent().getModel("tModel").getData()

            // var tax = Number(newEntry.Cgst_per) + Number(newEntry.Sgst_per);
            //         var calTax=tax/100;
            //       var total = (Number(newEntry.NetPrice) * Number(Materialqyt)) +  ((Number(newEntry.NetPrice) * Number(Materialqyt))* calTax)

            that.getView().byId("Table1").setVisibleRowCount(newEntry.length)

            for (let a = 0; a < retailerData.length; a++) {
              var qunty= (retailerData[a].Quantity)
              var suppQuo = retailerData[a].MaterialCode;
              var materialcode = "00000000" + suppQuo;
              var aData = oData.results
              for (var i = 0; i < aData.length; i++) {
                for (var j = 0; j < aData[i].NavMaterialSet.results.length; j++) {
                  if (materialcode === aData[i].NavMaterialSet.results[j].MaterialCode) {

                    retailerData[a].NetPrice = aData[i].NavMaterialSet.results[j].NetPrice
                    retailerData[a].Uom = aData[i].NavMaterialSet.results[j].Uom
                    retailerData[a].ImageUrl = aData[i].NavMaterialSet.results[j].ImageUrl;
                    retailerData[a].Cgst_per = aData[i].NavMaterialSet.results[j].Cgst_per
                    retailerData[a].Sgst_per = aData[i].NavMaterialSet.results[j].Sgst_per
                    retailerData[a].Igst_per = aData[i].NavMaterialSet.results[j].Igst_per
                    retailerData[a].tax = (Number(aData[i].NavMaterialSet.results[j].Cgst_per) + Number(aData[i].NavMaterialSet.results[j].Sgst_per)).toString()
                    retailerData[a].total=(Number(aData[i].NavMaterialSet.results[j].NetPrice) * Number(qunty)) +  ((Number(aData[i].NavMaterialSet.results[j].NetPrice) * Number(qunty))* 0.18)
                  }
                }
              }
            }

          },
          error: function (error) {
            //debugger
            BusyIndicator.hide();
            sap.m.MessageToast.show("Cannot load Categories " + JSON.stringify(error));
          }

        });
      },

      handleValueGroupHelp: function () {
        //debugger
        if (!this.grpFragment) {
          this.grpFragment = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorder.view.fragments.grpFragment", this);
          this.getView().addDependent(this.grpFragment);
          //this._delvrTemp = sap.ui.getCore().byId("delvrTempId").clone();
        }

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
      handleValueProductHelp: function () {
        //debugger
        if (!this.prodFragment) {
          this.prodFragment = sap.ui.xmlfragment("com.ibs.ibsappidealsalesorder.view.fragments.proFragment", this);
          this.getView().addDependent(this.prodFragment);
          //this._delvrTemp = sap.ui.getCore().byId("delvrTempId").clone();
        }
  
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

      MaterialSelection1: function (oEvent) {
        //debugger
        var sameProductFlag= false
        // grpSelected = oEvent.mParameters.selectedItem.mProperties.description
        // grupId = oEvent.mParameters.selectedItem.mProperties.
        this.getView().byId("excelorder").setEnabled(true)
        productgroup = oEvent.getSource().getSelectedItem().getBindingContext("material").getObject().MaterialCode
        productSelectd = oEvent.getSource().getSelectedItem().getBindingContext("material").getObject().MaterialDes
        this.getView().byId("id_Item").setValue(productSelectd)

      

        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);
        var userrole = that.getOwnerComponent().getModel("userrole").getData()
        var userdetails = that.getView().getModel("userModel").getData();
        that.getView().byId("id_Grp").setValue("")
        that.getView().byId("id_Item").setValue("")
         
         var newEntry1;
        oDataModel2.read("/MaterialGroupsSet", {
          urlParameters: {
              $expand: "NavMaterialSet"
          },
          // filters: [Filter1],
          success: function (oData, oResponse) {
              //debugger;
              var dupItemsArr = [];
              BusyIndicator.hide()
              var model = new JSONModel(oData);
              that.getView().setModel(model, "selectedProd");
              var allData = that.getView().getModel("selectedProd").getData()

              for (let i = 0; i < allData.results.length; i++) {
              
                for (let k = 0; k < allData.results[i].NavMaterialSet.results.length; k++) {
      
                    if (allData.results[i].NavMaterialSet.results[k].MaterialDes === productSelectd) {
      
                        newEntry1 = allData.results[i].NavMaterialSet.results[k];
                        newEntry1.Quantity=1;
                        newEntry1.tax=18;
                        newEntry1.total=(Number(newEntry1.NetPrice) * Number(newEntry1.Quantity)) +  ((Number(newEntry1.NetPrice) * Number(newEntry1.Quantity))* 0.18);

                        // newEntry.push(newEntry1)
                         
                    }
                }
            }
     
            proaddTable=that.getOwnerComponent().getModel("tModel").getData().length

          if(proaddTable === undefined){   
            newEntry.push(newEntry1)
            tabledata = new JSONModel(newEntry);
            that.getOwnerComponent().setModel(tabledata, "tModel");
            that.getView().byId("Table1").setVisibleRowCount(newEntry.length)
            that.closeContactCountryDialog1()
          }else if(proaddTable > 0) {

            dupItemsArr = tabledata.oData.filter(function(a,index){
              //debugger;
              if(a["MaterialDes"] == newEntry1.MaterialDes){
                return a;
              }
            },Object.create(null));

            var abc = dupItemsArr;
            //debugger
            if(dupItemsArr.length === 0){
              newEntry.push(newEntry1)    
              tabledata = new JSONModel(newEntry);
              that.getOwnerComponent().setModel(tabledata, "tModel");
              that.getView().byId("Table1").setVisibleRowCount(newEntry.length);
            }else {
              MessageBox.error("Material is already present, please update the quantity below table");
            that.closeContactCountryDialog1()
            }
            
            that.closeContactCountryDialog1();
            // for (let i = 0; i < tabledata.oData.length; i++) {
              // if (newEntry1.MaterialDes === tabledata.oData[i].MaterialDes) {
              //     sameProductFlag = true;
                  
              // }

        //   }if(sameProductFlag === true){
        //     MessageBox.error("Material is already present, please update the quantity below table");
        //     this.closeContactCountryDialog1()
        //   } else if (sameProductFlag === false){
        //     newEntry.push(newEntry1)    
        //     tabledata = new JSONModel(newEntry);
        //     that.getOwnerComponent().setModel(tabledata, "tModel");
        //     that.getView().byId("Table1").setVisibleRowCount(newEntry.length)
        //     that.closeContactCountryDialog1()
        // }
          } 
          

            // if (sameProductFlag === true){
            //   MessageBox.error("Material is already present, please update the quantity below table")
            // }else {
            //   newEntry.push(newEntry1)
            // tabledata = new JSONModel(newEntry);
            // that.getOwnerComponent().setModel(tabledata, "tModel");
            // that.getView().byId("Table1").setVisibleRowCount(newEntry.length)
            // that.closeContactCountryDialog1()

            // }



          }
        })

      
        // this.closeContactCountryDialog1()
        //  this.getView().byId("id_Item").setValue(grpSelected.title)

    },
    closeContactCountryDialog1: function () {
      //debugger
      this.prodFragment.close();
      this.prodFragment.destroy();
      this.prodFragment = null;
  },
      onSubmitData: function () {
        debugger
        // BusyIndicator.show()
       
        var addressFetchArr = [];

    if(!shipname){
        BusyIndicator.hide()
        MessageBox.warning("Please add ship to details");
        that.getView().byId("shiftdetail").setValueState(sap.ui.core.ValueState.Error);
      } else if( that.localModel ){
      this.ExcelSubmission();
       }
      else if(!grpSelected){
        BusyIndicator.hide()
        MessageBox.warning("Please add ship to Material group");
      }else if (!productSelectd){
        // BusyIndicator.hide()
        MessageBox.warning("Please add ship to Material");
      }
       else if( grpSelected && productSelectd ) {
        // BusyIndicator.hide()
      this.ExcelSubmission()
        }  
      },

  

      ExcelSubmission : function(){
        //debugger
        var router = sap.ui.core.UIComponent.getRouterFor(that);
                    router.navTo("detailPage", {
                      "loginId": prno,
                      FLAG: true
                      
                    });
      },

        // ExcelSubmission : function(){
        //   //debugger
        //   BusyIndicator.show()
        //   var userrole = that.getOwnerComponent().getModel("userrole").getData()
        //   var userdetails = that.getView().getModel("userModel").getData();
        //   retailerData = that.getOwnerComponent().getModel("tModel").getData();
        //   var itemsData = []
        //   for (let i = 0; i < retailerData.length; i++) {
        //     var structureData = {
        //       "PR_NO": 1,
        //       "PR_ITEM_NO": 1,
        //       "MATERIAL_CODE": retailerData[i].MaterialCode,
        //       "MATERIAL_DESC": retailerData[i].MaterialDes,
        //       "IMAGE_URL": retailerData[i].ImageUrl,
        //       "HSN_CODE": "999999",
        //       "UNIT_OF_MEASURE": retailerData[i].Uom,
        //       "QUANTITY": Number(retailerData[i].Quantity),
        //       "FREE_QUANTITY": null,
        //       "STD_PRICE": null,
        //       "BASE_PRICE": null,
        //       "DISC_AMOUNT": null,
        //       "DISC_PERC": null,
        //       "NET_AMOUNT": retailerData[i].NetPrice,
        //       "TOTAL_AMOUNT": retailerData[i].total.toString(),
        //       "CGST_PERC": retailerData[i].Cgst_per,
        //       "CGST_AMOUNT": null,
        //       "SGST_PERC": retailerData[i].Sgst_per,
        //       "SGST_AMOUNT": null,
        //       "IGST_PERC": retailerData[i].Igst_per,
        //       "IGST_AMOUNT": null,
        //       "TAXES_AMOUNT": retailerData[i].tax.toString()

        //     }
        //     itemsData.push(structureData);
        //   }
        //   var gprocts = 0
        //   for (let i = 0; i < retailerData.length; i++) {
        //     gprocts += Number(retailerData[i].total)

        //   }
        //   var oPayload = {
        //     "action": "CREATE",
        //     "appType": "PR",
        //     "prHeader": [{
        //       "PR_NO": 1,
        //       "SAP_SO_NO": null,
        //       "PR_CREATION_DATE": null,
        //       "DISTRIBUTOR_ID": prno.toString(),
        //       "DISTRIBUTOR_NAME": "Star Enterprize",
        //       "SHIP_TO": shiptype,
        //       "SHIP_NAME": shipname,
        //       "BILL_TO": null,
        //       "ORDER_TYPE": null,
        //       "PAYMENT_METHOD": paymen_method,
        //       "REGION_CODE": null,
        //       "PR_STATUS": "1",
        //       "LAST_UPDATED_DATE": null,
        //       "APPROVER_LEVEL": null,
        //       "APPROVER_ROLE": null,

        //       "GRAND_TOTAL": gprocts.toString()

        //     }],
        //     "prCart": [],
        //     "prItems": itemsData,
        //     "prEvent": [{
        //       "PR_NO": 1,
        //       "EVENT_NO": 1,
        //       "EVENT_CODE": "1",
        //       "USER_ID": "starenterprize@gmail.com",
        //       "USER_ROLE": "DIST",
        //       "USER_NAME": "Star Enterprize",
        //       "COMMENTS": "Purchase Request Created",
        //       "CREATION_DATE": null
        //     }],
        //     "userDetails": {
        //       "USER_ROLE": "DIST",
        //       "USER_ID": "starenterprize@gmail.com"
        //     }
        //   }

        //   oPayload = JSON.stringify(oPayload)
        //   var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
        //   $.ajax({
        //     type: "POST",
        //     url: surl,
        //     data: oPayload,
        //     contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     success: function (result) {
        //       //debugger;
        //       BusyIndicator.hide();
        //       MessageBox.success(result.value.OUT_SUCCESS, {
        //         actions: [MessageBox.Action.OK],
        //         emphasizedAction: MessageBox.Action.OK,
        //         onClose: function (oAction) {
        //           if (oAction === 'OK') {
        //             //debugger
        //             newEntry=[];
        //             tabledata.setData(null)
        //             that.getView().byId("excelorder").setEnabled(false)
        //             that.getView().byId("shiftdetail").setValue("")
        //             that.getView().byId("id_Grp").setValue("")
        //             that.getView().byId("id_Item").setValue("")
        //             that.getView().byId("notes").setValue("")
        //             // this.getView().byId("shiftdetail").setValue("");
        //             var router = sap.ui.core.UIComponent.getRouterFor(that);
        //             router.navTo("RouteView1", {
        //               "loginId": prno
        //             });
        //             that.localModel.setData(null);
        //             that.onRefresh();

        //           }
        //         }
        //       }
        //       );
        //     },

        //     error: function (oError) {
        //       //debugger;
        //       BusyIndicator.hide();
        //       MessageBox.error(oError.responseText);

        //     }

        //   });

        // },


      navigateToView1 : function(){
        //debugger
        var g = this.getView().getParent().getParent();
                g.toBeginColumnPage(this.getView())

                this.getView().byId("notes").setValue("")
                that.getView().byId("shiftdetail").setValueState(sap.ui.core.ValueState.None)
                this.getView().byId("excelorder").setEnabled(false)
        that.getView().byId("shiftdetail").setValue("")
        that.getView().byId("id_Grp").setValue("")
        that.getView().byId("id_Item").setValue("")
        proaddTable=[]
        shipname=null
        if (tabledata === undefined) {
          var router = sap.ui.core.UIComponent.getRouterFor(that);
          router.navTo("RouteView1", {
            "loginId": prno
          });
      }else {
        // that.localModel.setData(null);
        shipname=null
        proaddTable=[]
        newEntry=[];
        tabledata.setData(null)
        that.getView().byId("shiftdetail").setValue("")
        that.getView().byId("id_Grp").setValue("")
        that.getView().byId("id_Item").setValue("")
        var router = sap.ui.core.UIComponent.getRouterFor(that);
        router.navTo("RouteView1", {
          "loginId": prno
        });
      }
    },

    quantityChange : function(oEvent){
     //debugger
     BusyIndicator.show();
      var RowData=oEvent.getSource().getBindingContext("tModel").getObject();
      var newquntity=RowData.Quantity;
        var calTax=RowData.tax/100;
      var caltotal = (Number(RowData.NetPrice) * Number(newquntity)) +  ((Number(RowData.NetPrice) * Number(newquntity))* calTax)
      // that.getView().getModel("tModel").setProperty("/total", total)
      RowData.total=caltotal
      BusyIndicator.hide();

    },


    onDelete: function (oEvent) {
      //debugger
      MessageBox.information("Are you sure you want to delete the Material ?", {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (Action) {
              if (Action === "YES") {
                  //debugger
                 
                  var oSelectedItem = oEvent.getSource().getParent();
                  var nIndex = oSelectedItem.getParent().indexOfRow(oSelectedItem);
                 
                  var oModel = that.getView().getModel("tModel").getData();
                 
                  oModel.splice(nIndex, 1);
                  that.getView().getModel("tModel").setData(oModel);
                  

                  that.getView().byId("Table1").setVisibleRowCount(newEntry.length)
                  that.getView().getModel("tModel").refresh(true);




              }
          }
      });

  },
    });
  }
);