// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("com.ibs.ibsappidealordercreation.controller.App", {
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
    var that,context,oViewModel,getHashChanger,oValue,appModulePath;

    return BaseController.extend("com.ibs.ibsappidealordercreation.controller.App", {
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
            layout : "EndColumnFullScreen",
            previousLayout : "",
            actionButtonsInfo : {
                midColumn : {
                    fullScreen : false
                }
            },
            oFilterBarVisible:true
        });
        }
        else if(getHashChanger === "Order_Creation"){
          oViewModel = new JSONModel({
            busy : true,
            delay : 0,
            layout : "MidColumnFullScreen",
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
        debugger
        var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerSoHeader";
        $.ajax({
          url: url,
          type: 'GET',
          contentType: 'application/json',
          success: function (data, response) {
            debugger
            if(data.value[0].Cloud !== null && data.value[0].onPremise !== null){
              if(getHashChanger === "Order_Creation"){
                that.getRouter().navTo("RouteCreationpage");
              }
              else if(getHashChanger === "detailpage"){
                that.getRouter().navTo("RouteDetailpage",{
                  SO_NO:oValue
                });
              }
              else{
                that.getRouter().navTo("RouteMasterPage");
              }
            }
            // else if(oCloud === true && oPremise === false && data.value[0].cloudSrv !== null) {
            //   if(getHashChanger === "RouteCreationpage"){
            //     that.getRouter().navTo("RouteCreationpage");
            //   }
            //   else if(getHashChanger === "RouteDetailpage"){
            //     that.getRouter().navTo("RouteDetailpage",{
            //       SO_NO:oValue
            //     });
            //   }
            //   else{
            //     that.getRouter().navTo("RouteMasterPage");
            //   }
            // }
            // else if(oCloud === false && oPremise === true && data.value[0].onPremiseSrv !== null) {
            //   if(getHashChanger === "RouteDetailPage"){
            //     that.getRouter().navTo("RouteDetailPage", {
            //       REQUESTNO: oValue
            //     });
            //   }
            //   else{
            //     that.getRouter().navTo("RouteMasterPage");
            //   }
            // }
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

  