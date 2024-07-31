sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, History) {
	"use strict";

	return Controller.extend("com.ibs.ibsappidealpaymentforcast.controller.PaymentForecastDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.cm.customerportal.PaymentForecast.view.PaymentForecastDetails
		 */
		onInit: function () {
			this.calculateWeek();
			var oModel = new JSONModel();

			// JSON sample data
			var oData = {
				modelData: [{
					"startDate": "04/11/2019",
					"Invoice No": "2005034430",
					"PL": "",
					"Invoice Date": "05/27/2019",
					"Amount": "6159.09-",
					"Due Date": "05/27/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "6159.09-",
						"Overdue": "6159.09-",
						"Overdue Days": "131"
					}
				}, {
					"startDate": "04/11/2019",
					"Invoice No": "2005034937",
					"PL": "",
					"Invoice Date": "05/27/2019",
					"Amount": "22951.62-",
					"Due Date": "05/27/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "22951.62-",
						"Overdue": "22951.62-",
						"Overdue Days": "131"
					}
				}, {
					"startDate": "04/11/2019",
					"Invoice No": "614004030",
					"PL": "Appliances",
					"Invoice Date": "05/28/2019",
					"Amount": "224768.00-",
					"Due Date": "05/28/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "224768.00-",
						"Overdue": "224768.00-",
						"Overdue Days": "130"
					}
				}, {
					"startDate": "04/11/2019",
					"Invoice No": "414026720",
					"PL": "Lighting B2C",
					"Invoice Date": "05/29/2019",
					"Amount": "46493.29",
					"Due Date": "07/10/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "46493.29",
						"Overdue": "46493.29",
						"Overdue Days": "87"
					}
				}, {
					"startDate": "04/11/2019",
					"Invoice No": "414026911",
					"PL": "Lighting B2C",
					"Invoice Date": "05/30/2019",
					"Amount": "311887.02",
					"Due Date": "07/11/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "311887.02",
						"Overdue": "311887.02",
						"Overdue Days": "86"
					}
				}, {
					"startDate": "04/11/2019",
					"Invoice No": "414027016",
					"PL": "Fans",
					"Invoice Date": "05/30/2019",
					"Amount": "47439.58",
					"Due Date": "06/13/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "47439.58",
						"Overdue": "47439.58",
						"Overdue Days": "114"
					}
				}, {
					"startDate": "04/11/2019",
					"Invoice No": "2005038072",
					"PL": "",
					"Invoice Date": "05/30/2019",
					"Amount": "505111.09-",
					"Due Date": "05/30/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "505111.09-",
						"Overdue": "505111.09-",
						"Overdue Days": "128"
					}
				}, {
					"startDate": "04/11/2019",
					"Invoice No": "410037420",
					"PL": "Lighting B2C",
					"Invoice Date": "05/31/2019",
					"Amount": "271896.31",
					"Due Date": "07/12/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "271896.31",
						"Overdue": "271896.31",
						"Overdue Days": "85"
					}
				}, {
					"startDate": "04/11/2019",
					"Invoice No": "412037397",
					"PL": "Fans",
					"Invoice Date": "05/31/2019",
					"Amount": "397873.26",
					"Due Date": "06/14/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "397873.26",
						"Overdue": "397873.26",
						"Overdue Days": "113"
					}
				}, {
					"startDate": "04/11/2019",
					"Invoice No": "414027042",
					"PL": "Fans",
					"Invoice Date": "05/31/2019",
					"Amount": "12739.68",
					"Due Date": "06/14/2019",
					"day1": {
						"Discount %": "",
						"Cash Discount": "",
						"Net Amount Payable": "12739.68",
						"Overdue": "12739.68",
						"Overdue Days": "113"
					}
				}]
			};
			
			// var table = oData.modelData;
			// var aJSON = [];
			// var myJSONModel = new JSONModel();
			// for (var i = 0; i < table.length; i++) {
			// 	if (table[i].startDate === this.startDate) {
			// 		aJSON.push(table[i]);
			// 	}
			// }
			// myJSONModel.setData(aJSON);
			// this.getView().setModel(myJSONModel.oData, "modelData");
			
			// set the data for the model
			oModel.setData(oData);
			var oView = this.getView();
			// // set the model to the core
			oView.setModel(oModel);

			oView.byId("multiheader1").setHeaderSpan([5, 1]);
			oView.byId("multiheader2").setHeaderSpan([5, 1]);
			oView.byId("multiheader3").setHeaderSpan([5, 1]);
			oView.byId("multiheader4").setHeaderSpan([5, 1]);
			oView.byId("multiheader5").setHeaderSpan([5, 1]);
			oView.byId("multiheader6").setHeaderSpan([5, 1]);
		},
		onNavBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteView1");
		},
		calculateWeek: function () {
			debugger;
			var curr = new Date(); // get current date
			// curr.setDate(10);
			var first = curr.getDate() - curr.getDay() + 1;
			var last = first + 5; // last day is the first day + 6
			for (var i = 5; i >= 0; i--) {
				var day6 = new Date(curr.setDate(last));
				var dd = day6.getDate();
				var mm = day6.getMonth() + 1;
				var yyyy = day6.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				var d = dd + '/' + mm + '/' + yyyy;
				var day = day6.toString().substring(0, 3);
				this.getView().byId('date' + (i + 1)).setText(d + "(" + day + ")");
				curr = new Date();
				// curr.setDate(10);
				last -= 1;
			}
			this.startDate = d;
		}

	});

});