// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("com.ibs.ibsappidealsalesorderapproval.controller.App", {
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
    var that = null;
    var appModulePath;
    return BaseController.extend("com.ibs.ibsappidealsalesorderapproval.controller.App", {
      onInit: function() {
        //debugger
        that = this;
        var oViewModel = new JSONModel({
          layout: "OneColumn",
          previousLayout: "",
          actionButtonsInfo: {
            midColumn: {
              fullScreen: false
            }
          }
        });
        this.getView().setModel(oViewModel, "appView");

        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        appModulePath = jQuery.sap.getModulePath(appPath);

        // var oRouter = this.getOwnerComponent().getRouter().getRoute("RouteApp");
        // oRouter.attachPatternMatched(this.handleRouteMatched, this);
        // that.handleRouteMatched();
        that.handleRouteMatched();
      },
      getRouter: function () {
      
        return sap.ui.core.UIComponent.getRouterFor(this);
      },
    handleRouteMatched: function (oEvent) {
      //debugger;
      
        var that = this;
        var oCloud = true;
        var oPremise = false;
        var url = appModulePath + "/odata/v4/ideal-additional-process-srv/checkServiceAvailability(cloudSrv=" + oCloud + ",onPremiseSrv=" + oPremise + ")";
       
        $.ajax({
          url: url,
          type: 'GET',
          contentType: 'application/json',
          success: function (data, response) {
            //debugger
            if(oCloud === true && oPremise === true && data.value[0].cloudSrv !== null) {
              that.getRouter().navTo("RouteView1");
              // that._getLoginDetails();
            }
            else if(oCloud === true && oPremise === false && data.value[0].cloudSrv !== null) {
              that.getRouter().navTo("RouteView1");
              // that._getLoginDetails()
            }
            else if(oCloud === false && oPremise === true) {
              that.getRouter().navTo("RouteView1");
              // that._getLoginDetails()
            }
            else {
              that.getRouter().navTo("ServiceMsg");
            }
          },
          error: function (oError) {
            that.getRouter().navTo("ServiceMsg");
          }
        });
    },



    });
  }
);
  