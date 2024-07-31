sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"com/ibs/ibsappidealsalesorder/model/formatter",
	"sap/ui/Device",
	"sap/ui/core/BusyIndicator"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController, JSONModel, Filter, FilterOperator, MessageBox, MessageToast, formatter, Device, BusyIndicator) {
		"use strict";
		var that, categoriesModel, addCartBtn, supplierModel, categoriesModel1, counter, data, favModel, favModel1;
		var itemsData = [];
		var surl, id, Quantity, tax, localData;
		var products = {}
		return BaseController.extend("com.ibs.ibsappidealsalesorder.controller.View3", {
			formatter: formatter,
			onInit: function () {
				//debugger
				that = this;
				products = {
					"results": []
				}
				BusyIndicator.show()
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.getRoute("View3");

				var getRoute = oRouter.getRoute("View3");
				getRoute.attachPatternMatched(this._onRouteMatched, this);

				// com.twinnigssalesorder.draft = "No" // For 
				that.oDataModel = this.getOwnerComponent().getModel();
				categoriesModel = new sap.ui.model.json.JSONModel();
				supplierModel = new sap.ui.model.json.JSONModel();
				categoriesModel1 = new sap.ui.model.json.JSONModel();
				favModel = new sap.ui.model.json.JSONModel()
				favModel1 = new sap.ui.model.json.JSONModel()

				counter = 0;
				this.loadjQueryEasingScript(function () { });
				that.readCategories();
				that.readFavMaaterial()
				// BusyIndicator.hide();
				// that.calculatecart();
				// BusyIndicator.hide()

			},

			_onRouteMatched: function (oEvent) {
				//debugger
				// jQuery.sap.delayedCall(700, this, function () {
				// 	BusyIndicator.show(0);
				// });
				BusyIndicator.show(0);
				var g = this.getView().getParent().getParent();
				g.toBeginColumnPage(this.getView())
				id = oEvent.getParameter('arguments').D_loginId;
				that.loadjQueryEasingScript(function () { });
				that.readCategories();
				that.readFavMaaterial();
				// that.handleRefresh();
				
			},

			onSideNavButtonPress: function () {
				//debugger
				var oToolPage = this.byId("toolpageID");
				var bSideExpanded = oToolPage.getSideExpanded();
				//this._setToggleButtonTooltip(bSideExpanded);
				oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
			},


			readCategories: function () {
				//debugger
				BusyIndicator.show(0);
				that.oDataModel.read("/MaterialGroupsSet", {
					urlParameters: {
						$expand: "NavMaterialSet"
					},
					success: function (oData, resp) {
						//debugger
						BusyIndicator.hide();
						//that.addSelection();
						// that.readDraft();
						// BusyIndicator.hide()
						that.cardDetails(oData);



					},
					error: function (error) {
						BusyIndicator.hide();
						sap.m.MessageToast.show("Cannot load Categories " + JSON.stringify(error));
					}

				});
			},

			readFavMaaterial: function () {
				//debugger
				BusyIndicator.show(0);
				that.oDataModel.read("/FavoriteMaterialSet", {
					success: function (oData, resp) {
						//debugger
						BusyIndicator.hide(0);
						// var favMaterials = new sap.ui.model.json.JSONModel(oData);
						// that.getView().setModel(favMaterials, "favMaterials");
						// BusyIndicator.hide()
						that.readSupplier();
						that.cardDetailsFav(oData);

					},
					error: function (error) {
						BusyIndicator.hide();
						sap.m.MessageToast.show("Cannot load Favorite Materials " + JSON.stringify(error));
					}

				});

			},
			
			calculatecartmaterailaca: function () {
				//debugger
				BusyIndicator.show(0);
				var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
				var appPath = appId.replaceAll(".", "/");
				var appModulePath = jQuery.sap.getModulePath(appPath);
				var no = "1100013";
				var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrCart?$filter=(DISTRIBUTOR_ID eq '" + no + "')";
				$.ajax({
					url: url,
					type: 'GET',
					data: null,
					contentType: 'application/json',
					success: function (data, responce) {
						//debugger
						BusyIndicator.hide(0);
						var counter = data.length;

						adddcard = new sap.ui.model.json.JSONModel(data);
						that.getView().setModel(adddcard, "addCardData");




					},
					error: function (e) {
						//debugger
						BusyIndicator.hide();
						MessageBox.error("error");
					}
				});
			},






			onAddToCartPress: async function (oEvent) {
				//debugger
				BusyIndicator.show();
				var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
				var appPath = appId.replaceAll(".", "/");
				var appModulePath = jQuery.sap.getModulePath(appPath);
				that = this;
				addCartBtn = oEvent;
				com.ibs.ibsappidealsalesorder.data = "X";
				com.ibs.ibsappidealsalesorder.check = "Yes"; // To check if new products have been added or not
				var obj = oEvent.getSource().getParent().getParent().getBindingContext("category").getObject();

				// tax = Number(obj.Cgst_per) + Number(obj.Sgst_per)
				var protax = Number(obj.Cgst_per) + Number(obj.Sgst_per)
				// tax= protax * obj.Quantity
				Quantity = oEvent.getSource().getParent().mAggregations.items[0].mProperties.value;

				if(Quantity <=0 ){
					MessageBox.error("Please add more than zero quantity");
				}else{

				var existingObjIndex = itemsData.findIndex(item => item.MaterialCode === obj.MaterialCode);
				if (existingObjIndex !== -1) {
					itemsData[existingObjIndex].Quantity = Quantity;
					obj.FavoriteCount = "x";
					//counter++;
				} else {

					obj.Quantity = Quantity;
					obj.TOTAL_AMOUNT = obj.Quantity * Number(obj.NetPrice)


					var total = (obj.NetPrice * obj.Quantity) 

					// var total = (obj.NetPrice * obj.Quantity) + tax

					if (products.results.length == 0) {
						products.results.push(obj)
						var allData = new JSONModel(products);
						this.getOwnerComponent().setModel(allData, "aAllData");
					}
					else {
						var foundMatch = false;
						for (var i = 0; i < products.results.length; i++) {
							if (products.results[i].MaterialDes === obj.MaterialDes) {
								// Update quantity and total amount
								products.results[i].Quantity = obj.Quantity;
								products.results[i].TOTAL_AMOUNT = obj.TOTAL_AMOUNT;
								foundMatch = true;
								break; // Exit the loop since we found a match
							}
						}

						if (!foundMatch) {
							// Add new product to the cart
							products.results.push(obj);
						}

						// Create a new JSONModel with the updated products object
						var allData = new JSONModel(products);
						this.getOwnerComponent().setModel(allData, "aAllData");


					}

					var CartPresentdata = await this.showdata(obj.MaterialCode);
					//debugger
					if (CartPresentdata.value.length > 0) {
						//debugger
						total = CartPresentdata.value[0].NET_AMOUNT * (obj.Quantity + CartPresentdata.value[0].QUANTITY)
						obj.Quantity = obj.Quantity + CartPresentdata.value[0].QUANTITY;
					}
					// else{
					// 	total
					// }
					var structureData = {
						"DISTRIBUTOR_ID": id,
						"CART_ID": 1,
						"MATERIAL_CODE": obj.MaterialCode,
						"MATERIAL_DESC": obj.MaterialDes,
						"IMAGE_URL": obj.ImageUrl,
						"HSN_CODE": "999999",
						"UNIT_OF_MEASURE": obj.Uom,
						"QUANTITY": parseInt(obj.Quantity),
						"FREE_QUANTITY": null,
						"STD_PRICE": null,
						"BASE_PRICE": null,
						"DISC_AMOUNT": null,
						"DISC_PERC": null,
						"NET_AMOUNT": obj.NetPrice,
						"TOTAL_AMOUNT": total.toString(),
						"CGST_PERC": obj.Cgst_per,
						"CGST_AMOUNT": null,
						"SGST_PERC": obj.Sgst_per,
						"SGST_AMOUNT": null,
						"IGST_PERC": obj.Igst_per,
						"IGST_AMOUNT": null,
						"TAXES_AMOUNT": protax.toString()
					}

					// }
					obj.FavoriteCount = "x";
					delete obj.__metadata;
					itemsData = []
					itemsData.push(structureData);
					counter++;
					that.addAnimation(oEvent);
					surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
					var oPayload = {

						"action": "CART",
						"appType": "CREATE",
						"prHeader": [],
						"prCart": itemsData,
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
							BusyIndicator.hide();
							// MessageBox.success(value.value.OUT_SUCCESS);

							// if (sAction === "YES") {
							//   that.navToView1()

							//   oDataModel.refresh(true);

							// }
							// that.onSetData()
							that.readCategories();

						},

						error: function (oError) {
							//debugger;
							BusyIndicator.hide()
							MessageBox.error(JSON.parse(oError.responseText).error.message);

						}


					});

					oEvent.getSource().setType("Success");
					MessageToast.show("Item added to cart: " + obj.MaterialDes);
					that.getView().getModel("category1").setProperty("/finalCounter", counter);
				}
			}
			BusyIndicator.hide();
			},

			favonStepInputChange : function(oEvent){
				//debugger
				var iNewQuantity = oEvent.getParameter("value");
				if(iNewQuantity <=0 ){
					this.readFavMaaterial()
					MessageBox.error("Please add more than zero quantity");
				}else{

				}
			},
			categoryonStepInputChange : function(oEvent){
				var iNewQuantity = oEvent.getParameter("value");
				if(iNewQuantity <=0 ){
					this.readCategories()
					MessageBox.error("Please add more than zero quantity");
				}
			},
			onAddToCartFavPress: async function (oEvent) {
				//debugger
				BusyIndicator.show()
				var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
				var appPath = appId.replaceAll(".", "/");
				var appModulePath = jQuery.sap.getModulePath(appPath);
				that = this;
				addCartBtn = oEvent;
				com.ibs.ibsappidealsalesorder.data = "X";
				com.ibs.ibsappidealsalesorder.check = "Yes"; // To check if new products have been added or not
				var obj = oEvent.getSource().getBindingContext("favMaterials").getObject();
				// var supplier = this.getView().byId("supplier").getSelectedItems()[0].mProperties.title;

				var protax = Number(obj.Cgst_per) + Number(obj.Sgst_per)
				// tax= protax * obj.Quantity
				var Quantity = oEvent.getSource().getParent().mAggregations.items[0].mProperties.value;
				if(Quantity <=0 ){
					MessageBox.error("Please add more than zero quantity");
				}else{
				var existingObjIndex = itemsData.findIndex(item => item.MaterialCode === obj.MaterialCode);
				if (existingObjIndex !== -1) {
					itemsData[existingObjIndex].Quantity = Quantity;
					obj.FavoriteCount = "x";
					counter++;
				} else {
					obj.Quantity = Quantity;
					// var data= {
					// 	category : obj,
					// 	supplierData : supplier
					// }
					var total = (obj.NetPrice * obj.Quantity) 

					// var total = (obj.NetPrice * obj.Quantity) + tax
					// var variable=that.getOwnerComponent().getModel("addCardData")
					// //debugger
					// for (let i = 0; i < variable.value.length; i++) {
					// 	//debugger
					// 	if(variable.value[i].MATERIAL_DESC === obj.MaterialDe ){
					// 	}

					// }

					var CartPresentdata = await this.showdata(obj.MaterialCode);
					//debugger
					if (CartPresentdata.value.length > 0) {
						//debugger
						total = CartPresentdata.value[0].NET_AMOUNT * (obj.Quantity + CartPresentdata.value[0].QUANTITY)
						obj.Quantity = obj.Quantity + CartPresentdata.value[0].QUANTITY;
					}
				
					var structureData = {
						"DISTRIBUTOR_ID": id,
						"CART_ID": 1,
						"MATERIAL_CODE": obj.MaterialCode,
						"MATERIAL_DESC": obj.MaterialDes,
						"IMAGE_URL": obj.ImageUrl,
						"HSN_CODE": "999999",
						"UNIT_OF_MEASURE": obj.Uom,
						"QUANTITY": parseInt(obj.Quantity),
						"FREE_QUANTITY": null,
						"STD_PRICE": null,
						"BASE_PRICE": null,
						"DISC_AMOUNT": null,
						"DISC_PERC": null,
						"NET_AMOUNT": obj.NetPrice,
						"TOTAL_AMOUNT": total.toString(),
						"CGST_PERC": obj.Cgst_per,
						"CGST_AMOUNT": null,
						"SGST_PERC": obj.Sgst_per,
						"SGST_AMOUNT": null,
						"IGST_PERC": obj.Igst_per,
						"IGST_AMOUNT": null,
						"TAXES_AMOUNT": protax.toString()
					}
					obj.FavoriteCount = "x";
					delete obj.__metadata;
					itemsData = []
					itemsData.push(structureData);
					counter++;
					that.addAnimation(oEvent);
				}

				surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"
				var oPayload = {

					"action": "CART",
					"appType": "CREATE",
					"prHeader": [],
					"prCart": itemsData,
					"prItems": [],
					"prEvent": [],
					"userDetails": {
						"USER_ROLE": "DIST",
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
						that.readFavMaaterial()
					},

					error: function (oError) {
						//debugger;
						BusyIndicator.hide()
						MessageBox.error(JSON.parse(oError.responseText).error.message);

					}
				});

				oEvent.getSource().setType("Success");
				MessageToast.show("Item added to cart: " + obj.MaterialDes);
				that.getView().getModel("category1").setProperty("/finalCounter", counter);
			}
			BusyIndicator.hide();
			},
			addAnimation: function (oEvent) {
				//debugger
				var oButton = oEvent.getSource();
				var oImage = oButton.getParent().getParent().getItems()[0].getItems()[0]; // Assuming the image is the first child of the parent VBox
				var oCartIcon = this.getView().byId("cartButton");

				var oImageRect = oImage.getDomRef().getBoundingClientRect();
				var oCartRect = oCartIcon.getDomRef().getBoundingClientRect();

				if (oImageRect && oCartRect) {
					var iItemX = oImageRect.left;
					var iItemY = oImageRect.top;
					var iCartX = oCartRect.left;
					var iCartY = oCartRect.top;

					var $imgClone = oImage.$().clone()
						.css({
							'opacity': '0.5',
							'position': 'absolute',
							'height': '150px',
							'width': '150px',
							'z-index': '100',
							'top': iItemY,
							'left': iItemX
						})
						.appendTo('body')
						.animate({
							'top': iCartY + 10,
							'left': iCartX + 10,
							'width': 75,
							'height': 75
						}, 1000, 'swing');

					setTimeout(function () {
						// oCartIcon.$().effect("shake", {
						// 	times: 2
						// }, 
						// 200);
					},
						1500);

					$imgClone.animate({
						'width': 0,
						'height': 0
					}, function () {
						$(this).detach();
					});
				}
			},

			loadjQueryEasingScript: function (callback) {
				//debugger
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js";

				// When the script is loaded, execute the callback function
				script.onload = callback;

				// Append the script element to the document's head
				document.head.appendChild(script);
			},


			onSetData: function (oEvent) {
				//debugger
				var iGrandTotal = 0;
				if (com.ibs.ibsappidealsalesorder.data === "Y") {
					itemsData = [];
				}

				var payload = {
					results: itemsData
				};

				var allData = new JSONModel(payload);
				this.getOwnerComponent().setModel(allData, "aAllData");

				for (let i = 0; i < payload.results.length; i++) {
					iGrandTotal += payload.results[i].TOTAL_AMOUNT
				}

				that.getView().getModel("aAllData").setProperty("/GrandTotal", iGrandTotal)



			},
			onCart: function (oEvent) {
				//debugger
				BusyIndicator.show(0);
				this.getView().byId("search").setValue("");
				var router = sap.ui.core.UIComponent.getRouterFor(this);
				router.navTo("Cart", {
					loginId: id
				});

				// var iGrandTotal= 0; 
				// if (com.ibs.ibsappidealsalesorder.data === "Y") {
				// 	itemsData = [];
				// }
				// if (addCartBtn !== undefined && itemsData.length !== 0) {
				// 	var payload = {
				// 		results: itemsData
				// 	};

				// 	var allData = new JSONModel(payload);
				// 	this.getOwnerComponent().setModel(allData, "aAllData");

				// 	for (let i=0; i<payload.results.length; i++) {
				// 		iGrandTotal +=payload.results[i].TOTAL_AMOUNT
				// 	}

				// 	that.getView().getModel("aAllData").setProperty("/GrandTotal" ,iGrandTotal )



				// itemsData = [];
				// } else {
				// 	// BusyIndicator.hide()
				// 	return MessageBox.error("Please add atleast one product in cart");
				// }
			},

			readSupplier: function () {
				//debugger
				that.oDataModel.read("/CustomerHelpSet", {
					success: function (oData, resp) {
						//debugger
						supplierModel.setData(oData);
						that.getView().setModel(supplierModel, "supplier");
						BusyIndicator.hide();

					},
					error: function (error) {
						BusyIndicator.hide();
						sap.m.MessageToast.show("Cannot load Categories " + JSON.stringify(error));
					}

				});
			},

			onListItemPress: function (oEvent) {
				//debugger
				var sValue = oEvent.getSource().getProperty("text");
				// that.getView().getModel("category").setProperty("/results", data);
				var oFilter = new sap.ui.model.Filter("MaterialGroupDes", sap.ui.model.FilterOperator.Contains, sValue);
				var bindings = that.getView().byId("list").getBinding("items");
				bindings.filter([oFilter]);
				that.onSideNavButtonPress();
			},

			


			onSearch: function (oEvent) {
				//debugger
				var sValue = oEvent.getParameter("newValue");
				if (sValue) {
					sValue = sValue.toLowerCase();
				}
				if (sValue === undefined) {
					sValue = "";
				}
				// var oFilter = new sap.ui.model.Filter({
				// 	filters: [
				// 		new sap.ui.model.Filter("NavMaterialSet/results", function (aResults) {
				// 			return aResults.some(function (oResult) {
				// 				return oResult.MaterialDes.toLowerCase().includes(sValue);
				// 			});
				// 		})
				// 	],
				// 	and: false
				// });

				var oBinding = that.getView().byId("list").getBinding("items");
				// oBinding.getModel().setProperty("/results", data);
				var aAllData = oBinding.getCurrentContexts().map(context => context.getObject());
				if (sValue != '' && sValue != null && sValue != undefined) {
					var aFilteredData = aAllData.map(parentObj => {
						var aFilteredChildArray = parentObj.NavMaterialSet.results.filter(childObj => {
							return childObj.MaterialDes.toLowerCase().includes(sValue);
						});
						if (aFilteredChildArray.length > 0) {
							return Object.assign({}, parentObj, {
								NavMaterialSet: {
									results: aFilteredChildArray
								}
							});
						} else {
							return null;
						}
					}).filter(Boolean);

					oBinding.getModel("category").setProperty("/results", aFilteredData);
				} else {
					aAllData = that.getView().getModel("localData").getData();
					oBinding.getModel("category").setProperty("/results", aAllData.results);
				}

			},

			handleRefresh: function (oEvent) {
				//debugger
		
            //  var aFilters=[]
			//  var oBinding = that.getView().byId("list").getBinding("items");
			//  oBinding.push(aFilters)
				
			
			var oFilter = [];
			var bindings = this.byId("list").getBinding("items");
			// this.byId("tTable").getBinding("items")== show all the data form the table with bocoz filter the data form the table 
			bindings.filter(oFilter);
			
			  var oToolPage = this.byId("toolpageID");
				var bSideExpanded = oToolPage.getSideExpanded(false)
				oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
				
				// 	var oStepInput = this.byId("stepinput");
				// 	oStepInput.setValue(1);
				// 	var oStepInput1 = this.byId("step");
				// 	oStepInput1.setValue(1);
				// 	var oCartButton = this.byId("cartButton");
				//    oCartButton.setText("Cart"); 

			},


			cardDetails: function (productDetails) {
				//debugger

				BusyIndicator.show()
				var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
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
						//debugger
						BusyIndicator.hide()
						var iGrandTotal = 0
						var QuantityFlag = false;

						// adddcard = new sap.ui.model.json.JSONModel(data);
						// that.getView().setModel(adddcard, "addCardData");


						var cartprductquantity;
						for (let i = 0; i < data.value.length; i++) {
							iGrandTotal += data.value[i].TOTAL_AMOUNT
						}
						// that.getView().getModel("addCardData").setProperty("/GrandTotal" ,iGrandTotal )
						// bnz= that.getView().getModel("addCardData").getData();
						that.getView().byId("count").setValue(data.value.length);
						// that.getView().byId("addedequntiy").setValue(cartprductquantity);


						for (let i = 0; i < productDetails.results.length; i++) {
							//debugger
							for (let j = 0; j < productDetails.results[i].NavMaterialSet.results.length; j++) {
								for (let k = 0; k < data.value.length; k++) {
									if (productDetails.results[i].NavMaterialSet.results[j].MaterialCode === data.value[k].MATERIAL_CODE) {
										productDetails.results[i].NavMaterialSet.results[j].cartBtn = 'Success';
										productDetails.results[i].NavMaterialSet.results[j].gQuantity = data.value[k].QUANTITY;
										QuantityFlag = true;
									} else {
										QuantityFlag = false
									}
									if (k === data.value.length - 1 && QuantityFlag === true || k === data.value.length - 1 && QuantityFlag === false) {
										// productDetails.results[i].NavMaterialSet.results[j].cartBtn = 'Default';
										productDetails.results[i].NavMaterialSet.results[j].Quantity = 1;
									}
								}
								if (data.value.length === 0) {
									// productDetails.results[i].NavMaterialSet.results[j].cartBtn = 'Default';
									productDetails.results[i].NavMaterialSet.results[j].Quantity = 1;
								}


							}

						}
						categoriesModel.setData(productDetails);
						categoriesModel1.setData(productDetails);
						that.getView().setModel(categoriesModel1, "category1");
						that.getView().setModel(categoriesModel, "category");

						var localData = new JSONModel(Object.assign({}, productDetails))
						that.getView().setModel(localData, "localData")

						if (Device.system.desktop) {
							//debugger
							that.getView().getModel("category").setProperty("/cardCount", 5);
						} else if (Device.system.phone) {
							that.getView().getModel("category").setProperty("/cardCount", 2);

						}
						
						BusyIndicator.hide();

					},
					error: function (e) {
						//debugger
						BusyIndicator.hide();
						MessageBox.error(e.responseText);
					}
				});
			},

			cardDetailsFav: function (productDetails) {
				//debugger
				BusyIndicator.show(0);
				var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
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
						//debugger
						BusyIndicator.hide(0);
						var iGrandTotal = 0
						var QuantityFlag = false;

						// adddcard = new sap.ui.model.json.JSONModel(data);
						// that.getView().setModel(adddcard, "addCardData");



						for (let i = 0; i < data.value.length; i++) {

							iGrandTotal += data.value[i].TOTAL_AMOUNT
						}
						// that.getView().getModel("addCardData").setProperty("/GrandTotal" ,iGrandTotal )
						// bnz= that.getView().getModel("addCardData").getData();
						that.getView().byId("count").setValue(data.value.length);

						for (var i = 0; i < productDetails.results.length; i++) {
							//debugger							
							productDetails.results[i].Quantity = 1;
							productDetails.results[i].cartBtn = 'Default';

							for (let k = 0; k < data.value.length; k++) {
								if (productDetails.results[i].MaterialCode === data.value[k].MATERIAL_CODE) {
									productDetails.results[i].cartBtn = 'Success';
									productDetails.results[i].gQuantity = data.value[k].QUANTITY;
									QuantityFlag = true;
								}else{
									QuantityFlag = false;
								}
							
								// if (data.value.length === 0) {
								// 				// productDetails.results[i].NavMaterialSet.results[j].cartBtn = 'Default';
								// 				productDetails.results[i].NavMaterialSet.results[k].Quantity = 1;
								// 			}
								
							}
						}


						// for (let i = 0; i < productDetails.results.length; i++) {
						// 	//debugger
						// 		productDetails.results[i].Quantity = '1';
						// 	productDetails.results[i].cartBtn = 'Default';
						// 	for (let j = 0; j < productDetails.results[i].NavMaterialSet.results.length; j++) {
						// 		for (let k = 0; k < data.value.length; k++) {
						// 			if (productDetails.results[i].NavMaterialSet.results[j].MaterialCode === data.value[k].MATERIAL_CODE) {
						// 				productDetails.results[i].NavMaterialSet.results[j].cartBtn = 'Success';
						// 				productDetails.results[i].NavMaterialSet.results[j].gQuantity = data.value[k].QUANTITY;
						// 				QuantityFlag = true;
						// 			} else {
						// 				QuantityFlag = false
						// 			}
						// 			if (k === data.value.length - 1 && QuantityFlag === true || k === data.value.length - 1 && QuantityFlag === false) {
						// 				// productDetails.results[i].NavMaterialSet.results[j].cartBtn = 'Default';
						// 				productDetails.results[i].NavMaterialSet.results[j].Quantity = 1;
						// 			}
						// 		}
						// 		if (data.value.length === 0) {
						// 			// productDetails.results[i].NavMaterialSet.results[j].cartBtn = 'Default';
						// 			productDetails.results[i].NavMaterialSet.results[j].Quantity = 1;
						// 		}


						// 	}

						// }







						favModel.setData(productDetails);
						that.getView().setModel(favModel, "favMaterials");

						if (Device.system.desktop) {
							//debugger
							that.getView().getModel("favMaterials").setProperty("/cardCount", 5);
						} else if (Device.system.phone) {
							that.getView().getModel("favMaterials").setProperty("/cardCount", 2);

						}
						BusyIndicator.hide();

					},
					error: function (e) {
						//debugger
						BusyIndicator.hide();
						MessageBox.error(e.responseText);
					}
				});
			},

			backNav: function () {
				//debugger;
				this.getView().byId("search").setValue("");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
				oRouter.navTo("RouteView1",
					{ loginId: id });
				// that.oDataModel.refresh(true)

				//window.history.go(-1);

			},
			showdata: async function (mDesc) {
				var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
				var appPath = appId.replaceAll(".", "/");
				var appModulePath = jQuery.sap.getModulePath(appPath);
				var no = 1100013;
				var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/PrCart?$filter=(DISTRIBUTOR_ID eq '" + no + "') and (MATERIAL_CODE eq '" + mDesc + "')";
				return new Promise(function (resolve, reject) {
					$.ajax({
						url: url,
						type: 'GET',
						data: null,
						contentType: 'application/json',
						success: function (data, response) {
							//debugger
							resolve(data);
						},
						error: function (e) {
							//debugger
							BusyIndicator.hide()
							MessageBox.error(e.responseText);
						}
					});
				});
			},
		});
	});