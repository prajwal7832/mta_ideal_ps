
sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox",
	"sap/ui/Device",
	"com/ibs/ibsappidealsalesorder/model/formatter"
], function (BaseController, JSONModel, Filter, FilterOperator, BusyIndicator, MessageBox, Device,formatter) {
	"use strict";
	var that, productsModel,searchValue;
	var xyz, adddcard, surl, obj, id, bnz, oPayload, shiptype, shipname;
	var delData = [];
	var oDeletedata = [];
	var cardeleteData = [];
	var cartData;
	var iNewQuantity;
	return BaseController.extend("com.ibs.ibsappidealsalesorder.controller.Cart", {
		formatter: formatter,
		onInit: function () {
			//debugger
			that = this;

			that.oDataModel = this.getOwnerComponent().getModel();
			productsModel = new sap.ui.model.json.JSONModel();
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Cart");
			var getRoute = oRouter.getRoute("Cart");
			getRoute.attachPatternMatched(this._onRouteMatched, this);
			// that.readSupplier();

		},

		_onRouteMatched: function (oEvent) {
			//debugger
			var g = this.getView().getParent().getParent();
			g.toBeginColumnPage(this.getView())
			id = oEvent.getParameter('arguments').loginId;


			//    oPayload=this.getOwnerComponent().getModel("aAllData").getData();
			// 	adddcard = new JSONModel(oPayload);
			// 	that.getView().setModel(adddcard, "addCardData");
			that.showdata();
			that.shipdetail();
			// that.cartPayload();

		},

		// cartPayload : function(){
		// 	//debugger
		// 	for (let  i= 0;  i< oPayload.results.length; i++) {
		// 		cartData = {
		// 			"DISTRIBUTOR_ID":id,
		// 			"CART_ID":1,
		// 			"MATERIAL_CODE": oPayload.results[i].MaterialCode,
		// 			"MATERIAL_DESC": oPayload.results[i].MaterialDes,
		// 			"IMAGE_URL":oPayload.results[i].ImageUrl,
		// 			"HSN_CODE": "GOD",
		// 			"UNIT_OF_MEASURE": "MEA",
		// 			"QUANTITY": parseInt(oPayload.results[i].Quantity),
		// 			"FREE_QUANTITY": null,
		// 			"STD_PRICE": null,
		// 			"BASE_PRICE": null,
		// 			"DISC_AMOUNT": null,
		// 			"DISC_PERC": null,
		// 			"NET_AMOUNT": parseInt(oPayload.results[i].NetPrice),
		// 			"TOTAL_AMOUNT":parseInt (oPayload.results[i].TOTAL_AMOUNT),
		// 			"CGST_PERC":parseInt (oPayload.results[i].Cgst_per),
		// 			"CGST_AMOUNT": null,
		// 			"SGST_PERC": parseInt(oPayload.results[i].Sgst_per),
		// 			"SGST_AMOUNT": null,
		// 			"IGST_PERC": parseInt(oPayload.results[i].Igst_per),
		// 			"IGST_AMOUNT": null,
		// 			"TAXES_AMOUNT": 120.00
		// 		}

		// 	}

		// },


		showdata: function () {
			//debugger

			BusyIndicator.show(0);
			var appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			var appModulePath = jQuery.sap.getModulePath(appPath);
			var no = 1100013;
			var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrCart?$filter=DISTRIBUTOR_ID eq '" + no + "'";
			$.ajax({
				url: url,
				type: 'GET',
				data: null,
				contentType: 'application/json',
				success: function (data, responce) {
					BusyIndicator.hide();
					//debugger
					var iGrandTotal = 0

					adddcard = new sap.ui.model.json.JSONModel(data);
					that.getOwnerComponent().setModel(adddcard, "addCardData");

                    var lengthItems=that.getView().getModel("addCardData").getData().value.length
					that.getView().getModel("addCardData").setProperty("/lengthItems", lengthItems)

					for (let i = 0; i < data.value.length; i++) {
						iGrandTotal += parseInt(data.value[i].TOTAL_AMOUNT, 10)
					}
					that.getView().getModel("addCardData").setProperty("/GrandTotal", iGrandTotal.toFixed(2))
					bnz = that.getView().getModel("addCardData").getData()


					if (Device.system.desktop) {
						//debugger
						that.getView().getModel("addCardData").setProperty("/cardCount", 5);
					} else if (Device.system.phone) {
						that.getView().getModel("addCardData").setProperty("/cardCount", 2);
		
					}

                // this.onStepInputChange()

				},
				error: function (e) {
					//debugger
					BusyIndicator.hide();
					MessageBox.error("error");
				}
			});
		},




		// GrandTotal:function(aCartDetails){
		// 	//debugger
		// 	var grandTotal=0
		// 	for (let i = 0; i < aCartDetails.length; i++) {
		// 		grandTotal += aCartDetails[0].NET_AMOUNT * aCartDetails[0].QUANTITY

		// 	}
		// 	return grandTotal;
		// },

		navigateToView1: function () {
			//debugger
			BusyIndicator.show()
			this.getView().byId("shiftdetail").setValue("");
			this.getView().byId("MaterialSearch").setValue("");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
			oRouter.navTo("View3",
				{ D_loginId: id });
		},
		handleToggleClick: function (oEvent) {
			//debugger;

			
			this.getView().byId("MaterialSearch").setValue("");
			var sFlag = true;
			var g = this.getView().getParent().getParent();
			g.toBeginColumnPage(this.getView())
			var deleteddata = bnz


			var deleteddata = new JSONModel(deleteddata);
			this.getOwnerComponent().setModel(deleteddata, "tabledata");
			var cardata = this.getOwnerComponent().getModel("tabledata").getData()
			var manullyremove=this.getView().byId("shiftdetail").getValue()
			var Materialdes = [];
			for (let i = 0; i < cardata.value.length; i++) {
				if (cardata.value[i].QUANTITY <= 0) {
					// count++
					sFlag = false;
					Materialdes.push(cardata.value[i].MATERIAL_DESC);
				}

			}



			if (cardata.value.length === 0) {
					MessageBox.warning("Please add atleast one material ");
			 }
			else if (sFlag === true && shipname === undefined || manullyremove === "") {
				//debugger
				// MessageBox.warning("Please select ship to address");
				
				MessageBox.error("Please select ship to address", {
					actions: [MessageBox.Action.OK],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (oAction) {
						if (oAction === 'OK') {
							//debugger
							if (shipname === "" || shipname === undefined) {
								that.getView().byId("shiftdetail").setValueState(sap.ui.core.ValueState.Error);
							}else if(shipname === "Star Enterprize"){
								that.getView().byId("shiftdetail").setValueState(sap.ui.core.ValueState.None)
							}
							//  this.getView().byId("MaterialSearch").setValue("");
					 searchValue=that.getView().byId("MaterialSearch").setValue("").mProperties.value
				    that.onSearch();

						}
					}
				}
				);




				// if (shipname === "" || shipname === undefined) {
				// 	that.getView().byId("shiftdetail").setValueState(sap.ui.core.ValueState.Error);
				// }else if(shipname === "Star Enterprize"){
				// 	that.getView().byId("shiftdetail").setValueState(sap.ui.core.ValueState.None)
				// }
				
				// this.getView().byId("MaterialSearch").setValue("");

				//  searchValue=this.getView().byId("MaterialSearch").setValue("").mProperties.value
				// this.onSearch();
			} else if (Materialdes.length > 0) {
				var message = "Quantity of following Material " + Materialdes.join(",") + " " +"cannot be zero or less than zero";

				sap.m.MessageBox.show(
					message,
					sap.m.MessageBox.Icon.WARNING,
					"warning"
				);

			}  else {
				this.getView().getModel("addCardData").setProperty("/ShipName", shipname);
				this.getView().getModel("addCardData").setProperty("/shipType", shiptype);
				var router = sap.ui.core.UIComponent.getRouterFor(this);
				router.navTo("detailPage", {
					loginId: id,
				})
			}

		},


		onStepInputChange: function (oEvent) {
			//debugger
			BusyIndicator.show(0);
			var appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			var appModulePath = jQuery.sap.getModulePath(appPath);

			var oSource = oEvent.getSource();
			var oBindingContext = oEvent.getSource().getBindingContext("addCardData");
			var acardDetails = this.getView().getModel("addCardData").getData();
			iNewQuantity = oEvent.getParameter("value");
			var uItems = oEvent.oSource.oParent.mAggregations.items[0].mProperties.text

			// var iNetpriceCal=0
			// var exgrandTotal=0
			// for (let i = 0; i < acardDetails.value.length; i++) {
			// 	for (let j = 0; j < oEvent.oSource.oParent.mAggregations.items.length; j++) {
			// 		if (acardDetails.value[i].MATERIAL_DESC === oEvent.oSource.oParent.mAggregations.items[j].mProperties.text) {

			// 			iNetpriceCal= parseInt(acardDetails.value[i].NET_AMOUNT) * iNewQuantity	

			// 		}

			// 	}

			// }
			var oModel = this.getView().getModel("addCardData");
			var aResults = oModel.getProperty("/value");
			var oProduct = oBindingContext.getObject();
			oProduct.QUANTITY = iNewQuantity;
			var taxprodu = (Number(oProduct.IGST_PERC) + Number(oProduct.SGST_PERC))* oProduct.QUANTITY
			oProduct.TOTAL_AMOUNT = (parseFloat(oProduct.NET_AMOUNT) * iNewQuantity);

			oModel.setProperty("/value", aResults);


			if(oProduct.QUANTITY === 0 || oProduct.QUANTITY <0 ){

				var structureData = [];

				// for (let i = 0; i < acardDetails.value.length; i++) {
	
				structureData = {
					"DISTRIBUTOR_ID": oProduct.DISTRIBUTOR_ID,
					"CART_ID": oProduct.CART_ID,
					"MATERIAL_CODE": oProduct.MATERIAL_CODE,
					"MATERIAL_DESC": oProduct.MATERIAL_DESC,
					"IMAGE_URL": oProduct.IMAGE_URL,
					"HSN_CODE": "999999",
					"UNIT_OF_MEASURE": oProduct.UNIT_OF_MEASURE,
					"QUANTITY": parseInt(oProduct.QUANTITY),
					"FREE_QUANTITY": null,
					"STD_PRICE": null,
					"BASE_PRICE": null,
					"DISC_AMOUNT": null,
					"DISC_PERC": null,
					"NET_AMOUNT": oProduct.NET_AMOUNT,
					"TOTAL_AMOUNT": oProduct.TOTAL_AMOUNT.toString(),
					"CGST_PERC": oProduct.CGST_PERC,
					"CGST_AMOUNT": null,
					"SGST_PERC": oProduct.SGST_PERC,
					"SGST_AMOUNT": null,
					"IGST_PERC": oProduct.IGST_PERC,
					"IGST_AMOUNT": null,
					"TAXES_AMOUNT": oProduct.TAXES_AMOUNT.toString()
				}

				var oPayload =
				{
					"action": "CART",
					"appType": "DELETE",
					"prHeader": [],
					"prCart": [structureData],
					"prItems": [],
					"prEvent": [],
					"userDetails": {
						"USER_ROLE": "CEO",
						"USER_ID": "aniket.s@intellectbizware.com"
					}
				}
				var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
				oPayload = JSON.stringify(oPayload)
				$.ajax({
					type: "POST",
					url: surl,
					data: oPayload,
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function (value) {
						//debugger;
						BusyIndicator.hide(0);
						// MessageBox.success(value.value.OUT_SUCCESS);
						that.showdata()

					that.getView().getModel("addCardData").refresh();
	
						
					
	
					},
	
					error: function (oError) {
						//debugger;
						BusyIndicator.hide()
						MessageBox.error(JSON.parse(oError.responseText).error.message);
	
					}
	
	
				});

			}else{
			var structureData = [];

			// for (let i = 0; i < acardDetails.value.length; i++) {

			structureData = {
				"DISTRIBUTOR_ID": oProduct.DISTRIBUTOR_ID,
				"CART_ID": oProduct.CART_ID,
				"MATERIAL_CODE": oProduct.MATERIAL_CODE,
				"MATERIAL_DESC": oProduct.MATERIAL_DESC,
				"IMAGE_URL": oProduct.IMAGE_URL,
				"HSN_CODE": "999999",
				"UNIT_OF_MEASURE": oProduct.UNIT_OF_MEASURE,
				"QUANTITY": parseInt(oProduct.QUANTITY),
				"FREE_QUANTITY": null,
				"STD_PRICE": null,
				"BASE_PRICE": null,
				"DISC_AMOUNT": null,
				"DISC_PERC": null,
				"NET_AMOUNT": oProduct.NET_AMOUNT,
				"TOTAL_AMOUNT": oProduct.TOTAL_AMOUNT.toString(),
				"CGST_PERC": oProduct.CGST_PERC,
				"CGST_AMOUNT": null,
				"SGST_PERC": oProduct.SGST_PERC,
				"SGST_AMOUNT": null,
				"IGST_PERC": oProduct.IGST_PERC,
				"IGST_AMOUNT": null,
				"TAXES_AMOUNT": oProduct.TAXES_AMOUNT.toString()
			}
			// }

			var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
			var oPayload = {

				"action": "CART",
				"appType": "CREATE",
				"prHeader": [],
				"prCart": [structureData],
				"prItems": [],
				"prEvent": [],
				"userDetails": {
					"USER_ROLE": "CEO",
					"USER_ID": "aniket.s@intellectbizware.com"
				}

			}

			oPayload = JSON.stringify(oPayload)
			$.ajax({
				type: "POST",
				url: surl,
				data: oPayload,
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function (value) {
					//debugger;
					// MessageBox.success(value.value.OUT_SUCCESS);

					// if (sAction === "YES") {
					//   that.navToView1()

					//   oDataModel.refresh(true);

					// }
					// that.onSetData()
					// that.readCategories();
					BusyIndicator.hide(0);
					that.showdata()

					that.getView().getModel("addCardData").refresh();

				},

				error: function (oError) {
					//debugger;
					BusyIndicator.hide()
					MessageBox.error(JSON.parse(oError.responseText).error.message);

				}


			});

			that.calculateTotal();

		}
		},

		calculateTotal: function (oEvent) {
			//debugger
			var total = 0;
			var payload = that.getView().getModel("addCardData").getData();
			// if (payload.value.length > 0) {
			// 	payload.value.forEach(item => {
			// 		total = TOTAL_AMOUNT + parseFloat(item.TOTAL_AMOUNT);
			// 	});
			// }
			// that.getView().getModel().setProperty("/totalAmount", total.toFixed(3));



			var exgrandTotal = 0
			for (let i = 0; i < payload.value.length; i++) {
				exgrandTotal += parseInt(payload.value[i].TOTAL_AMOUNT, 10)

			}
			that.getView().getModel("addCardData").setProperty("/GrandTotal", exgrandTotal.toFixed(2));

		},


		

		// onDeleteCartfrag: function (oEvent) {
		// 	//debugger
		// 	that = this;
		// 	if (!that._saveFragment) {
		// 		that._saveFragment = sap.ui.xmlfragment(
		// 			"com.ibs.ibsappidealsalesorder.view.fragments.deleteCartData",
		// 			that
		// 		);
		// 		that.getView().addDependent(that._saveFragment);
		// 	}
		// 	that._saveFragment.open();
		// },
		// closeMatDialog: function () {
		// 	that = this;
		// 	this._saveFragment.close();
		// },

		onDeleteCart: function (oEvent) {
			//debugger
			// this.closeMatDialog();
			// var delData = [];
			that = this;
			BusyIndicator.show(0);
			// var counter = 1;
			// that.getView().getModel().getData().results.forEach(item => {
			// 	item.counter = counter;
			// 	counter++;
			// });
			// that.getView().getModel().setProperty("/finalCounter", counter - 1);
			// that.calculateTotal();


			// var temp = that.getView().getModel("addCardData").getData().value;
			// for (var i = 0; i < temp.length; i++) {
			// 	delData.push(temp[i])
			// }




			var appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			var appModulePath = jQuery.sap.getModulePath(appPath);
			var oData = that.getView().getModel("addCardData").getData().value

			if (oData.length === 0) {
				MessageBox.error("No materials to delete")
			} else {

				MessageBox.confirm("Do you want to delete the cart?", {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					onClose: function (oAction) {
						if (oAction === 'OK') {



							var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
							var payload = {
								"action": "CART",
								"appType": "DELETEALL",
								"prHeader": [],
								"prCart": oData,
								"prItems": [],
								"prEvent": [],
								"userDetails": {
									"USER_ROLE": "CEO",
									"USER_ID": "aniket.s@intellectbizware.com"
								}
							}
							cardeleteData = JSON.stringify(payload)
							$.ajax({
								type: "POST",
								url: surl,
								data: cardeleteData,
								contentType: "application/json; charset=utf-8",
								dataType: "json",
								success: function (result) {
									//debugger;
									BusyIndicator.hide(0);
									// MessageBox.success(result.value.OUT_SUCCESS)
									//    that.showdata()
									//    this.runSaveFunction();



									MessageBox.success(result.value.OUT_SUCCESS, {
										actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
										emphasizedAction: MessageBox.Action.OK,
										onClose: function (oAction) {
											if (oAction === 'OK') {
												//debugger
												var router = sap.ui.core.UIComponent.getRouterFor(that);
												router.navTo("View3", {
													D_loginId: id
												});

											}
										}
									}
									);


								},

								error: function (oError) {
									//debugger;
									BusyIndicator.hide()
									MessageBox.error("Error");

								}
							});

						}
					}
				}
				)
			}
		},




		onIinitiateOrder: function (oEvent) {
			//debugger

			if (!that._sumFragment) {
				that._sumFragment = sap.ui.xmlfragment(
					"com.ibs.ibsappidealsalesorder.view.fragments.orderSummary",
					that
				);
				that.getView().addDependent(that._sumFragment);
			}
			that._sumFragment.open();

		},

		closeSumDialog: function (oEvent) {
			this._sumFragment.close();
		},



		onSearch: function (oEvent) {
			//debugger
			var NewFilter=[];


			if(searchValue === ""){
				var oBinding = that.getView().byId("list").getBinding("items");
				oBinding.filter(NewFilter);
			}
			var sQuery = oEvent.getSource().getValue();
			var aFilters = [];
			
		
			 if (sQuery && sQuery.length > 0) {
				var oFilter = new sap.ui.model.Filter("MATERIAL_DESC", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(oFilter);
			}

			// var oList = this.byId("list1");
			var oBinding = that.getView().byId("list").getBinding("items");
			oBinding.filter(aFilters);
		},


	





		onDeletePress: function (oEvent) {
			//debugger

			// MessageBox.error("Do you Want Delete Cart");

			MessageBox.confirm("Do you want to delete the material?", {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (oAction) {
					if (oAction === 'OK') {
						//debugger
						// var acardDetails = this.getView().getModel("addCardData").getData();
						var MaterialDes;

						obj = oEvent.getSource().getBindingContext("addCardData").getObject();
						var appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
						var appPath = appId.replaceAll(".", "/");
						var appModulePath = jQuery.sap.getModulePath(appPath);
						var surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"


					var	CartItems = {
							"DISTRIBUTOR_ID": obj.DISTRIBUTOR_ID,
							"CART_ID": obj.CART_ID,
							"MATERIAL_CODE": obj.MATERIAL_CODE,
							"MATERIAL_DESC": obj.MATERIAL_DESC,
							"IMAGE_URL": obj.IMAGE_URL,
							"HSN_CODE": "999999",
							"UNIT_OF_MEASURE": obj.UNIT_OF_MEASURE,
							"QUANTITY": parseInt(obj.QUANTITY),
							"FREE_QUANTITY": null,
							"STD_PRICE": null,
							"BASE_PRICE": null,
							"DISC_AMOUNT": null,
							"DISC_PERC": null,
							"NET_AMOUNT": obj.NET_AMOUNT,
							"TOTAL_AMOUNT": obj.TOTAL_AMOUNT.toString(),
							"CGST_PERC": obj.CGST_PERC,
							"CGST_AMOUNT": null,
							"SGST_PERC": obj.SGST_PERC,
							"SGST_AMOUNT": null,
							"IGST_PERC": obj.IGST_PERC,
							"IGST_AMOUNT": null,
							"TAXES_AMOUNT": obj.TAXES_AMOUNT.toString()
						}




						var delelte =
						{
							"action": "CART",
							"appType": "DELETE",
							"prHeader": [],
							"prCart": [CartItems],
							"prItems": [],
							"prEvent": [],
							"userDetails": {
								"USER_ROLE": "CEO",
								"USER_ID": "aniket.s@intellectbizware.com"
							}
						}
						oDeletedata = JSON.stringify(delelte)
						$.ajax({
							type: "POST",
							url: surl,
							data: oDeletedata,
							contentType: "application/json; charset=utf-8",
							dataType: "json",
							success: function (result) {
								//debugger;
								// MessageBox.success(result.value.OUT_SUCCESS)

								that.showdata()

								that.getView().getModel("addCardData").refresh();

							},

							error: function (oError) {
								//debugger;
								BusyIndicator.hide()
								MessageBox.error(JSON.stringify(oError.responseText));

							}
						});


					}
				}
			}
			)







			// delData.push(obj.MATERIAL_CODE);
			// var index = that.getView().getModel().getData().results.findIndex(item => item.MaterialCode === obj.MaterialCode);
			// that.getView().getModel().getData().results.splice(index, 1);
			// that.getView().getModel().setData(that.getView().getModel().getData());
			// var counter = 1;
			// that.getView().getModel().getData().results.forEach(item => {
			// 	item.counter = counter;
			// 	counter++;
			// });
			// that.getView().getModel().setProperty("/finalCounter", counter - 1);
			// that.calculateTotal();
		},

		shipdetail: function () {
			//debugger

			var suppQuo = "1100013"
			var oFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, suppQuo);
			that.oDataModel.read("/SHIPTOSet", {
				filters: [oFilter],
				success: function (oData, resp) {
					//debugger
					var ship = new JSONModel(oData);
					that.getView().setModel(ship, "shipDetail");

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


			if(shipname){
				that.getView().byId("shiftdetail").setValueState(sap.ui.core.ValueState.None)
			}

			//  var shipname1 = new JSONModel(shipname);
			//  that.getOwnerComponent().setModel(shipname1, "shipData");


		},


	});
});