// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("com.ibs.ibsappidealidealpaymentcreation.controller.App", {
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
    return BaseController.extend("com.ibs.ibsappidealidealpaymentcreation.controller.App", {
      onInit: function() {
        // debugger
        that = this;
        var oViewModel = new JSONModel({
          layout: "OneColumn",
          icon:"sap-icon://full-screen",
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
        this.handleRouteMatched();
      },

      getRouter: function () {
      
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      
    handleRouteMatched: function (oEvent) {
      // debugger;
      
        var that = this;
        var oCloud = true;
        var oPremise = false;
        var url = appModulePath + "/odata/v4/ideal-additional-process-srv/checkServiceAvailability(cloudSrv=" + oCloud + ",onPremiseSrv=" + oPremise + ")";
       
        $.ajax({
          url: url,
          type: 'GET',
          contentType: 'application/json',
          success: function (data, response) {
            // debugger
            if(oCloud === true && data.value[0].cloudSrv !== null) {
              // that.getRouter().navTo("RouteView1");
              that._getLoginDetails();
            }
            else if(oCloud === true && data.value[0].cloudSrv !== null) {
              // that.getRouter().navTo("RouteView1");
              that._getLoginDetails()
            }
            else if(oCloud === false) {
              // that.getRouter().navTo("RouteView1");
              that._getLoginDetails()
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

    _getLoginDetails: function () {
      //debugger;
    // $.get("/services/userapi/attributes").done(function (results) {
      // sLoginId = results.login_name;
      // sLoginTypez = results.user_type;
     var sLoginId = '1100013';
      // sLoginType = 'partner';
      // this._user();
      that.getRouter().navTo("RouteMasterPage",{
        "loginId" : sLoginId
      })
    //  var loginDetail = new sap.ui.model.json.JSONModel(sLoginId);
    //  that.getView().setModel(loginDetail, "loginID");
    // }.bind(this));
  },


    });
  }
);
