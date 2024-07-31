// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("com.ibs.ibsappidealgrn.controller.App", {
//         onInit: function() {
//         }
//       });
//     }
//   );
  

sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel"
  ],
  function(BaseController,JSONModel) {
    "use strict";
    var that,context,oViewModel,appModulePath,getHashChanger,oValue;

    return BaseController.extend("com.ibs.ibsappidealgrn.controller.App", {
      onInit: function() {
        that = this;
        context = this;
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        appModulePath = jQuery.sap.getModulePath(appPath);

        getHashChanger =  this.getOwnerComponent().getRouter().getHashChanger().hash.split("/")[0];

        if(getHashChanger === "detailpage"){
          oValue = Number(this.getOwnerComponent().getRouter().getHashChanger().hash.split("/")[1]);
          oViewModel = new JSONModel({
            busy : true,
            delay : 0,
            layout : "TwoColumnsMidExpanded",
            previousLayout : "",
            actionButtonsInfo : {
                midColumn : {
                    fullScreen : false
                }
            },
            oFilterBarVisible:true
        });
        }
        else if(getHashChanger === "ServiceMsg"){
          
        }
        else{
          oViewModel = new JSONModel({
            busy : true,
            delay : 0,
            layout : "OneColumn",
            previousLayout : "",
            actionButtonsInfo : {
                midColumn : {
                    fullScreen : false
                }
            },
            oFilterBarVisible:true
        });
      }
        this.getOwnerComponent().setModel(oViewModel, "appView");
        this.handleRouteMatched();
      },
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(that);
      },
      handleRouteMatched: function (oEvent) {
        var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Header";
        $.ajax({
          url: url,
          type: 'GET',
          contentType: 'application/json',
          success: function (data, response) {
            if(data.value[0].Cloud !== null && data.value[0].onPremise !== null){
               if(getHashChanger === "detailpage"){
                that.getRouter().navTo("RouteDetailpage",{
                  InvoiceNo:oValue
                });
              }
              else{
                that.getRouter().navTo("RouteMasterPage");
              }
            }
           
            else {
              that.getRouter().navTo("ServiceMsg");
            }
          },
          error: function (oError) {
            
            that.getRouter().navTo("ServiceMsg");
          }
        });
      }
    });
  }
);
