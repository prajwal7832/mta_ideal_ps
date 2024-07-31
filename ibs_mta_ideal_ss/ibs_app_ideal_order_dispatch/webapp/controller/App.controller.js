// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("com.ibs.ibsappidealorderdispatch.controller.App", {
//         onInit: function() {
//         }
//       });
//     }
//   );


sap.ui.define(
  [
      "sap/ui/core/mvc/Controller"
  ],
  function(BaseController) {
    "use strict";
    var that = null;
    var appModulePath;

    return BaseController.extend("com.ibs.ibsappidealorderdispatch.controller.App", {
      onInit: function() {
        that = this;
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        appModulePath = jQuery.sap.getModulePath(appPath);

        var oRouter = this.getOwnerComponent().getRouter().getRoute("RouteApp");
        oRouter.attachPatternMatched(this.handleRouteMatched, this);
        // this.handleRouteMatched();
      },
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      handleRouteMatched: function (oEvent) {
        debugger
        var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerSoHeader";
        $.ajax({
          url: url,
          type: 'GET',
          contentType: 'application/json',
          success: function (data, response) {
            debugger
            if(data.value[0].Cloud !== null && data.value[0].onPremise !== null){
                that.getRouter().navTo("RouteMasterpage");
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

  