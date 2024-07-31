// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealpaymentforcast.controller.View1", {
//         onInit: function () {

//         }
//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
],
function (Controller,JSONModel) {
    "use strict";

    return Controller.extend("com.ibs.ibsappidealpaymentforcast.controller.View1", {
        onInit: function () {

            var DataModel = {
				"civilServicesClassified": [{
					"category": "Total Outstanding",
					"day1": "1729904.78",
					"day2": "1729904.78",
					"day3": "1729904.78",
					"day4": "1729904.78",
					"day5": "1729904.78",
					"day6": "1729904.78"
				}, {
					"category": "OverDue",
					"day1": "1729904.78",
					"day2": "1729904.78",
					"day3": "1729904.78",
					"day4": "1729904.78",
					"day5": "1729904.78",
					"day6": "1729904.78"
				}, {
					"category": "Outstanding Eligible For CD",
					"day1": "0",
					"day2": "0",
					"day3": "0",
					"day4": "0",
					"day5": "0",
					"day6": "0"
				}, {
					"category": "CD Amount Eligible",
					"day1": "0",
					"day2": "0",
					"day3": "0",
					"day4": "0",
					"day5": "0",
					"day6": "0"
				}, {
					"category": "Not Due, Not Eligible For CD",
					"day1": "0",
					"day2": "0",
					"day3": "0",
					"day4": "0",
					"day5": "0",
					"day6": "0"
				}],
				"graph": [{
					"day": "18/11/2019",
					"TO": "1729904.78",
					"OD": "1729904.78",
					"OEFCD": "0",
					"CDAE": "0",
					"ND": "0"
				}, {
					"day": "19/11/2019",
					"TO": "1729904.78",
					"OD": "1729904.78",
					"OEFCD": "0",
					"CDAE": "0",
					"ND": "0"
				}, {
					"day": "20/11/2019",
					"TO": "1729904.78",
					"OD": "1729904.78",
					"OEFCD": "0",
					"CDAE": "0",
					"ND": "0"
				}, {
					"day": "21/11/2019",
					"TO": "1729904.78",
					"OD": "1729904.78",
					"OEFCD": "0",
					"CDAE": "0",
					"ND": "0"
				}, {
					"day": "22/11/2019",
					"TO": "1729904.78",
					"OD": "1729904.78",
					"OEFCD": "0",
					"CDAE": "0",
					"ND": "0"
				}, {
					"day": "23/11/2019",
					"TO": "1729904.78",
					"OD": "1729904.78",
					"OEFCD": "0",
					"CDAE": "0",
					"ND": "0"
				}]
			};
			var table = DataModel.civilServicesClassified;
			
			var myJSONModel = new JSONModel();
			myJSONModel.setData(table);
			this.getView().setModel(myJSONModel, "civilServicesClassified");

			this.graph = DataModel.graph;
			this.calculateWeek();
			var myJSONModel1 = new JSONModel();
			myJSONModel1.setData(this.graph);
			this.getView().setModel(myJSONModel1, "graph");

			var oVizFrame = this.getView().byId("idVizFrame");
			if (this.getView().byId("idPopOver")) {
				this.getView().byId("idPopOver").destroy();
				var oName = new sap.viz.ui5.controls.Popover(this.createId("idPopOver"));
				this.oPopOver = this.getView().byId("idPopOver");
				this.oPopOver.connect(oVizFrame.getVizUid());
			} else {
				var oName = new sap.viz.ui5.controls.Popover(this.createId("idPopOver"));
				this.oPopOver = this.getView().byId("idPopOver");
				this.oPopOver.connect(oVizFrame.getVizUid());
			}


        },
        selection: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("PaymentForecastDetails");
		},
		calculateWeek: function () {
			 debugger;
			var curr = new Date(); // get current date
			var cDay = curr.getDay();
			var fTime = 1000 * 60 * 60 * 24*Number(cDay-1);
			var pTime = curr.getTime();
			var SDate = new Date(pTime-fTime);
			for (var i = 0;i<=5;i++) {
				var tm = SDate.getTime();
				var dd = SDate.getDate();
				var mm = SDate.getMonth() + 1;
				var yyyy = SDate.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				var d = dd + '/' + mm + '/' + yyyy;
				var day = SDate.toString().substring(0, 3);
				var tableheader = this.getView().byId('date' + (i + 1));
				if(tableheader !== undefined){
					tableheader.setText(d + "(" + day + ")");
				}
				SDate=new Date(tm+86400000);
				this.graph[i].day = d;
				if(i==0){
					this.startDate = d;	
				}
			}
        }
    });
});

