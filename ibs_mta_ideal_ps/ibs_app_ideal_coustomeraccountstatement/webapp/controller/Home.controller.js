// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealcoustomeraccountstatement.controller.Home", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
	"sap/m/MessageToast",
	"com/ibs/ibsappidealcoustomeraccountstatement/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
],
function (Controller,MessageBox,MessageToast,formatter,Filter,FilterOperator,JSONModel,BusyIndicator) {
    "use strict";
    var _timeout;
	var oTable;
    return Controller.extend("com.ibs.ibsappidealcoustomeraccountstatement.controller.Home", {
		formatter: formatter,
        onInit: function () {
			
            var oPage = this.getView().byId("page")
			oPage.attachBrowserEvent("scroll", function (oEvent) {
				console.log("onscoll");
			});
			this.oDataModel = sap.ui.getCore().getModel();
			this.getView().setModel(this.oDataModel, "oDataModel");
			this.detailModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.detailModel, "detailModel");

			this.oDataModel=this.getOwnerComponent().getModel()
			this.oDataModel.setHeaders({
				"loginId": "1100015",
				"loginType": "public"
			});
			this.firstFlag = false;
			this._tableTemp;

			// var odataModel = new sap.ui.model.odata.v2.ODataModel("/services/userapi/attributes");
			// this.getView().setModel(odataModel);
			





			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this.handleRouteMatched, this);
            this.handleRouteMatched()

			// this.onColumns()

        },
        onclick: function () {
			debugger
			var oPage = this.getView().byId("page");
			oPage.scrollTo(0, 0);
		},



		handleRouteMatched: function () {
			debugger
			sap.ui.core.BusyIndicator.show();
				var that = this;
		this.oDataModel.read("/ItemDetailsSet", {
			success: function (aData) {
				debugger
			
				// var ship = new JSONModel(aData);
				// 	that.getView().setModel(ship, "shipDetail");

				if (aData.results.length) {
					var notifiMsg = aData.results[0].GraceMsg;
					var notifiExcepMsg = aData.results[0].GraceMsgExp;
					if (!notifiMsg && !notifiExcepMsg) {
						that.AccountStatementModel = new sap.ui.model.json.JSONModel(); //local model to save customer no and process date
						that.getView().setModel(that.StatementView, "StatementView");
						that._openSelectFragment();
						// that.getView().byId("radioBtnGrpId").destroy();

					} else if (notifiMsg) {
						sap.m.MessageBox.warning(notifiMsg, {
							
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								that.AccountStatementModel = new sap.ui.model.json.JSONModel(); //local model to save customer no and process date
								that.getView().setModel(that.StatementView, "StatementView");
								that._openSelectFragment();
								that.getView().byId("radioBtnGrpId").destroy();

							}
						});
					} else { //else if(notifiExcepMsg)
						sap.m.MessageBox.error(notifiExcepMsg, {
							
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
								var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
									target: {
										semanticObject: "dmsroadncc",
										action: "Display"
									}
								})) || ""; // generate the Hash to display a road ncc number
								oCrossAppNavigator.toExternal({
									target: {
										shellHash: hash
									}
								});
							}
						});
					}
				}



			},
			error: function (error) {
				debugger
				// BusyIndicator.hide();
				sap.m.MessageToast.show("Cannot load Categories " + JSON.stringify(error));
			}

		});
	},
		onContextChange: function (oEvent) {
			debugger
			
			var that = this;
			var Busy = oEvent.getParameter("busy");
			if (this.firstFlag) {
				if (!Busy) {
					var length = this.getView().byId("tableid").getBinding("rows").aFilters.length;
					if (length == 0) {
						that.filters = [];
						that.filters.push(new sap.ui.model.Filter("From_Date", sap.ui.model.FilterOperator.EQ, that.fromDate));
						that.filters.push(new sap.ui.model.Filter("To_Date", sap.ui.model.FilterOperator.EQ, that.toDate));
						that.getView().byId("tableid").getBinding("rows").filter(that.filters);
					}
				}
			}
			
		},

		getFormattedDate: function (date) {
			debugger
			var year = date.getFullYear();
			var month = (1 + date.getMonth()).toString();
			month = month.length > 1 ? month : "0" + month;
			var day = date.getDate().toString();
			day = day.length > 1 ? day : "0" + day;
			return year + month + day;
		},

		// onBeforeRebindTable: function (oEvent) {
		// 	var len = oEvent.getParameters().bindingParams.filters.length;
		// 	//to modify the values while applying column filters
		// 	for (var i = 0; i < len; i++) {
		// 		var filter = oEvent.getParameters().bindingParams.filters[i];
		// 		if (filter.sPath === "Date") {
		// 			if (filter.sOperator === "BT") {
		// 				var oValue1 = filter.oValue1;
		// 				filter.oValue1 = this.getFormattedDate(oValue1);
		// 				var oValue2 = filter.oValue2;
		// 				filter.oValue2 = this.getFormattedDate(oValue2);
		// 			} else {
		// 				var oValue = filter.oValue1;
		// 				filter.oValue1 = this.getFormattedDate(oValue);
		// 			}
		// 		}
		// 	}
		// },

		handleBeforeRebindTable: function (evt) {
			debugger
			this.emailFlag = false;
			var that = this;

			var oTable = this.getView().byId("LineItemSmartTable");
			var binding = evt.getParameter("bindingParams");
		},

		onCancel: function () {
			debugger
			this.AccountSelectFragment.close();
			sap.ui.getCore().byId("monthId").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("fromdate").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("dateToId").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("yearId").setValueState(sap.ui.core.ValueState.None);

					
					sap.ui.getCore().byId("yearId").setValue('');
					sap.ui.getCore().byId("dateToId").setValue('');
					sap.ui.getCore().byId("monthId").setValue('');
					sap.ui.getCore().byId("dateToId").setValue('');
					sap.ui.getCore().byId("fromdate").setValue('');
			//	this.AccountSelectFragment.destroy();
			// var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			// oCrossAppNavigator.toExternal({
			// 	target: {
			// 		semanticObject: "#"
			// 	}
			// });
		},

		onBeforeClose: function (evt) {
			debugger
			if (!evt.getParameter("origin")) {
				this.AccountSelectFragment.close();
				//	this.AccountSelectFragment.destroy();
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "#"
					}
				});
			}
		},

		onBeforeExport: function (oEvt) {
			debugger
			var ExcelSettings = oEvt.getParameter("exportSettings");
			ExcelSettings.fileName = "Account Statement";
			var data = ExcelSettings.workbook.columns;
			for (var i = 0; i < data.length; i++) {
				if (data[i].property == "Invoice") {
					ExcelSettings.workbook.columns[i].type = "number";
				}
				if (data[i].property == "Belnr") {
					ExcelSettings.workbook.columns[i].type = "number";
				}
				if (data[i].property == "Date") {
					ExcelSettings.workbook.columns[i].type = sap.ui.export.EdmType.Date;
					ExcelSettings.workbook.columns[i].width = 10;
					ExcelSettings.workbook.columns[i].inputFormat = "dd.MM.yyyy";
				}
				if (data[i].property == "CD_Amt") {
					ExcelSettings.workbook.columns[i].type = "number";
					ExcelSettings.workbook.columns[i].scale = "2";
					ExcelSettings.workbook.columns[i].delimiter = true;
				}

				if (data[i].property == "Debit") {
					ExcelSettings.workbook.columns[i].type = "number";
					ExcelSettings.workbook.columns[i].scale = "2";
					ExcelSettings.workbook.columns[i].delimiter = true;
				}
				if (data[i].property == "Credit") {
					ExcelSettings.workbook.columns[i].type = "number";
					ExcelSettings.workbook.columns[i].scale = "2";
					ExcelSettings.workbook.columns[i].delimiter = true;
				}
				if (data[i].property == "TDS_TCS") {
					ExcelSettings.workbook.columns[i].type = "number";
					ExcelSettings.workbook.columns[i].scale = "2";
				}
				if (data[i].property == "Reference") {
					ExcelSettings.workbook.columns[i].type = "number";
				}
				if (data[i].property == "Balance") {
					ExcelSettings.workbook.columns[i].type = "number";
					ExcelSettings.workbook.columns[i].scale = "2";
					ExcelSettings.workbook.columns[i].delimiter = true;
				}
			}
			ExcelSettings.dataSource.useBatch = true;
		},


		// onBeforeExport : function(oEvt){
		// 	debugger
		// 	var ExcelSettings = oEvt.getParameter("exportSettings");
		// 	ExcelSettings.fileName = "Account Statement";
		// 	var data = ExcelSettings.workbook.columns;
        //         var currentDate = new Date();
		// 		var aCols, oRowBinding, oSettings, oSheet, oTable, oSheet;

		// 		oTable = this._oTable;
        //         oRowBinding = oTable.getBinding('items');
        //         aCols = this.createColumnConfig();

		// 		var ModelData = this.getView().getModel("supplier")

		// 		oSettings = {
        //             workbook: {
        //                 columns: aCols,
        //                 hierarchyLevel: 'Level'
        //             },

        //             dataSource: oRowBinding,
        //             fileName: fName,
        //             worker: false


        //         };

		// 		oSheet = new sap.ui.export.Spreadsheet(oSettings);
        //         oSheet.build().
        //             finally(function () {
        //                 oSheet.destroy();
        //             });


		// },

		// createColumnConfig: function (oEvt) {
		// 	debugger;
		// 	var aCols = [];

		// 	aCols.push({
		// 		label: "PR No.",
		// 		property: 'Blart'
		// 	});

		// 	aCols.push({
		// 		label: "Grand Total",
		// 		property: 'GRAND_TOTAL'

		// 	});

		// 	aCols.push({
		// 		label: "Creation Date",
		// 		property: 'PR_CREATION_DATE',
		// 		type: EdmType.Date
		// 	});

		// 	aCols.push({
		// 		label: "Last Date",
		// 		property: 'LAST_UPDATED_DATE',
		// 		type: EdmType.Date
		// 	});

		// 	aCols.push({
		// 		label: "Status",
		// 		property: 'TO_STATUS/DESC'
		// 	});

		// 	return aCols;
		// },


		onDataRequested: function (e) {
			debugger
			var oBindingParams = e.getParameter("bindingParams");
			oBindingParams.filters.push(new sap.ui.model.Filter("From_Date", sap.ui.model.FilterOperator.EQ, this.fromDate));
			oBindingParams.filters.push(new sap.ui.model.Filter("To_Date", sap.ui.model.FilterOperator.EQ, this.toDate));
		},
		onFilterButton: function () {
			debugger
			this._openSelectFragment();
			// this.onMonthSelect();
			/*sap.ui.getCore().byId("monthId").setValue('').setDisplayFormat("MMM, yyyy");*/
		},
		_openSelectFragment: function () {
			sap.ui.core.BusyIndicator.hide();
			if (!this.AccountSelectFragment) {
				this.AccountSelectFragment = sap.ui.xmlfragment("com.ibs.ibsappidealcoustomeraccountstatement.view.AccountSelectFrag", this);

			}
			this.AccountSelectFragment.setModel(this.AccountStatementModel, "AccountStatementModel");
			this.AccountSelectFragment.open();
		},
		// if Month radio button selected
		onMonthSelect: function (evt) {
			debugger
			if (evt.getParameter("selectedIndex") === 0) {
				sap.ui.getCore().byId("monthId").setVisible(true).setDisplayFormat("MMM, yyyy");
				sap.ui.getCore().byId("monthId").setValue('').setDisplayFormat("MMM, yyyy");
				// sap.ui.getCore().byId("dateToId").setValue('').setDisplayFormat("dd.MM.yyyy");
				sap.ui.getCore().byId("yearId").setValue('').setDisplayFormat("yyyy-yyyy").setVisible(false);
				sap.ui.getCore().byId("dateToId").setVisible(false);
				sap.ui.getCore().byId("fromdate").setValue('').setVisible(false);
			} else if (evt.getParameter("selectedIndex") === 1) {
				sap.ui.getCore().byId("monthId").setVisible(false);
				sap.ui.getCore().byId("yearId").setVisible(true);
				sap.ui.getCore().byId("dateToId").setValue('').setVisible(false);
				sap.ui.getCore().byId("monthId").setValue('').setDisplayFormat("MMM, yyyy");
				sap.ui.getCore().byId("dateToId").setValue('').setDisplayFormat("dd.MM.yyyy");
				sap.ui.getCore().byId("fromdate").setValue('').setVisible(false);
			} else {

				// sap.ui.getCore().byId("monthId").setValue('').setDisplayFormat("dd.MM.yyyy");
				sap.ui.getCore().byId("monthId").setVisible(false);
				sap.ui.getCore().byId("dateToId").setVisible(true).setDisplayFormat("dd.MM.yyyy");
				sap.ui.getCore().byId("fromdate").setVisible(true).setDisplayFormat("dd.MM.yyyy");
				sap.ui.getCore().byId("yearId").setValue('').setDisplayFormat("yyyy-yyyy").setVisible(false);
			}


			
				var fiscal_yr = sap.ui.getCore().byId("id_fisical").getSelected()
				var date_range = sap.ui.getCore().byId("id_date").getSelected()
				var monthtselected= sap.ui.getCore().byId("id_month").getSelected()	
				if(fiscal_yr === true){
					sap.ui.getCore().byId("monthId").setValueState(sap.ui.core.ValueState.None)
					sap.ui.getCore().byId("fromdate").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("dateToId").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("yearId").setValueState(sap.ui.core.ValueState.None);

				}else if(date_range=== true){
					sap.ui.getCore().byId("monthId").setValueState(sap.ui.core.ValueState.None)
					sap.ui.getCore().byId("fromdate").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("dateToId").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("yearId").setValueState(sap.ui.core.ValueState.None);
				}else if(monthtselected === true){
					sap.ui.getCore().byId("monthId").setValueState(sap.ui.core.ValueState.None)
					sap.ui.getCore().byId("fromdate").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("dateToId").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("yearId").setValueState(sap.ui.core.ValueState.None);
				}

			
		},

		monthSelectF: function(){
			debugger
			var monthinput= sap.ui.getCore().byId("monthId").getValue()
			if (monthinput === "" || monthinput === undefined  ) {
				sap.ui.getCore().byId("monthId").setValueState(sap.ui.core.ValueState.Error);
			}else{
			
					sap.ui.getCore().byId("monthId").setValueState(sap.ui.core.ValueState.None);
			}
		

		},

		formdateF: function(){
			debugger
			var formdate=sap.ui.getCore().byId("fromdate").getValue()
				
			if(formdate === ""|| formdate=== undefined ){
				sap.ui.getCore().byId("fromdate").setValueState(sap.ui.core.ValueState.Error);
				
			}else{
			
				sap.ui.getCore().byId("fromdate").setValueState(sap.ui.core.ValueState.None);
		}
		
		},

		datetoF: function(){
			debugger
			var todate= sap.ui.getCore().byId("dateToId").getValue()
			if(todate=== ""|| todate === undefined){
				
				sap.ui.getCore().byId("dateToId").setValueState(sap.ui.core.ValueState.Error);
			}else{
			
				sap.ui.getCore().byId("dateToId").setValueState(sap.ui.core.ValueState.None);
		}
		},

		onSubmit: function (oEvent) {
			debugger
			// sap.ui.core.BusyIndicator.show();
			// this.onOpenDialog();
			var that = this;
			this.firstFlag = true;
			var SubmitData = that.AccountStatementModel.getData();
			// console.log(SubmitData);
			this.FromDate = SubmitData.MonthPicker;
			this.DateFrom = SubmitData.DateFrom;
			if (!SubmitData.Year) {
				this.Year = SubmitData.Year;
			} else {
				SubmitData.Year = SubmitData.Year.split("-")[0];
				this.Year = SubmitData.Year.split("-")[0];
			}
			this.ToDate = SubmitData.DateTo;
			if (SubmitData.MonthPicker || SubmitData.Year || SubmitData.DateFrom || SubmitData.DateTo) {
				var flag = true;
				var index = sap.ui.getCore().byId("radioBtnGrpId").getSelectedIndex();
				if (index === 0) {
					this.Type = 'M';
					this.From_Date = SubmitData.MonthPicker;
					this.To_Date = "";
					this.Year = "";
				} else if (index === 1) {
					this.Type = 'Y';
					this.From_Date = "";
					this.To_Date = "";
					if (SubmitData.Year.length !== 4) {
						MessageBox.information("Please enter a year that is valid");
						flag = false;
						sap.ui.core.BusyIndicator.hide();
					} else {
						this.From_Date = "";
						this.To_Date = "";
						this.Year = SubmitData.Year;
					}
				} else {
					if (SubmitData.DateTo) {
						this.Type = 'R';
						this.From_Date = SubmitData.DateFrom;
						this.To_Date = SubmitData.DateTo;
						this.Year = "";
					} else {
						flag = false;
						MessageBox.error("Please ensure all required fields are filled");
					}
				}

				if (flag === true) {
					// this.handleRouteMatched()
					// itemdetail set called here to get use formatter 2nd time
					var itemPath = "/ItemDetailsSet";
					// binding for sap.ui.table
					that.getView().byId("tableid").bindRows({
						path: itemPath,
						template: that._tableTemp
					});


					// this.request = "/HeaderDetailsSet?$filter=" + " Year eq '" + this.Year + "' and To_Date eq '" + //change this to that
					// this.To_Date + "' and Type eq '" + this.Type + "' and From_Date eq '" + this.From_Date +
					// "' and Otf eq '' and SecDeposit eq 'X' and AddDeposit eq ''";

					// var DateInstancefrom = (this.From_Date);
					// var date = sap.ui.core.format.DateFormat.getDateInstance({
					// 	pattern: "dd.MM.yyyy"
					// });
					// var f_Date1=date.format (new Date(Number(DateInstancefrom)));


					// var DateInstance = (this.To_Date);
					// var date = sap.ui.core.format.DateFormat.getDateInstance({
					// 	pattern: "dd.MM.yyyy"
					// });
					// var f_Date=date.format (new Date(Number(DateInstance)));

					// var dateString = this.To_Date;
					// var year = parseInt(dateString.substring(0, 4), 10);
					// var month = parseInt(dateString.substring(4, 6), 10) - 1; // Month is 0-based in JavaScript Date
					// var day = parseInt(dateString.substring(6, 8), 10);
					// var dateObject = new Date(year, month, day);
					// var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					// 	pattern: "dd.MM.yyyy"
					// });
					// var sFormatt_TOdate = oDateFormat.format(dateObject);



				//    var dateStringdate = this.From_Date;
				// 	var year1 = parseInt(dateStringdate.substring(0, 4), 10);
				// 	var month1 = parseInt(dateStringdate.substring(4, 6), 10) - 1; // Month is 0-based in JavaScript Date
				// 	var day1 = parseInt(dateStringdate.substring(6, 8), 10);
				// 	var dateObject1 = new Date(year1, month1, day1);
				// 	var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				// 		pattern: "dd.MM.yyyy"
				// 	});
				// 	var sFormatt_from = oDateFormat.format(dateObject1);

                          that.AccountSelectFragment.close();
							var oFilter1 = new sap.ui.model.Filter("Year", sap.ui.model.FilterOperator.EQ, this.Year);
							var oFilter2 = new sap.ui.model.Filter("To_Date", sap.ui.model.FilterOperator.EQ, this.To_Date);
							var oFilter3 = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, this.Type);
							var oFilter4 = new sap.ui.model.Filter("From_Date", sap.ui.model.FilterOperator.EQ, this.From_Date);
							var oFilter5 = new sap.ui.model.Filter("Otf", sap.ui.model.FilterOperator.EQ, "");
							var oFilter6 = new sap.ui.model.Filter("SecDeposit", sap.ui.model.FilterOperator.EQ, "X");
							var oFilter7 = new sap.ui.model.Filter("AddDeposit", sap.ui.model.FilterOperator.EQ, "");

						
							// filters: [oFilter1,oFilter2,oFilter3,oFilter4,oFilter5,oFilter6,oFilter7],

					

							that.oDataModel.read("/HeaderDetailsSet", {
								filters: [oFilter1,oFilter2,oFilter3,oFilter4,oFilter5,oFilter6,oFilter7],
								success: function (oData, resp) {
									debugger
									sap.ui.core.BusyIndicator.hide();
							that.detailModel.setData(oData);
							that.detailModel.refresh();
							// that.AccountSelectFragment.close();
							// try {
							var index = sap.ui.getCore().byId("radioBtnGrpId").setSelectedIndex(0);
							sap.ui.getCore().byId("monthId").setVisible(true).setDisplayFormat("MMM, yyyy");
							sap.ui.getCore().byId("yearId").setVisible(false);
							// sap.ui.getCore().byId("monthId").setValue('');
							sap.ui.getCore().byId("dateToId").setVisible(false);
							sap.ui.getCore().byId("fromdate").setVisible(false);
							sap.ui.getCore().byId("monthId").setValue("");
							sap.ui.getCore().byId("yearId").setValue("");
							sap.ui.getCore().byId("dateToId").setValue("");
							sap.ui.getCore().byId("fromdate").setValue("");

							that.docType = that.detailModel.getData().results[0].Doc_Type;
					that.fromDate = that.detailModel.getData().results[0].From_Date;
					that.toDate = that.detailModel.getData().results[0].To_Date;

				
					that.filters = [];
					that.filters.push(new sap.ui.model.Filter("From_Date", sap.ui.model.FilterOperator.EQ, that.fromDate));
					that.filters.push(new sap.ui.model.Filter("To_Date", sap.ui.model.FilterOperator.EQ, that.toDate));
					that.getView().byId("tableid").getBinding("rows").filter(that.filters);
                    that.AccountSelectFragment.close();
					
			
								},
								error: function (error) {
									debugger
							that.detailModel.setData([]);
							that.detailModel.refresh();
							sap.ui.core.BusyIndicator.hide();
							sap.m.MessageBox.error("Error while reading data");
							this.AccountSelectFragment.close();
							// var value = JSON.parse(oError.response.body);
							// MessageBox.error(value.error.message.value);

							}
			
							});


			



					// this.docType = that.detailModel.getData().results[0].Doc_Type;
					// this.fromDate = that.detailModel.getData().results[0].From_Date;
					// this.toDate = that.detailModel.getData().results[0].To_Date;



					// this.filters = [];
					// this.filters.push(new sap.ui.model.Filter("From_Date", sap.ui.model.FilterOperator.EQ, this.fromDate));
					// this.filters.push(new sap.ui.model.Filter("To_Date", sap.ui.model.FilterOperator.EQ, this.toDate));
					// that.getView().byId("tableid").getBinding("rows").filter(this.filters);
					// console.log(that.getView().byId("tableid").getBinding("rows").filter(this.filters));
					// that.AccountSelectFragment.destroy();
					// that.getView().byId("radioBtnGrpId").destroy();
					
					// that.AccountSelectFragment = null;

					// that.onMonthSelect();
				}

			} else {
				debugger
				MessageBox.error("Please ensure all required fields are filled");
				sap.ui.core.BusyIndicator.hide();
				var monthinput= sap.ui.getCore().byId("monthId").getValue()
				var yearselectd=sap.ui.getCore().byId("yearId").getValue()
				var formdate=sap.ui.getCore().byId("fromdate").getValue()
				var todate= sap.ui.getCore().byId("dateToId").getValue()
				if (monthinput === "" || monthinput === undefined  ) {
					sap.ui.getCore().byId("monthId").setValueState(sap.ui.core.ValueState.Error);
					sap.ui.getCore().byId("fromdate").setValueState(sap.ui.core.ValueState.Error);
					sap.ui.getCore().byId("dateToId").setValueState(sap.ui.core.ValueState.Error);
					sap.ui.getCore().byId("yearId").setValueState(sap.ui.core.ValueState.Error);
				}else if(yearselectd=== ""||yearselectd===undefined){
					sap.ui.getCore().byId("yearId").setValueState(sap.ui.core.ValueState.Error);
				}else if(formdate === ""|| formdate=== undefined ){
					sap.ui.getCore().byId("fromdate").setValueState(sap.ui.core.ValueState.Error);
					
				}else if(todate=== ""|| todate === undefined){
					sap.ui.getCore().byId("dateToId").setValueState(sap.ui.core.ValueState.Error);
				}
				else {
					sap.ui.getCore().byId("monthId").setValueState(sap.ui.core.ValueState.None)
					sap.ui.getCore().byId("fromdate").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("dateToId").setValueState(sap.ui.core.ValueState.None);
					sap.ui.getCore().byId("yearId").setValueState(sap.ui.core.ValueState.None);
				}
			}
			// that.AccountSelectFragment.close();
			// that.getView().byId("radioBtnGrpId").destroy();
			// that.AccountSelectFragment.destroy();
			// that.AccountSelectFragment = null;

		},
		onOpenDialog: function (oEvent) {
			debugger
			var that = this;
			sap.ui.core.BusyIndicator.show();
			setTimeout(function () {
				if (!that._dialog) {
					that._dialog = sap.ui.xmlfragment("com.ibs.ibsappidealcoustomeraccountstatement.view.BusyDialog", that);
					that.getView().addDependent(that._dialog);
				}

				// open dialog
				jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._dialog);
				that._dialog.open();

				// simulate end of operation
				_timeout = jQuery.sap.delayedCall(3000, that, function () {
					that._dialog.close();
				});
			}, 2000);

			// instantiate dialog

		},
		onFilterGo: function (evt) {
			debugger
			var that = this;
			var Filter1 = this.getView().byId("smartFilterBar").getFilters()[0];
			if (Filter1) {
				var temp1 = this.getView().byId("tableid").getBinding("rows").aFilters;
				var temp2 = this.getView().byId("smartFilterBar").getFilters()[0].aFilters;
				var str = [];
				var str1 = [];
				for (var j = 0; j < temp1.length; j++) {
					var check = temp1[j].sPath + " " + temp1[j].sOperator.toLowerCase() + " '" + temp1[j].oValue1 + "'";
					str.push(check);
				}
				var aaArr = [];
				var zzArr = [];
				if (temp2.length == 1) {
					for (var i = 0; i < temp2.length; i++) {
						var check1 = temp2[i].sPath + " " + temp2[i].sOperator.toLowerCase() + " '" + temp2[i].oValue1 + "'";
						str1.push(check1);
					}
				}
				if (temp2.length > 1) {
					for (var k = 0; k < temp2.length; k++) {
						aaArr.push(temp2[k]);
					}
					for (var m = 0; m < aaArr.length; m++) {
						zzArr.push(aaArr[m].aFilters[0].sPath + " " + aaArr[m].aFilters[0].sOperator.toLowerCase() + " '" + aaArr[m].aFilters[0].oValue1 +
							"'");
					}
					str1 = "(" + zzArr.join(" and ") + ")";
				}

				var joinArr = str.join(" and ");
				var jAr = "(" + joinArr + ") and " + str1;
				var itemPath = "/ItemDetailsSet?$filter=" + jAr;

					that.oDataModel.read(itemPath, {
						success: function (oData, resp) {
							debugger
						
							if (oData.results.length != 0) {
											var dataVal1 = oData.results[0].Email_Message;
											if (dataVal1) {
												MessageBox.information(dataVal1);
											}
										}
	
	
						},
						error: function (error) {
							sap.ui.core.BusyIndicator.hide();
									var value = JSON.parse(oError.response.body);
									MessageBox.error(value.error.message.value);
						}
	
					});
				





				// this.oDataModel.read(itemPath, null, null, false,
				// 	function (oData) {
				// 		// console.log(oData);
				// 		if (oData.results.length != 0) {
				// 			var dataVal1 = oData.results[0].Email_Message;
				// 			if (dataVal1) {
				// 				MessageBox.information(dataVal1);
				// 			}
				// 		}
				// 	},
				// 	function (oError) {
				// 		sap.ui.core.BusyIndicator.hide();
				// 		var value = JSON.parse(oError.response.body);
				// 		MessageBox.error(value.error.message.value);
				// 	});

			}
		},

		onSort: function () {
			var oSmartTable = this._getSmartTable();
			if (oSmartTable) {
				oSmartTable.openPersonalisationDialog("Sort");
			}
		},
		onFilter: function () {
			var oSmartTable = this._getSmartTable();
			if (oSmartTable) {
				oSmartTable.openPersonalisationDialog("Filter");
			}
		},
		onGroup: function () {
			// alert("Not available as this feature is disabled for this app in the view.xml");

		},
		onColumns: function () {
			debugger
			var oSmartTable = this._getSmartTable();
			if (oSmartTable) {
				oSmartTable.openPersonalisationDialog("Columns");
			}
		},
		_getSmartTable: function () {
			debugger
			if (!this._oSmartTable) {
				this._oSmartTable = this.getView().byId("LineItemSmartTable");
			}
			return this._oSmartTable;
		},
		onExit: function () {
			this._oSmartTable = null;
		},
		onReset: function (oEvent) {
			MessageBox.success("The reset function has been activated");
		},

		onTableFilter: function (oEvent) {

		},
		onDownloadPress: function () {
			debugger
			var that = this;
			sap.ui.core.BusyIndicator.show();
			if (!that.filter) {
				that.filter = "$filter=To_Date eq '" + this.toDate + "' and From_Date eq '" + this.fromDate + "'";
			}
			this.Flag = "X";
			var pathRedirect = "/HeaderDetailsSet?" + that.filter + "and Download eq '" + this.Flag + "'";
			setTimeout(function () {
				that.oDataModel.read(pathRedirect, null, null, false,
					function (aData) {
						var key = aData.results[0].Otf;
						var downloadPath = "/HeaderDetailsSet(Otf='" + key + "',From_Date='',To_Date='',Type='',Year='')/$value";
						downloadPath = that.oDataModel.sServiceUrl + downloadPath;
						sap.ui.core.BusyIndicator.hide();
						sap.m.URLHelper.redirect(downloadPath, true);
					},
					function (oError) {});
			}, 2000);
		},
		onDocLinkPress: function (evt) {
			debugger
			this.InvoiceNum = evt.getSource().getParent().getBindingContext().getObject().Invoice;
			this.DocType = evt.getSource().getParent().getBindingContext().getObject().Blart;
			this.DocDate = evt.getSource().getParent().getBindingContext().getObject().Date;
			sap.ui.core.BusyIndicator.show();
			var that = this;
			if (!that.filter) {
				that.filter = "$filter=To_Date eq '" + this.toDate + "' and From_Date eq '" + this.fromDate + "'";
			}
			var val = this.DocDate.split('.');
			var zArr = [];
			zArr = val.reverse();
			this.DocDate = zArr.join('');

			var pathRedirect = "/DownloadDocSet(Doc_Type='" + this.DocType + "',Doc_No='" + this.InvoiceNum + "',DocDate='" + this.DocDate +
				"',Down_Key='')";
			setTimeout(function () {
				that.oDataModel.read(pathRedirect, null, null, false,
					function (aData) {
						sap.ui.core.BusyIndicator.hide();
						var key = aData.Down_Key;
						if (key) {

							var downloadPath = "/DownloadDocSet(Doc_Type='" + that.DocType + "',Doc_No='" + that.InvoiceNum + "',DocDate='" + that.DocDate +
								"',Down_Key='" + key + "')/$value";
							downloadPath = that.oDataModel.sServiceUrl + downloadPath;
							sap.m.URLHelper.redirect(downloadPath, true);
						}
					},
					function (oError) {
						sap.ui.core.BusyIndicator.hide();
					});
			}, 2000);

		},

		onDateChange: function (evt) {
			debugger
			var oDate = new Date(evt.getParameter("value"));
			var monthNames = [
				"Jan", "Feb", "March",
				"Apr", "May", "June", "July",
				"Aug", "Sept", "Oct",
				"Nov", "Dec"
			];
			var monthIndex = oDate.getMonth();
			var year = oDate.getFullYear();
			var name = monthNames[monthIndex] + ", " + year;
			evt.getSource().setValue(name);
		},
		// onBelnrPress: function (evt) {
		// 	this.Belnr = evt.getSource().getParent().getBindingContext().getObject().Belnr;
		// 	var that = this;
		// 	if (!that.filter) {
		// 		that.filter = "$filter=To_Date eq '" + this.toDate + "' and From_Date eq '" + this.fromDate + "'";
		// 	}
		// 	var pathRedirect = "/DownloadDocSet(Doc_Type='',Doc_No='" + this.Belnr + "',Down_Key='')";
		// 	this.oDataModel.read(pathRedirect, null, null, false,
		// 		function (aData) {
		// 			var key = aData.Down_Key;
		// 			if (key) {
		// 				var downloadPath = "/DownloadDocSet(Doc_Type='',Doc_No='" + that.Belnr + "',Down_Key='" + key + "')/$value";
		// 				downloadPath = that.oDataModel.sServiceUrl + downloadPath;
		// 				sap.m.URLHelper.redirect(downloadPath, true);
		// 			}
		// 		},
		// 		function (oError) {});
		// },

		onYearChange: function (evt) {
			debugger
			var yearselectd=sap.ui.getCore().byId("yearId").getValue()
			if(yearselectd=== ""||yearselectd===undefined){
				sap.ui.getCore().byId("yearId").setValueState(sap.ui.core.ValueState.Error);
			}else {
				sap.ui.getCore().byId("yearId").setValueState(sap.ui.core.ValueState.None);
			}

			//get current date
			var today = evt.getSource().getDateValue();
			//get current month
			var curMonth = today.getMonth();
			var fiscalYr = "";
			if (curMonth >= 3) { //
				var nextYr1 = (today.getFullYear() + 1).toString();
				fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
			} else {
				var nextYr2 = today.getFullYear().toString();
				fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
			}
			evt.getSource().setValue(fiscalYr);
			
		}
    });
});
