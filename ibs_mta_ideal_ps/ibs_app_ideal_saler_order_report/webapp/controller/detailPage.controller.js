sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "com/ibs/ibsappidealsalerorderreport/model/formatter",
        "sap/m/MessageBox",
        'sap/ui/core/BusyIndicator'
    ],
    function(BaseController,JSONModel,formatter,MessageBox,BusyIndicator) {
      "use strict";
     var previousData,prno;
     var that;
     var myJSONModel12;
     var userdetails,headerData,R_status;
      return BaseController.extend("com.ibs.ibsappidealsalerorderreport.controller.detailPage", {
        formatter: formatter,
        onInit: function() {
          //debugger
          BusyIndicator.hide()
         that=this
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("detailPage").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched : function(){
          //debugger
          BusyIndicator.hide()
         previousData =this.getOwnerComponent().getModel("orderDetails").getData()
        userdetails = that.getView().getModel("userModel").getData()
         R_status=previousData.TO_STATUS.CODE
          var model= new JSONModel(previousData)
           this.getOwnerComponent().setModel(model, "selectOrderData");
           this.visible()
           this.tabledata();
           this.processflow();
           this.userrole();
          
                     
        },

        tabledata : function(){
          //debugger

        prno =Number(previousData.PR_NO)
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          var appModulePath = jQuery.sap.getModulePath(appPath);
          var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrItems?$filter=PR_NO eq " + prno + "";
         

          $.ajax({
              url: url,
              type: 'GET',
              data: null,
              contentType: 'application/json',
              success: function (data, responce) {
                  //debugger
                
                  var tableitems = new JSONModel(data);
                  that.getView().setModel(tableitems, "iModel");
                 
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
          
      },
        

      processflow : function(){
            debugger

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            myJSONModel12 = new JSONModel();
            var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrEventLog?$expand=TO_EVENT_STATUS&$filter=PR_NO eq " + prno + "";
    
            $.ajax({
                url: url,
                type: "GET",
                contentType: 'application/json',
                data: null,
                success: function (data, response) {
                    debugger;
                    // BusyIndicator.hide();
                    // that.getView().byId("DynamicSideContent").setShowSideContent(true);
                    // context.handleEvents();
    
                    for (var i = 0; i < data.value.length; i++) {
                        data.value[i].CREATED_ON = new Date(data.value[i].CREATED_ON);
                    }
    
                    for (var i = 0; i < data.value.length; i++) {
                        data.value[i].LANE_ID = i;
                        if(i === 0){
                          data.value[i].NODE_ID = 1;
                          var val = 1 + "0";
                          data.value[i].CHILDREN = [Number(val)];
                        }else{
                          var val = i + "0";
                          data.value[i].NODE_ID = Number(val);
                          var j = i + 1;
                          var child = j + "0";
                          data.value[i].CHILDREN = [Number(child)];
                        }
    
                        if(i === data.value.length-1){
                          data.value[i].CHILDREN = null;
                        }
                    }
    
    
                    var oModel = new JSONModel(data.value);
                    myJSONModel12.setData(data.value);
                    that.getView().setModel(oModel, "comm");
    
                    // that.onSideContent("REGAPPR_EVENT");
                    that.getView().byId("processflow1").setWheelZoomable(true);
                },
                error: function (error) {
                    // //debugger;
                    BusyIndicator.hide();
                    var oXML,oXMLMsg;
                    // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                    if (context.isValidJsonString(error.responseText)) {
                        oXML = JSON.parse(error.responseText);
                        oXMLMsg = oXML.error["message"];
                    } else {
                        oXMLMsg = error.responseText
                    }
                    MessageBox.error(oXMLMsg);
                    // MessageBox.error(e.responseText);
                }
            });
          },
          onZoomIn: function () {
            this.getView().byId("processflow1").zoomIn();
    
           
        },
        onZoomOut: function () {
            this.getView().byId("processflow1").zoomOut();
    
        
        }, 
        visible :function(){
            //debugger
                if(R_status === 2){
                    this.getView().byId("id_cnaBTn").setVisible(false)
                } else if(R_status === 3){
                    this.getView().byId("id_cnaBTn").setVisible(false)
                } else if(R_status === 5){
                    this.getView().byId("id_cnaBTn").setVisible(false)
                }
                else{
                    this.getView().byId("id_cnaBTn").setVisible(true) 
                }
        },
        RejectOrder: function (oEvent) {
          ////debugger
          if (!this.reject) {
              this.reject = sap.ui.xmlfragment("com.ibs.ibsappidealsalerorderreport.view.fragments.reject", this);
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
        // this.CancelOrder1();
        // BusyIndicator.show()

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
                // BusyIndicator.hide()
                that.CancelOrder1()
                MessageBox.success(result.value.OUT_SUCCESS, {
                    actions: [MessageBox.Action.OK],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (oAction) {
                        if (oAction === 'OK') {
                            //debugger
                            that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                            var router = sap.ui.core.UIComponent.getRouterFor(that);
                            router.navTo("RouteMasterPage")
                            
                            
                        }
                    }
                }
                );

            },

            error: function (oError) {
                //debugger;
                BusyIndicator.hide()
              
                MessageBox.error(JSON.parse(oError.responseText).error.message)


            }
        });

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
              //debugger
              BusyIndicator.hide()
              // MessageBox.error(e.responseText);
              MessageBox.error(JSON.parse(oError.responseText))

          }
      });

  },

      });
    }
  );