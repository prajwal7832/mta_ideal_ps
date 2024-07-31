sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "com/ibs/ibsappidealorderdispatch/model/formatter",
    "com/ibs/ibsappidealorderdispatch/model/validation"
],
    function (Controller, JSONModel, MessageBox, BusyIndicator, formatter,validation) {
        "use strict";
        var that,soNo, appModulePath,grossTotal;

        return Controller.extend("com.ibs.ibsappidealorderdispatch.controller.Displaypage", {
            formatter: formatter,
            onInit: function () {
                that = this;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteDispatchpage").attachMatched(this._onRouteMatched, this);

            },
            _onRouteMatched: function (oEvent) {
                
                soNo = oEvent.getParameter("arguments").SO_NO;
                this.getView().byId("idDateRangeSelection").setDateValue(new Date());
                var getDetailPageData = this.getOwnerComponent().getModel("retailerDetailModel");
                if (getDetailPageData === undefined) {
                    this.onBack();
                }
                else {
                    grossTotal = 0;
                        for(var i=0;i<getDetailPageData.getData().length;i++){
                            var modelidxValue = getDetailPageData.getData()[i];
                            modelidxValue.QUANTITY = Number(modelidxValue.QUANTITY).toFixed(2);
                            modelidxValue.DISPATCH_QTY = Number(modelidxValue.DISPATCH_QTY).toFixed(2);

                            var Amount = Number(modelidxValue.STD_PRICE) * Number(modelidxValue.DISPATCH_QTY); 
                            var cgstAmount = Amount*(Number(modelidxValue.CGST_PERC)/100);
                            var sgstAmount = Amount*(Number(modelidxValue.SGST_PERC)/100);
                            var totalAmount = Number(cgstAmount) + Number(sgstAmount) + Number(Amount);
                            totalAmount = totalAmount.toFixed(2);
                            grossTotal = Number(grossTotal) + Number(totalAmount);
                            
                            modelidxValue.STD_PRICE = Amount.toFixed(2);
                            modelidxValue.TOTAL_AMOUNT = totalAmount;
                            // modelidxValue.GROSS_TOTAL = grossTotal;
                            modelidxValue.TAXES_AMOUNT = Number(cgstAmount) + Number(sgstAmount);
                        }

                    BusyIndicator.hide();
                    
                    var oModel = new JSONModel(getDetailPageData.getData());
                    this.getOwnerComponent().setModel(oModel,"retailerDetailModel");

                    this.getView().byId("idTransporter").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idWayBill").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idDestination").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idVehicleNo").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idGrossWgt").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idReference").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idTotalPkg").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idLrNo").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idDateRangeSelection").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idShippingChrg").setValueState(sap.ui.core.ValueState.None);

                    this.getView().byId("idTransporter").setValue("");
                    this.getView().byId("idWayBill").setValue("");
                    this.getView().byId("idDestination").setValue("");
                    this.getView().byId("idVehicleNo").setValue("");
                    this.getView().byId("idGrossWgt").setValue("");
                    this.getView().byId("idReference").setValue("");
                    this.getView().byId("idTotalPkg").setValue("");
                    this.getView().byId("idLrNo").setValue("");
                    this.getView().byId("idShippingChrg").setValue("");
                }
            },
            onDataFetch: function () {
                var getTransporter = this.getView().byId("idTransporter").getValue();
                var getWayBill = this.getView().byId("idWayBill").getValue();
                var getShippingChrg = this.getView().byId("idShippingChrg").getValue();
                var getDestination = this.getView().byId("idDestination").getValue();
                var getVehicleNo = this.getView().byId("idVehicleNo").getValue();
                var getGrossWgt = this.getView().byId("idGrossWgt").getValue();
                var getReference = this.getView().byId("idReference").getValue();
                var getTotalPkg = this.getView().byId("idTotalPkg").getValue();
                var getLrNo = this.getView().byId("idLrNo").getValue();
                var getDate = this.getView().byId("idDateRangeSelection").getValue();

                // if (getTransporter === "" || getWayBill === "" || getShippingChrg === "" ||
                //     getDestination === "" || getVehicleNo === "" || getGrossWgt === "" || getReference === "" ||
                //     getTotalPkg === "" || getLrNo === "" || getDate === "") {
                //     if (getTransporter === "") {
                //         this.getView().byId("idTransporter").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter transporter");
                //     }
                //     else {
                //         this.getView().byId("idTransporter").setValueState(sap.ui.core.ValueState.None);
                //     }
                //     if (getWayBill === "") {
                //         this.getView().byId("idWayBill").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter Way Bill No");
                //     }
                //     else {
                //         this.getView().byId("idWayBill").setValueState(sap.ui.core.ValueState.None);
                //     }
                //     if (getShippingChrg === "") {
                //         this.getView().byId("idShippingChrg").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter shipping charges");
                //     }
                //     else {
                //         this.getView().byId("idShippingChrg").setValueState(sap.ui.core.ValueState.None);
                //     }
                //     if (getDestination === "") {
                //         this.getView().byId("idDestination").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter destination");
                //     }
                //     else {
                //         this.getView().byId("idDestination").setValueState(sap.ui.core.ValueState.None);
                //     }
                //     if (getVehicleNo === "") {
                //         this.getView().byId("idVehicleNo").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter vehicle no");
                //     }
                //     else {
                //         this.getView().byId("idVehicleNo").setValueState(sap.ui.core.ValueState.None);
                //     }
                //     if (getGrossWgt === "") {
                //         this.getView().byId("idGrossWgt").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter gross weight");
                //     }
                //     else {
                //         this.getView().byId("idGrossWgt").setValueState(sap.ui.core.ValueState.None);
                //     }
                //     if (getReference === "") {
                //         this.getView().byId("idReference").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter reference");
                //     }
                //     else {
                //         this.getView().byId("idReference").setValueState(sap.ui.core.ValueState.None);
                //     }
                //     if (getTotalPkg === "") {
                //         this.getView().byId("idTotalPkg").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter total no of pakages");
                //     }
                //     else {
                //         this.getView().byId("idTotalPkg").setValueState(sap.ui.core.ValueState.None);
                //     }
                //     if (getLrNo === "") {
                //         this.getView().byId("idLrNo").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please enter LR No");
                //     }
                //     else {
                //         this.getView().byId("idLrNo").setValueState(sap.ui.core.ValueState.None);
                //     }
                //     if (getLrNo === "") {
                //         this.getView().byId("idDateRangeSelection").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please select LR date");
                //     }
                //     else {
                //         this.getView().byId("idDateRangeSelection").setValueState(sap.ui.core.ValueState.None);
                //     }
                // }
                // else {
                    this.onSubmitDispatch();
                // }
            },
            onSubmitDispatch: function () {
                var getDeliveryItemArr = [];
                var getInvoiceItemArr = [];
                var getRetailerMaterialData = this.getView().getModel("retailerDetailModel").getData();

                for (var i = 0; i < getRetailerMaterialData.length; i++) {
                    var getDeliveryItemObj = {
                        "DELIVERY_NO": "1100013",
                        "DELIVERY_ITEM_NO": 2,
                        "BATCH": "765432",
                        "MATERIAL_GROUP": getRetailerMaterialData[i].MATERIAL_GROUP,
                        "MATERIAL_GROUP_DESC": getRetailerMaterialData[i].MATERIAL_GROUP_DESC,
                        "MATERIAL_CODE": getRetailerMaterialData[i].MATERIAL_CODE,
                        "MATERIAL_DESC": getRetailerMaterialData[i].MATERIAL_DESC,
                        "ORDER_QUANTITY": Number(getRetailerMaterialData[i].QUANTITY),
                        "DELIVERY_QUANTITY": Number(getRetailerMaterialData[i].DISPATCH_QTY),
                        "UNIT_OF_MEASURE": getRetailerMaterialData[i].UNIT_OF_MEASURE,
                        "STD_PRICE": String(getRetailerMaterialData[i].STD_PRICE),
                        "BASE_PRICE": getRetailerMaterialData[i].BASE_PRICE,
                        "DISC_AMOUNT": getRetailerMaterialData[i].DISC_AMOUNT,
                        "DISC_PERC": getRetailerMaterialData[i].DISC_PERC,
                        "AMOUNT": String(getRetailerMaterialData[i].STD_PRICE),
                        "TOTAL_AMOUNT": getRetailerMaterialData[i].TOTAL_AMOUNT,
                        "CGST_PERC": getRetailerMaterialData[i].CGST_PERC,
                        "CGST_AMOUNT": getRetailerMaterialData[i].CGST_AMOUNT,
                        "SGST_PERC": getRetailerMaterialData[i].SGST_PERC,
                        "SGST_AMOUNT": getRetailerMaterialData[i].SGST_AMOUNT,
                        "IGST_PERC": getRetailerMaterialData[i].IGST_AMOUNT,
                        "IGST_AMOUNT": getRetailerMaterialData[i].IGST_AMOUNT,
                        "TAXES_AMOUNT": String(getRetailerMaterialData[i].TAXES_AMOUNT),
                        "HSN_CODE": getRetailerMaterialData[i].HSN_CODE
                    }
                    getDeliveryItemArr.push(getDeliveryItemObj);

                    var getInvoiceItemObj = {
                        "INVOICE_NO": "1100013",
                        "INVOICE_ITEM_NO": 1,
                        "MATERIAL_GROUP": getRetailerMaterialData[i].MATERIAL_GROUP,
                        "MATERIAL_GROUP_DESC": getRetailerMaterialData[i].MATERIAL_GROUP_DESC,
                        "MATERIAL_CODE": getRetailerMaterialData[i].MATERIAL_CODE,
                        "MATERIAL_DESC": getRetailerMaterialData[i].MATERIAL_DESC,
                        "BATCH": "765432",
                        "INVOICE_QUANTITY": Number(getRetailerMaterialData[i].QUANTITY),
                        "UNIT_OF_MEASURE": getRetailerMaterialData[i].UNIT_OF_MEASURE,
                        "STD_PRICE": String(getRetailerMaterialData[i].STD_PRICE),
                        "BASE_PRICE": getRetailerMaterialData[i].BASE_PRICE,
                        "DISC_AMOUNT": getRetailerMaterialData[i].DISC_AMOUNT,
                        "DISC_PERC": getRetailerMaterialData[i].DISC_PERC,
                        "AMOUNT": String(getRetailerMaterialData[i].STD_PRICE),
                        "TOTAL_AMOUNT": parseFloat(getRetailerMaterialData[i].TOTAL_AMOUNT),
                        "CGST_PERC": getRetailerMaterialData[i].CGST_PERC,
                        "CGST_AMOUNT": getRetailerMaterialData[i].CGST_AMOUNT,
                        "CGST_PERC": getRetailerMaterialData[i].CGST_PERC,
                        "CGST_AMOUNT": getRetailerMaterialData[i].CGST_AMOUNT,
                        "IGST_PERC": getRetailerMaterialData[i].IGST_AMOUNT,
                        "IGST_AMOUNT": getRetailerMaterialData[i].IGST_AMOUNT,
                        "TAXES_AMOUNT": String(getRetailerMaterialData[i].TAXES_AMOUNT),
                        "HSN_CODE": getRetailerMaterialData[i].HSN_CODE

                    }
                    getInvoiceItemArr.push(getInvoiceItemObj);
                }
                var oPayload = {
                    "deliveryheader": [{
                        "DISTRIBUTOR_ID": "1100013",
                        "DELIVERY_NO": "1100013",
                        "SO_NO": soNo,
                        "RETAILER_ID": getRetailerMaterialData[0].RETAILER_ID,
                        "CREATION_DATE": new Date().toISOString().split("T")[0],
                        "DIVISION": "10",
                        "TRANSPORTER_NAME": this.getView().byId("idTransporter").getValue() || null,
                        "DESTINATION": this.getView().byId("idDestination").getValue() || null,
                        "VEHICLE_NO": this.getView().byId("idVehicleNo").getValue() || null,
                        "GROSS_WEIGHT": Number(this.getView().byId("idGrossWgt").getValue()) || null,
                        "GROSS_TOTAL": String(grossTotal),
                        "TOTAL_NO_PACKAGES": Number(this.getView().byId("idTotalPkg").getValue()) || null,
                        "E_WAY_BILL_NO": this.getView().byId("idWayBill").getValue() || null,
                        "E_WAY_BILL_DATE": new Date().toISOString().split("T")[0],
                        "LR_DATE": new Date(this.getView().byId("idDateRangeSelection").getValue()).toISOString().split("T")[0] || 
                                                new Date().toISOString().split("T")[0],
                        "LR_NO": this.getView().byId("idLrNo").getValue() || null,
                        "SHIPPING_CHARGES": Number(this.getView().byId("idShippingChrg").getValue()) || null,
                        "REFERENCE": this.getView().byId("idReference").getValue() || null

                    }],
                    "deliveryItem": getDeliveryItemArr,
                    "invoiceHeader": [{

                        "DISTRIBUTOR_ID": "1100013",
                        "SO_NO": soNo,
                        "RETAILER_ID": getRetailerMaterialData[0].RETAILER_ID,
                        "RETAILER_NAME":String(that.getView().getModel("retailerHeaderModel").getProperty("/0/RETAILER_NAME")),
                        "INVOICE_NO": "1100013",
                        "DELIVERY_NO": "1100013",
                        "CREATION_DATE": new Date().toISOString().split("T")[0],
                        "DIVISION": "10",
                        "REFERENCE": this.getView().byId("idTransporter").getValue(),
                        "GROSS_TOTAL": String(grossTotal),
                        "PAYMENT_STATUS":1
                    }],
                    "invoiceItem": getInvoiceItemArr
                }

                var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/dispatchCreation"
                var data = JSON.stringify(oPayload);
                MessageBox.confirm("Do you want to submit", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    initialFocus: sap.m.MessageBox.Action.NO,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.YES) {
                            BusyIndicator.show(0);
                            that.postAjaxs(url, "POST", data, "null");
                        } else if (sButton === MessageBox.Action.NO) {
                            // do nothing
                        }

                    }
                });

            },
            onBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.getOwnerComponent().getRouter().getHashChanger().key = "Dispatchpage";
                // BusyIndicator.show(0);
                oRouter.navTo("RouteDisplaypage", {
                    "SO_NO": soNo
                });
            },
            postAjaxs: function (url, type, data) {
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    data: data,
                    success: function (data, response) {
                        BusyIndicator.hide();
                        MessageBox.success(data.value, {
                            actions: [MessageBox.Action.OK],
                            onClose: function (oAction) {
                                if (oAction === "OK") {
                                    var onbackObj = {
                                        "BACK_INDICATOR": "X"
                                    };
                                    var onBackModel = new sap.ui.model.json.JSONModel(onbackObj);
                                    that.getOwnerComponent().setModel(onBackModel, "vendorReport");

                                    that.onBack();
                                }
                            }
                        });
                    },
                    error: function (error) {
                        BusyIndicator.hide();
                        var oXMLMsg, oXML;
                        if (that.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText;
                        }

                        MessageBox.error(oXMLMsg);
                    }
                });
            },
            isValidJsonString: function (sDataString) {
                var value = null;
                var oArrObj = null;
                var sErrorMessage = "";
                try {
                    if (sDataString === null || sDataString === "" || sDataString === undefined) {
                        throw "No data found.";
                    }

                    value = JSON.parse(sDataString);
                    if (toString.call(value) === '[object Object]' && Object.keys(value).length > 0) {
                        return true;
                    } else {
                        throw "Error";
                    }
                } catch (errorMsg) {
                    if (errorMsg === "No data found.") {
                        sErrorMessage = errorMsg;
                    } else {
                        sErrorMessage = "Invalid JSON data."
                    }
                    return false;
                }
                return true;
            },

            // on Change Events

            onChangeTransport:function(oEvent){
                var transportVal = validation.SpecialCharVal(oEvent);
            },
            onChangeWayBill:function(oEvent){
                var transportVal = validation.SpecialCharVal(oEvent,"EwayBill");
            },
            onChangeShippingChrg:function(oEvent){
                var transportVal = validation.SpecialCharVal(oEvent);
            },
            onChangeDestination:function(oEvent){
                var transportVal = validation.SpecialCharVal(oEvent);
            },
            onChangeVehicleNo:function(oEvent){
                var transportVal = validation.SpecialCharVal(oEvent,"vehicleNoVal");
            },
            onChangeGrossWgt:function(oEvent){
                var transportVal = validation._dispatchQtyVal(oEvent);
            },
            onChangeRef:function(oEvent){
                var transportVal = validation.SpecialCharVal(oEvent);
            },
            onChangeTotalPkg:function(oEvent){
                var transportVal = validation._numberValidation(oEvent);
            },
            onChangeLRNo:function(oEvent){
                var transportVal = validation._numberValidation(oEvent);
            },
            onChangeDate: function (oEvent) {
                
                var getDateValue = new Date(oEvent.getSource().getValue());

                var date = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "dd.MM.yyyy"
                });
                oEvent.getSource().setValue(date.format(getDateValue));
            },

        });
    });
