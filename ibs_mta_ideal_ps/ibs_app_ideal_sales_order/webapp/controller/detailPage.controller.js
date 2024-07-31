sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device",
    "com/ibs/ibsappidealsalesorder/model/formatter",
    "sap/ui/core/BusyIndicator"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageBox, Filter, FilterOperator, Device, formatter, BusyIndicator) {
        "use strict";
        var surl, distributorid, shiptype, shipname;
        var that, oDataModel, oPayload, previoius, eventData, gprocts, E_gprocts, EXPoPayload;
        //   var fullData = [];
        var id, order_type, paymen_method, region_code, ShipName;
        var retailerData, Exp_produt,EXPflag;
        var expData;
        return BaseController.extend("com.ibs.ibsappidealsalesorder.controller.detailPage", {
            formatter: formatter,
            onInit: function () {
                debugger

                // that.getView().getModel("iModel").setProperty("/Totamt" ,iTotalAmt )


                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("detailPage").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
                debugger
                BusyIndicator.hide();
                var iWindowWidth = window.innerWidth;
                if (iWindowWidth < 600) {
                    this.getView().byId("idMTable").setVisible(true);
                    this.getView().byId("table").setVisible(false);
                }
                else {
                    this.getView().byId("table").setVisible(true);
                    this.getView().byId("idMTable").setVisible(false);
                }

                var g = this.getView().getParent().getParent();
                g.toBeginColumnPage(this.getView())
                id = oEvent.getParameter('arguments').loginId;
                //  ShipName=oEvent.getParameter('arguments').SHIP_NAME
                that = this;

                that.userrole()

                // retailerData = that.getOwnerComponent().getModel("tModel");
                // previoius = that.getOwnerComponent().getModel("addCardData");

                // if (previoius === undefined || previoius === null) {

                // }
                // else {
                //     if (previoius.getData() === null) {
                //         previoius = null;
                //     }
                // }

                 EXPflag = oEvent.getParameters().arguments.FLAG;
                if(EXPflag === "true"){

                    retailerData = that.getOwnerComponent().getModel("tModel").getData();

                    this.getView().byId("Exp_table").setVisible(true)
                    this.getView().byId("table").setVisible(false)
                    this.getView().byId("expship").setVisible(true)
                   
                    this.getView().byId("expLship").setVisible(true)
                    this.getView().byId("expTextship").setVisible(true)
                    this.getView().byId("lableship").setVisible(false)
                    this.getView().byId("textShip").setVisible(false)


                    var Eobject = {
                        "value": retailerData
                    }
                    var ExcelTableprod = new JSONModel(Eobject)
                    that.getOwnerComponent().setModel(ExcelTableprod, "iModel");
                    Exp_produt = this.getOwnerComponent().getModel("iModel").getData();
                    var Exp_imodelLen = Exp_produt.value.length;
                    that.getView().byId("Exp_table").setVisibleRowCount(Exp_imodelLen);

                    //    var expship=oEvent.getParameter('arguments').shipName
                    //    var Excelship = new JSONModel(expship)
                    //     that.getOwnerComponent().setModel(Excelship, "expship");


                    var E_headerprice = 0
                    var E_headerTax = 0
                    var E_headerGrand = 0
                    for (var i = 0; i < Exp_produt.value.length; i++) {
                        debugger
                        E_headerprice += parseInt(Exp_produt.value[i].NetPrice) * Exp_produt.value[i].Quantity;


                        var E_iTax = Exp_produt.value[i].Quantity * parseInt(Exp_produt.value[i].NetPrice) * ((Exp_produt.value[i].tax) / 100)
                        var E_tableProTotal = (Exp_produt.value[i].Quantity * parseInt(Exp_produt.value[i].NetPrice)) + E_iTax

                        E_headerTax += Exp_produt.value[i].Quantity * parseInt(Exp_produt.value[i].NetPrice) * ((Exp_produt.value[i].tax) / 100)

                        E_headerGrand += E_tableProTotal

                        //    var nextamount= that.getView().getModel("iModel").setProperty("/value/" + i + "/NetPrice", E_tableProTotal.toString());


                    }

                    that.getView().getModel("iModel").setProperty("/Totamt", E_headerprice)
                    that.getView().getModel("iModel").setProperty("/Totax", E_headerTax)
                    that.getView().getModel("iModel").setProperty("/TotalIcTax", E_headerGrand)
                    E_gprocts = that.getOwnerComponent().getModel("iModel").getData().TotalIcTax
                }
                else {

                    this.getView().byId("expship").setVisible(false)
                    this.getView().byId("table").setVisible(true)
                    this.getView().byId("Exp_table").setVisible(false)
                    this.getView().byId("tableship").setVisible(true)

                    this.getView().byId("lableship").setVisible(true)
                    this.getView().byId("textShip").setVisible(true)
                    this.getView().byId("expLship").setVisible(false)
                    this.getView().byId("expTextship").setVisible(false)

                    previoius = that.getOwnerComponent().getModel("addCardData").getData();
                    var tableview = new JSONModel(previoius)
                    that.getOwnerComponent().setModel(tableview, "iModel");

                    gprocts = that.getOwnerComponent().getModel("iModel").getData().TotalIcTax


                    shipname = that.getView().getModel("iModel").getData().ShipName;
                    shiptype = that.getView().getModel("iModel").getData().shipType
                    var imodelLen = previoius.value.length;
                    that.getView().byId("table").setVisibleRowCount(imodelLen);


                    var headerprice = 0
                    var headerTax = 0
                    var headerGrand = 0
                    for (var i = 0; i < previoius.value.length; i++) {
                        debugger
                        headerprice += parseInt(previoius.value[i].NET_AMOUNT) * previoius.value[i].QUANTITY;


                        var iTax = previoius.value[i].QUANTITY * parseInt(previoius.value[i].NET_AMOUNT) * ((previoius.value[i].TAXES_AMOUNT) / 100)
                        var tableProTotal = (previoius.value[i].QUANTITY * parseInt(previoius.value[i].NET_AMOUNT)) + iTax

                        headerTax += previoius.value[i].QUANTITY * parseInt(previoius.value[i].NET_AMOUNT) * ((previoius.value[i].TAXES_AMOUNT) / 100)

                        headerGrand += tableProTotal

                        that.getView().getModel("iModel").setProperty("/value/" + i + "/TOTAL_AMOUNT", tableProTotal.toString());


                    }

                    that.getView().getModel("iModel").setProperty("/Totamt", headerprice)
                    that.getView().getModel("iModel").setProperty("/Totax", headerTax)
                    that.getView().getModel("iModel").setProperty("/TotalIcTax", headerGrand)
                    gprocts = that.getOwnerComponent().getModel("iModel").getData().TotalIcTax


                    distributorid = previoius.value[0].DISTRIBUTOR_ID

                    var fullData = {
                        value: previoius.value
                    }

                    var newtabledata = new JSONModel(fullData)
                    that.getView().setModel(newtabledata, "table");
                }




                that.oDataModel = this.getOwnerComponent().getModel();
                that.headerData()
                that.shipdetail();
                eventData = that.getOwnerComponent().getModel("userModel").getData();

            },
            backToCartPage: function () {
                debugger
                window.history.go(-1);
            },


            userrole: function () {
                debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var userdetails = this.getOwnerComponent().getModel("userModel").getData()
                var url = appModulePath + "/odata/v4/ideal-purchase-creation-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userdetails.userId + "') and (ACTIVE eq 'X')";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        debugger



                        var headeritem = new JSONModel(data.value[0]);
                        that.getOwnerComponent().setModel(headeritem, "userrole");



                    },
                    error: function (e) {
                        debugger
                        BusyIndicator.hide();
                        MessageBox.error(e.responseText);
                    }
                });

            },

            ApporveOrder: function (sAction) {
                debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var userdetails = that.getView().getModel("userModel").getData()
                var userrole = that.getOwnerComponent().getModel("userrole").getData()

                var addItemsDetails = that.getView().getModel("table");
                var Exp_produt = this.getOwnerComponent().getModel("iModel");
                surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"

                if (EXPflag === "true") {
                    

                    MessageBox.confirm("Do you want to confirm your order?", {
                        actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if (oAction === 'YES') {
                                BusyIndicator.show()
                    Exp_produt = that.getOwnerComponent().getModel("iModel").getData().value

                    for (let i = 0; i < Exp_produt.length; i++) {
                        Exp_produt[i].MaterialCode = "00000000" + Exp_produt[i].MaterialCode;

                    }

                    expData = []
                    for (var i = 0; i < Exp_produt.length; i++) {
                        var exp_object = {
                            "MATERIAL_CODE": Exp_produt[i].MaterialCode,
                            "MATERIAL_DESC": Exp_produt[i].MaterialDes,
                            "IMAGE_URL": Exp_produt[i].ImageUrl,
                            "HSN_CODE": "999999",
                            "UNIT_OF_MEASURE": Exp_produt[i].Uom,
                            "QUANTITY": parseInt(Exp_produt[i].Quantity),
                            "FREE_QUANTITY": null,
                            "STD_PRICE": null,
                            "BASE_PRICE": null,
                            "DISC_AMOUNT": null,
                            "DISC_PERC": null,
                            "NET_AMOUNT": Exp_produt[i].NetPrice,
                            "TOTAL_AMOUNT": (Exp_produt[i].total).toString(),
                            "CGST_PERC": Exp_produt[i].Cgst_per,
                            "CGST_AMOUNT": null,
                            "SGST_PERC": Exp_produt[i].Sgst_per,
                            "SGST_AMOUNT": null,
                            "IGST_PERC": Exp_produt[i].Igst_per,
                            "IGST_AMOUNT": null,
                            "TAXES_AMOUNT": (Exp_produt[i].tax).toString(),
                            "PR_NO": 1,
                            "PR_ITEM_NO": 1
                        }
                        expData.push(exp_object)
                    }


                    var oPayload1 = {
                        "action": "CREATE",
                        "appType": "PR",
                        "prHeader": [{
                            "PR_NO": 1,
                            "SAP_SO_NO": null,
                            "PR_CREATION_DATE": null,
                            "DISTRIBUTOR_ID": id,
                            "DISTRIBUTOR_NAME": "Star Enterprize",
                            "SHIP_TO": "1100013",
                            "SHIP_NAME": "Star Enterprize",
                            "BILL_TO": null,
                            "ORDER_TYPE": null,
                            "PAYMENT_METHOD": "0002",
                            "REGION_CODE": region_code,
                            "PR_STATUS": "1",
                            "LAST_UPDATED_DATE": null,
                            "APPROVER_LEVEL": null,
                            "APPROVER_ROLE": null,
                            "GRAND_TOTAL": E_gprocts.toString()

                        }],
                        "prCart": [],
                        "prItems": expData,
                        "prEvent": [{
                            "PR_NO": 1,
                            "EVENT_NO": 1,
                            "EVENT_CODE": "1",
                            "USER_ID": userdetails.userId,
                            "USER_ROLE": "DIST",
                            "USER_NAME": "Star Enterprize",
                            "COMMENTS": "Purchase Request Created",
                            "CREATION_DATE": null
                        }],
                        "userDetails": {
                            "USER_ROLE": "DIST",
                            "USER_ID": "starenterprize@gmail.com"
                        }
                    }
                    EXPoPayload = JSON.stringify(oPayload1)
                    $.ajax({
                        type: "POST",
                        url: surl,
                        data: EXPoPayload,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            debugger;
                            BusyIndicator.hide();
                            MessageBox.success(result.value.OUT_SUCCESS, {
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                                onClose: function (oAction) {
                                    if (oAction === 'OK') {
                                        debugger
                                        expData = []
                                        // this.getView().byId("shiftdetail").setValue("");
                                        that.getOwnerComponent().getModel("tModel").setData(null)
                                        var router = sap.ui.core.UIComponent.getRouterFor(that);
                                        router.navTo("RouteView1", {
                                            "loginId": id
                                        });

                                    }
                                }
                            }
                            );
                        },

                        error: function (oError) {
                            debugger;
                            BusyIndicator.hide();
                            MessageBox.error(oError.responseText);

                        }

                    });

                }
            }
        })

                } else {

                    var aItemsDetails = that.getView().getModel("table").getData().value;

                    MessageBox.confirm("Do you want to confirm your order?", {
                        actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if (oAction === 'YES') {
                                BusyIndicator.show()


                                for (var i = 0; i < aItemsDetails.length; i++) {
                                    debugger;
                                    delete aItemsDetails[i].DISTRIBUTOR_ID
                                    delete aItemsDetails[i].CART_ID
                                    delete aItemsDetails[i].iTotalTax
                                    delete aItemsDetails[i].totalIncludingTax
                                    delete aItemsDetails[i].TABLE_TOTAL
                                    aItemsDetails[i].PR_NO = 1
                                    aItemsDetails[i].PR_ITEM_NO = 1


                                }
                                var removeitems = [];


                                for (var i = 0; i < aItemsDetails.length; i++) {
                                    // removeitems.push(obj);
                                    removeitems.push(aItemsDetails[i]);
                                }


                                // if (sAction === "YES") {
                                debugger

                                surl = appModulePath + "/odata/v4/ideal-purchase-creation-srv/CreatePurchase"


                                if (shiptype === undefined || shipname === undefined) {
                                    MessageBox.error("Please fill Ship To Detials");
                                }
                                else {

                                    var oPayload = {
                                        "action": "CREATE",
                                        "appType": "PR",
                                        "prHeader": [{
                                            "PR_NO": 1,
                                            "SAP_SO_NO": null,
                                            "PR_CREATION_DATE": null,
                                            "DISTRIBUTOR_ID": distributorid,
                                            "DISTRIBUTOR_NAME": "Star Enterprize",
                                            "SHIP_TO": shiptype,
                                            "SHIP_NAME": shipname,
                                            "BILL_TO": null,
                                            "ORDER_TYPE": null,
                                            "PAYMENT_METHOD": paymen_method,
                                            "REGION_CODE": region_code,
                                            "PR_STATUS": "1",
                                            "LAST_UPDATED_DATE": null,
                                            "APPROVER_LEVEL": null,
                                            "APPROVER_ROLE": null,

                                            "GRAND_TOTAL": gprocts.toString()

                                        }],
                                        "prCart": [],
                                        "prItems": aItemsDetails,
                                        "prEvent": [{
                                            "PR_NO": 1,
                                            "EVENT_NO": 1,
                                            "EVENT_CODE": "1",
                                            "USER_ID": userdetails.userId,
                                            "USER_ROLE": "DIST",
                                            "USER_NAME": "Star Enterprize",
                                            "COMMENTS": "Purchase Request Created",
                                            "CREATION_DATE": null
                                        }],
                                        "userDetails": {
                                            "USER_ROLE": "DIST",
                                            "USER_ID": "starenterprize@gmail.com"
                                        }
                                    }


                                    oPayload = JSON.stringify(oPayload)
                                    $.ajax({
                                        type: "POST",
                                        url: surl,
                                        data: oPayload,
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        success: function (result) {
                                            debugger;
                                            BusyIndicator.hide();
                                            MessageBox.success(result.value.OUT_SUCCESS, {
                                                actions: [MessageBox.Action.OK],
                                                emphasizedAction: MessageBox.Action.OK,
                                                onClose: function (oAction) {
                                                    if (oAction === 'OK') {
                                                        debugger
                                                        aItemsDetails = null;
                                                        previoius = null

                                                        that.getOwnerComponent().getModel("addCardData").setData(null);
                                                        var router = sap.ui.core.UIComponent.getRouterFor(that);
                                                        router.navTo("RouteView1", {
                                                            "loginId": id
                                                        });

                                                    }
                                                }
                                            }
                                            );
                                        },

                                        error: function (oError) {
                                            debugger;
                                            BusyIndicator.hide();
                                            MessageBox.error(oError.responseText);

                                        }

                                    });
                                }

                            }
                        }
                    });
                }

            },


            shipdetail: function () {
                debugger
                BusyIndicator.show(0);
                var suppQuo = "1100013"
                var oFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, suppQuo);
                that.oDataModel.read("/SHIPTOSet", {
                    filters: [oFilter],
                    success: function (oData, resp) {
                        debugger
                        BusyIndicator.hide(0);
                        var ship = new JSONModel(oData);
                        that.getView().setModel(ship, "shipDetail");

                    },
                    error: function (error) {
                        debugger
                        BusyIndicator.hide();
                        sap.m.MessageToast.show("Cannot load ship detail");
                    }

                });
            },

            headerData: function () {
                debugger

                var suppQuo = "1100013"
                var oFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, suppQuo);
                that.oDataModel.read("/PTERMSet", {
                    filters: [oFilter],
                    success: function (oData, resp) {
                        debugger
                        var ship1 = new JSONModel(oData);
                        that.getView().setModel(ship1, "headerData");
                        paymen_method = that.getView().getModel("headerData").getData().results[0].Zterm

                    },
                    error: function (error) {
                        debugger
                        BusyIndicator.hide();
                        sap.m.MessageToast.show("Cannot load ship detail");
                    }

                });

            },




            backNav: function () {
                debugger


                // retailerData = that.getOwnerComponent().getModel("tModel")
                // previoius = that.getOwnerComponent().getModel("addCardData")

                // if (previoius === undefined || previoius === null) {

                // }
                // else {
                //     if (previoius.getData() === null) {
                //         previoius = null;
                //     }
                // }

                if (EXPflag === "true") {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("View4",
                        {
                            D_loginId: id,
                            FLAG: true
                        });
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                    oRouter.navTo("Cart",
                        { loginId: id });
                }
            }
        });
    });