sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
    "com/ibs/ibsappidealgrn/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"com/ibs/ibsappidealgrn/model/validation"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox,BusyIndicator,formatter,Filter,FilterOperator,validation) {
        "use strict";
        var that,context,appModulePath,invoiceNo;

        return Controller.extend("com.ibs.ibsappidealgrn.controller.Detailpage", {
            formatter:formatter,
            onInit: function () {
                that = this;
                context = this;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteDetailpage").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched:function(oEvent){
                
                invoiceNo = oEvent.getParameter("arguments").InvoiceNo;
                var sFilter = new Filter("CustomerCode",FilterOperator.Contains,"0001100013",false);
                var sFilter2 = new Filter("InvoiceNumber",FilterOperator.Contains,invoiceNo,false);
                this.getOwnerComponent().getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");
                var getMasterData = that.getOwnerComponent().getModel("grnHeaderSet");
                
                this.getView().byId("idFullScreen").setVisible(true);
                this.getView().byId("idExitScreen").setVisible(false);

                // var oModel = new JSONModel();
                // this.getView().setModel(oModel,"inVoiceMaterialDetails");

                if(getMasterData === undefined){
                    // var sFilter = new Filter("CustomerCode",FilterOperator.Contains,"0001100013",false);
                    BusyIndicator.show(0);
                    context.oDataModel = context.getOwnerComponent().getModel("onPremiseSrv");
                    this.readEntitySets(sFilter,"GRNHeaderSet", "grnHeaderSet",{"$expand" : "HEADTOITEM"});
                    this.readEntitySets([],"GRNHeaderSet('"+invoiceNo+"')/HEADTOITEM", "grnDetailModel",{});
                    // var url = appModulePath + "/sap/opu/odata/SAP/ZIBS_DMS_GRN_SRV/GRNHeaderSet('"+invoiceNo+"')/HEADTOITEM";
                    // this.postAjaxs(url,"GET","null","grnDetailModel");
                }
                else{
                    // var sFilter = new Filter("InvoiceNumber",FilterOperator.Contains,invoiceNo,false);
                    var sFilter = new Filter("CustomerCode",FilterOperator.Contains,"0001100013",false);
                    BusyIndicator.show(0);
                    context.oDataModel = context.getOwnerComponent().getModel("onPremiseSrv");
                    // this.getOwnerComponent().getModel("appView").setProperty("/layout","TwoColumnsMidExpanded");
                    // that.getOwnerComponent().getModel("appView").setProperty("/layout","EndColumnFullScreen");
                    // 	this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen",true);
                    this.readEntitySets([],"GRNHeaderSet('"+invoiceNo+"')/HEADTOITEM", "grnDetailModel",{});
                }
            },
            fullscreen:function(){
                var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
                this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
                if (!bFullScreen) {
                this.getView().byId("idFullScreen").setVisible(false);
                this.getView().byId("idExitScreen").setVisible(true);
                // store current layout and go full screen
                this.getView().getModel("appView").setProperty("/previousLayout", this.getView().getModel("appView").getProperty("/layout"));
                this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                } else {
                // reset to previous layout
                this.getView().byId("idFullScreen").setVisible(true);
                this.getView().byId("idExitScreen").setVisible(false);
                var getLayout = this.getView().getModel("appView").getProperty("/layout");

                if(getLayout === "TwoColumnsMidExpanded"){
                    this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
                }
                else{
                    this.getView().getModel("appView").setProperty("/layout", this.getView().getModel("appView").getProperty("/previousLayout"));
                }
                }
            },
            readEntitySets: function (sFilter,sEntityName, sAlisName,sUrl) {
                var customerHeaderData = [];
                context.oDataModel.read("/" + sEntityName, {
                    filters: [sFilter],
                    success: function (oData, responce) {
                        
                        BusyIndicator.hide();

                        var s4HanaJson = new JSONModel();
                        s4HanaJson.setSizeLimit(oData.results.length);

                        
                        if(sAlisName === "grnDetailModel"){
                            for(var i=0;i<oData.results.length;i++){
                                
                                oData.results[i].Quantity = Number(oData.results[i].Quantity).toFixed(2);
                                oData.results[i].AcceptQty = Number(oData.results[i].Quantity).toFixed();
                                oData.results[i].RejectQty = Number(Number(oData.results[i].Quantity) - Number(oData.results[i].AcceptQty)).toFixed(2);
                                oData.results[i].NetAmount = Number(Number(oData.results[i].Quantity) * Number(oData.results[i].UnitPrice)).toFixed();
                                
                                var Amount = Number(oData.results[i].NetAmount);
                                var cgstAmount = Number(Number(oData.results[i].CgstAmount).toFixed(2));
                                // Amount*(Number(oData.results[i].CgstPer)/100);
                                var sgstAmount = Number(Number(oData.results[i].SgstAmount).toFixed(2));
                                // Amount*(Number(oData.results[i].SgstPer)/100);

                                oData.results[i].CgstAmount = cgstAmount;
                                oData.results[i].SgstAmount = sgstAmount;
                                oData.results[i].TaxesAmount = Number(cgstAmount) + (sgstAmount);
    
                                var totalAmount = Number(cgstAmount) + Number(sgstAmount) + Number(Amount);
                                oData.results[i].TotalAmount = Number(totalAmount).toFixed(2);
                            }
                            // oData.results[i].DeliveryValue = Number(oData.results[i].DeliveryValue).toFixed(2);
                        }
                        else if(sAlisName === "grnHeaderSet"){
                            customerHeaderData = oData.results.filter(function (a,index) {
                                if(invoiceNo ==  a["InvoiceNumber"]){
                                    return a;
                                }        
                            }, Object.create(null));
                            var oModel = new JSONModel(customerHeaderData[0]);
                            that.getOwnerComponent().setModel(oModel, "cusomerHeaderModel");
                        }
                        s4HanaJson.setData(oData.results);
                        that.getOwnerComponent().setModel(s4HanaJson, sAlisName);
                    },
                    error: function (error) {
                        
                        BusyIndicator.hide();
                        var oXML,oXMLMsg;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"].value;
                        } else {
                            oXMLMsg = error.responseText
                        }
                        MessageBox.error(oXMLMsg);
                    }
                });
            },
            handleAcceptedQty:function(oEvent){
                
                var getSelectedItemObj = oEvent.getSource().getBindingContext("grnDetailModel").getObject();
                var changedAccQty = Number(oEvent.getSource().getValue());

                if(changedAccQty > Number(getSelectedItemObj.Quantity)){
                    getSelectedItemObj.AcceptQty = getSelectedItemObj.AcceptQty;
                    MessageBox.error("Please enter quantity less than or equal to "+ (Number(getSelectedItemObj.Quantity)));
                }
                else if(String(changedAccQty).includes(".")){
                    getSelectedItemObj.AcceptQty = getSelectedItemObj.AcceptQty;
                    MessageBox.error("Please enter a number without dot(.)");
                }
                else if(String(changedAccQty).includes("-")){
                    getSelectedItemObj.AcceptQty = getSelectedItemObj.AcceptQty;
                }
                else{
                    getSelectedItemObj.AcceptQty = Number(oEvent.getSource().getValue());
                    getSelectedItemObj.RejectQty = Number(Number(getSelectedItemObj.Quantity) - Number(getSelectedItemObj.AcceptQty)).toFixed(2);
                    getSelectedItemObj.NetAmount = Number(getSelectedItemObj.AcceptQty) * Number(getSelectedItemObj.UnitPrice);
                    var cgstAmount = getSelectedItemObj.NetAmount*(Number(getSelectedItemObj.CgstPer)/100);
                    var sgstAmount = getSelectedItemObj.NetAmount*(Number(getSelectedItemObj.SgstPer)/100);

                    getSelectedItemObj.CgstAmount = cgstAmount;
                    getSelectedItemObj.SgstAmount = sgstAmount;
                    getSelectedItemObj.TaxesAmount = Number(cgstAmount) + (sgstAmount);

                    var totalAmount = Number(cgstAmount) + Number(sgstAmount) + Number(getSelectedItemObj.NetAmount);
                    getSelectedItemObj.TotalAmount = Number(totalAmount).toFixed(2);
                    // Number(getSelectedItemObj.NetAmount);
                }
                this.getOwnerComponent().getModel("grnDetailModel").refresh(true);
            },
            onBack:function(){
                BusyIndicator.show(0);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMasterpage");
                this.getOwnerComponent().getModel("appView").setProperty("/layout","OneColumn");
            },
            
            postAjaxs: function (url, type, data, model) {
            
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    data: data,
                    success: function (data, response) {
                        
                        BusyIndicator.hide();
                        MessageBox.success(data.value["OUT_SUCCESS"], {
                            actions: [MessageBox.Action.OK],
                            onClose: function (oAction) {
                                if (oAction === "OK") {
                                    that.onBack();
                                }
                            }
                        });
                    },
                    error:function(error){
                        BusyIndicator.hide();
                        var oXMLMsg, oXML;
                        if (that.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText
                        }

                        MessageBox.error(oXMLMsg);
                    }
                })
            },
            onOrderDataFetch:function(){
                
                var materialDataArr = [];
                var totalInvoiceAmount = 0;
                var getCustomerMaterialData = this.getOwnerComponent().getModel("grnDetailModel").getData();
                var getCustomerHeaderData = this.getOwnerComponent().getModel("cusomerHeaderModel").getData();
                var checkValidFields = validation.orderCreationTblVal(getCustomerMaterialData,[]);
                
                getCustomerMaterialData.filter(function (a,index) {
                    totalInvoiceAmount = totalInvoiceAmount + a["TotalAmount"];        
                }, Object.create(null));

                for(var i=0;i<getCustomerMaterialData.length;i++){
                    var materialDataObj = {
                        "INVOICE_NO": getCustomerMaterialData[i].InvoiceNumber,
                        "ITEM_NO": Number(getCustomerMaterialData[i].ItemNo),
                        "MATERIAL_GROUP": getCustomerMaterialData[i].MaterialGroup,
                        "MATERIAL_GROUP_DESC": getCustomerMaterialData[i].MaterialGrpdes,
                        "MATERIAL_CODE": getCustomerMaterialData[i].MaterialCode,
                        "MATERIAL_DESC": getCustomerMaterialData[i].MaterialDesc,
                        "HSN_CODE": getCustomerMaterialData[i].HsnCode,
                        "UNIT_OF_MEASURE": getCustomerMaterialData[i].Uom,
                        "UNIT_PRICE": getCustomerMaterialData[i].UnitPrice,
                        "OPENING_STOCK": getCustomerMaterialData[i].Quantity,
                        "QUANTITY": Number(getCustomerMaterialData[i].Quantity),
                        "ACCEPTED_QUANTITY" : Number(getCustomerMaterialData[i].AcceptQty),
                        "REJECTED_QUANTITY" : Number(getCustomerMaterialData[i].RejectQty) ,
                        "CGST_PERC": getCustomerMaterialData[i].CgstPer,
                        "CGST_AMOUNT": String(getCustomerMaterialData[i].CgstAmount),
                        "SGST_PERC": getCustomerMaterialData[i].SgstPer,
                        "SGST_AMOUNT": String(getCustomerMaterialData[i].SgstAmount),
                        "IGST_PERC": getCustomerMaterialData[i].IgstPer,
                        "IGST_AMOUNT": getCustomerMaterialData[i].IgstAmount,
                        "TAX_AMOUNT": String(getCustomerMaterialData[i].TaxesAmount),
                        "TOTAL_AMOUNT": String(getCustomerMaterialData[i].TotalAmount)
                    }
                    materialDataArr.push(materialDataObj);
                }

                var oPayload = {
                    "action": "ACCEPT",
                    "appType": "RG",
                    "grnHeader": [
                        {
                            "DISTRIBUTOR_ID": "1100013",
                            "DISTRIBUTOR_NAME": "Enterprise",
                            "DELIVERY_NO" : getCustomerHeaderData.DeliveryNumber,
                            "INVOICE_NO": getCustomerHeaderData.InvoiceNumber,
                            "INVOICE_DATE": new Date(getCustomerHeaderData.InvoiceDate).toISOString().split("T")[0],
                            "DELIVERY_DATE":new Date(getCustomerHeaderData.DeliveryDate).toISOString().split("T")[0],
                            "ACCEPTED_DATE": new Date().toISOString().split("T")[0],
                            "INVOICE_AMOUNT": Number(totalInvoiceAmount),
                            "STATUS": 1,
                            "SAP_ORDER_NO": null
                        }
                    ],
                    "grnItems": materialDataArr,
                    "grnEvent": [
                        {
                            "INVOICE_NO": getCustomerHeaderData.InvoiceNumber,
                            "EVENT_NO": 1,
                            "USER_ID": "abc.s@intellectbizware.com",
                            "USER_NAME": "Test User",
                            "USER_ROLE": "Distrubutor",
                            "COMMENT": "ABC",
                            "CREATED_ON": new Date().toISOString()
                        }
                    ]
                }

                var url = appModulePath + "/odata/v4/ideal-grn-acceptance/grnAccept";
                var data = JSON.stringify(oPayload);
                MessageBox.confirm("Do you want to accept the GRN ?",{
                // the Invoice "+getCustomerHeaderData.InvoiceNumber+"?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					// initialFocus: sap.m.MessageBox.Action.CANCEL,
					onClose: function (oAction) {
                        if (oAction === 'YES') {
                            BusyIndicator.show(0);
                            that.postAjaxs(url,"POST",data,"null");
						} else {
							// Do something
						}

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
            }
        });
    });
