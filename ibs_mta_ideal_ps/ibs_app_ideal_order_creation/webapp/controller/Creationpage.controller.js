sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter",
	"com/ibs/ibsappidealordercreation/model/validation",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
    "com/ibs/ibsappidealordercreation/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox,BusyIndicator,Filter,
        validation,MessagePopover,MessageItem,formatter) {
        "use strict";
        var that,object,appModulePath;

        return Controller.extend("com.ibs.ibsappidealordercreation.controller.Creationpage", {
            formatter:formatter,
            onInit: function () {
                that = this;

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteCreationpage").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched:function(oEvent){
                that.sIndex = 0;
                that.retailerName = null;
                object={
                    visibleRowCountArr:[]
                }
                this.getOwnerComponent().getModel("appView").setProperty("/layout","EndColumnFullScreen");
                this.getView().byId("idShipTo").setValue(null);
                this.getView().byId("idRetailer").setValue(null);
                var dummyData = this.getOwnerComponent().getModel("retailerDatas").getData();
                var oModel = new JSONModel(dummyData);
                this.getView().setModel(oModel,"retailerInfoModel");
                this.getView().getModel("retailerInfoModel").setProperty("/retailerTblData",[]);

                this.onReset(oEvent,"onLoad");                
            },
            onQuantityChange:function(oEvent){
                var getQty = oEvent.getSource().getValue();

                if(String(getQty).includes(".")){
                    MessageBox.error("Please enter a number without dot(.)");
                    this.getView().byId("materialQty").setValue(0);
                    this.getView().byId("materialQty").refresh(true);
                }
                else{
                    this.getView().byId("materialQty").setValue(Number(oEvent.getSource().getValue()));
                    // this.getView().byId("materialQty").refresh(true);
                }
            },
            onReset:function(oEvent,sEvent){
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerDetails?$filter=BLOCKED eq 'N'";
                BusyIndicator.show(0);
                this.postAjaxs(url,"GET",null,"retailerIdData");
                // var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerDummy";
                // this.postAjaxs(url,"GET",null,"retailerDummyData");
                
                var url = appModulePath + "/OData/v4/ideal-grn-acceptance/Material_Group_Master";
                this.postAjaxs(url,"GET",null,"materialGrpMaster");

                this.getView().byId("idTotalAmt").setVisible(false);
                this.getView().byId("idTotalTaxes").setVisible(false);
                this.getView().byId("idRetailer").setEditable(true);
                this.getView().byId("idShipTo").setEditable(true);
                // this.getView().byId("idRetailer").setValue("");
                // this.getView().byId("idShipTo").setValue("");
                // this.getView().byId("idMaterialGrp").setValue("");
                // this.getView().byId("idMaterial").setValue("");
                // this.getView().byId("materialQty").setValue(0);
                
                this.getView().byId("saveBt").setEnabled(false);
                that.getView().byId("messagePopoverBtn").setVisible(false);

                if(sEvent === "onLoad"){
                    
                    this.getView().byId("idRetailer").setValue("");
                    this.getView().byId("idShipTo").setValue("");
                    this.getView().byId("idMaterialGrp").setValue("");
                    this.getView().byId("idMaterial").setValue("");
                    this.getView().byId("materialQty").setValue(0);

                    that.getView().byId("idAvlQtyFilter").setVisible(false);
                    that.getView().byId("idMaterialQty").setVisible(false);
                    
                    this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_TAXES",0);
                    this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_AMOUNT",0);
                    this.getView().getModel("retailerInfoModel").setProperty("/MaterialInp/0/materialCodeInp",null);
                    this.getView().getModel("retailerInfoModel").setProperty("/MaterialInp/0/materialDescInp",null);
                }
                object={
                    visibleRowCountArr:[]
                }
                    var model = new JSONModel(object);
                    that.getView().setModel(model,"retailerTblModel");
            },
            onCreate:function(oEvent){
                var getVisibleFilterItem = this.getView().byId("idFilterBar").getVisible();

                if(getVisibleFilterItem === false){
                    this.getView().byId("idFilterBar").setVisible(true);
                }
                else{
                    this.getView().byId("idFilterBar").setVisible(false);
                }
            },
            onRetailer:function(){
                if (!this.retailerFrag) {
                    this.retailerFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealordercreation.view.Fragment.retailerName", this);
                    this.getView().addDependent(this.retailerFrag);
                }
                    this.retailerFrag.open();
                    sap.ui.getCore().byId("retailerSrch").setValue("");
                    if(sap.ui.getCore().byId("retailer_listId").getBinding("items") !== undefined){
                        sap.ui.getCore().byId("retailer_listId").getBinding("items").filter();
                    }
            },
            handleRetailer:function(oEvent){
                
                that.onRetailerValue = oEvent.getSource().getSelectedItem().getBindingContext("retailerIdData").getProperty("retailerId");
                that.retailerName = oEvent.getSource().getSelectedItem().getBindingContext("retailerIdData").getProperty("retailerName");
                this.getView().byId("idRetailer").setValue(that.retailerName);
                this.getView().byId("idShipTo").setValue("");
                oEvent.getSource().removeSelections();
                this.closeRetailer();
                BusyIndicator.hide();
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/RetailerAddressDetail?$filter=ADDRESS_TYPE eq 'SHP_ADDR' and RETAILER_ID eq '"+that.onRetailerValue+"'";
                this.postAjaxs(url,"GET",null,"retailerAddr");
            },
            handleRetailerSrch:function(oEvent){
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                var oFilter = new Filter();
                if (sQuery) {
                        oFilter = new Filter([
                            new Filter("retailerId", sap.ui.model.FilterOperator.Contains, sQuery),
                            new Filter("retailerName", sap.ui.model.FilterOperator.Contains, sQuery)
                        ], false);
                }
                pFilter.push(oFilter);
                var listItem = sap.ui.getCore().byId("retailer_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            closeRetailer:function(){
                this.retailerFrag.close();
                // this.retailerName = undefined;
            },
            onShipToAddress:function(){
                var checkRetailerSelect = this.getView().byId("idRetailer").getValue();
                if(checkRetailerSelect === ""){
                    MessageBox.information("Please select retailer");
                }
                else{
                    if (!this.shipToAddress) {
                        this.shipToAddress = new sap.ui.xmlfragment("com.ibs.ibsappidealordercreation.view.Fragment.shipToAddress", this);
                        this.getView().addDependent(this.shipToAddress);
                    }
                    this.shipToAddress.open();
                    sap.ui.getCore().byId("shipToSrch").setValue("");
                    if(sap.ui.getCore().byId("shipTo_listId").getBinding("items") !== undefined){
                        sap.ui.getCore().byId("shipTo_listId").getBinding("items").filter();
                    }
                }
            },
            handleShipTo:function(oEvent){
                
                // var onRetailerVal = oEvent.getSource().getValue();
                var onRetailerVal = oEvent.getSource().getSelectedItem().getBindingContext("retailerAddr").getProperty("address");
                this.getView().byId("idShipTo").setValue(onRetailerVal);
                oEvent.getSource().removeSelections();
                this.closeShipTo();
            },
            handleShipToSrch:function(oEvent){
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                var oFilter = new Filter();
                if (sQuery) {
                        oFilter = new Filter([
                            new Filter("address", sap.ui.model.FilterOperator.Contains, sQuery)
                        ], false);
                }
                pFilter.push(oFilter);
                var listItem = sap.ui.getCore().byId("shipTo_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            closeShipTo:function(){
                this.shipToAddress.close();
                // this.shipToAddress = undefined;
            },
            onDivision:function(){
                if (!this.divisionFrag) {
                    this.divisionFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealordercreation.view.Fragment.divisionFrag", this);
                    this.getView().addDependent(this.divisionFrag);
                }
                    this.divisionFrag.open();
                    sap.ui.getCore().byId("divisionSrch").setValue("");
                    if(sap.ui.getCore().byId("division_listId").getBinding("items") !== undefined){
                        sap.ui.getCore().byId("division_listId").getBinding("items").filter();
                    }
            },
            handledivisionSrch:function(oEvent){
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                var oFilter = new Filter();
                if (sQuery) {
                        oFilter = new Filter([
                            new Filter("DIVISION_DESC", sap.ui.model.FilterOperator.Contains, sQuery),
                            new Filter("DIVISION", sap.ui.model.FilterOperator.Contains, sQuery)
                        ], false);
                }
                pFilter.push(oFilter);
                var listItem = sap.ui.getCore().byId("division_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            handleDivision:function(oEvent){
                
                // var onDivisionVal = oEvent.getSource().getValue();
                var onDivisionDesc = oEvent.getSource().getSelectedItem().getBindingContext("divisionData").getProperty("DIVISION_DESC");
                var onDivisionVal = oEvent.getSource().getSelectedItem().getBindingContext("divisionData").getProperty("DIVISION");
                this.getView().getModel("retailerInfoModel").setProperty("/MaterialInp/0/Division",onDivisionVal);
                // this.getView().byId("idDivision").setValue(onDivisionDesc);
                oEvent.getSource().removeSelections();
                this.closeDivision();
            },
            closeDivision:function(){
                this.divisionFrag.close();
                // this.shipToAddress = undefined;
            },
            onMaterialGrp:function(){
                if (!this.materialGrpFrag) {
                    this.materialGrpFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealordercreation.view.Fragment.materialGroup", this);
                    this.getView().addDependent(this.materialGrpFrag);
                }
                    this.materialGrpFrag.open();
                    sap.ui.getCore().byId("materialGrpSrch").setValue("");
                    if(sap.ui.getCore().byId("materialGrp_listId").getBinding("items") !== undefined){
                        sap.ui.getCore().byId("materialGrp_listId").getBinding("items").filter();
                    }
            },
            handleMaterialGrpSrch:function(oEvent){
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                var oFilter = new Filter();
                if (sQuery) {
                        oFilter = new Filter([
                            new Filter("MATERIAL_GROUP_DESC", sap.ui.model.FilterOperator.Contains, sQuery),
                            new Filter("MATERIAL_GROUP", sap.ui.model.FilterOperator.Contains, sQuery)
                        ], false);
                }
                pFilter.push(oFilter);
                var listItem = sap.ui.getCore().byId("materialGrp_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            handleMaterialGrp:function(oEvent){
                var materialDesc = oEvent.getSource().getSelectedItem().getBindingContext("materialGrpMaster").getProperty("MATERIAL_GROUP_DESC");
                var materialCode = oEvent.getSource().getSelectedItem().getBindingContext("materialGrpMaster").getProperty("MATERIAL_GROUP");
                this.getView().getModel("retailerInfoModel").setProperty("/MaterialGrpInp/0/materialDescInp",materialDesc);
                this.getView().getModel("retailerInfoModel").setProperty("/MaterialGrpInp/0/materialCodeInp",materialCode);
                this.getView().byId("idMaterialGrp").setValue(materialDesc);
                this.getView().byId("idMaterial").setValue("");
                this.getView().byId("materialQty").setValue(0);
                
                that.getView().byId("idAvlQtyFilter").setVisible(false);
                that.getView().byId("idMaterialQty").setVisible(false);
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-grn-acceptance/Material_Code_Master?$filter=MATERIAL_GROUP eq '" + materialCode + "'";
                this.postAjaxs(url,"GET",null,"materialMaster");

                oEvent.getSource().removeSelections();
                this.closeMaterialGrp();
            },
            closeMaterialGrp:function(){
                this.materialGrpFrag.close();
                // this.shipToAddress = undefined;
            },
            onMaterial:function(){
                var getMaterialGrp = this.getView().byId("idMaterialGrp").getValue();

                if(getMaterialGrp === "" || getMaterialGrp === undefined || getMaterialGrp === null){
                    MessageBox.error("Please select material group");
                }
                else{
                    if (!this.materialFrag) {
                        this.materialFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealordercreation.view.Fragment.material", this);
                        this.getView().addDependent(this.materialFrag);
                    }
                        this.materialFrag.open();
                        sap.ui.getCore().byId("materialSrch").setValue("");
                        if(sap.ui.getCore().byId("material_listId").getBinding("items") !== undefined){
                            sap.ui.getCore().byId("material_listId").getBinding("items").filter();
                        }
                }
            },
            handleMaterialSrch: function (oEvent) {
                var sQuery = oEvent.getSource().getValue();
                var pFilter = [];
                var oFilter = new Filter();
                if (sQuery) {
                        oFilter = new Filter([
                            new Filter("MATERIAL_DESC", sap.ui.model.FilterOperator.Contains, sQuery),
                            new Filter("MATERIAL_CODE", sap.ui.model.FilterOperator.Contains, sQuery)
                        ], false);
                }
                pFilter.push(oFilter);
                var listItem = sap.ui.getCore().byId("material_listId");
                var item = listItem.getBinding("items");
                item.filter(pFilter);
            },
            handleMaterial:function(oEvent){
                debugger
                var materialDesc = oEvent.getSource().getSelectedItem().getBindingContext("materialMaster").getProperty("MATERIAL_DESC");
                var materialCode = oEvent.getSource().getSelectedItem().getBindingContext("materialMaster").getProperty("MATERIAL_CODE");
                this.getView().getModel("retailerInfoModel").setProperty("/MaterialInp/0/materialDescInp",materialDesc);
                this.getView().getModel("retailerInfoModel").setProperty("/MaterialInp/0/materialCodeInp",materialCode);
                
                this.getView().byId("idMaterial").setValue(materialDesc);
                this.getView().byId("materialQty").setValue(0);
                // this.getView().getModel("retailerInfoModel").setProperty("/MaterialInp/0/MaterialDataObj/QUANTITY",0);
                // var getMaterialData  = this.getView().getModel("retailerDummyData").getData();
                
                var getMaterialGrp = this.getView().getModel("retailerInfoModel").getProperty("/MaterialGrpInp/0/materialCodeInp");
                
                BusyIndicator.show(0);
                var url = appModulePath + "/OData/v4/ideal-grn-acceptance/Grn_Stock?$filter=MATERIAL_GROUP eq '"+getMaterialGrp+"' and MATERIAL_CODE eq '"+materialCode+"'";
                this.postAjaxs(url,"GET",null,"retailerDummy");

                // var getMaterialDataArr = getMaterialData.filter(function (a,index) {
                //     if(a["MATERIAL_CODE"] === materialCode){
                //         return a;  
                //     }                
                // }, Object.create(null));

                // if(getMaterialDataArr.length > 0){
                //     this.getView().getModel("retailerInfoModel").setProperty("/MaterialInp/0/MaterialDataObj",getMaterialDataArr[0]);
                // }
                
                // that.getView().byId("idAvlQtyFilter").setVisible(true);
                // that.getView().byId("idAvlQtyTxt").setValue(getMaterialDataArr[0].QUANTITY);
                oEvent.getSource().removeSelections();
                this.closeMaterial();
            },
            closeMaterial:function(){
                this.materialFrag.close();
                // this.shipToAddress = undefined;
            },
            onBack:function(){
                BusyIndicator.show(0);
                this.getOwnerComponent().getModel("appView").setProperty("/layout","OneColumn");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMasterpage");
            },
            handleAddMaterial:function(){

                var dupMaterialCheck = [];
                var addedMaterialDataArr = [];
                var sIndex = NaN;
                
                var grossAmount = this.getView().getModel("retailerInfoModel").getProperty("/MaterialAmount/0/TOTAL_AMOUNT");
                var grossTaxAmount = this.getView().getModel("retailerInfoModel").getProperty("/MaterialAmount/0/TOTAL_TAXES");
                var getRetailer = this.getView().byId("idRetailer").getValue();
                var getShipToAddress = this.getView().byId("idShipTo").getValue();
                var getMaterialCode = this.getView().getModel("retailerInfoModel").getProperty("/MaterialInp/0/materialCodeInp");
                var getMaterialDesc = this.getView().getModel("retailerInfoModel").getProperty("/MaterialInp/0/materialDescInp");
                var getMaterialQty = Number(this.getView().byId("materialQty").getValue());
                // var getDivision = this.getView().byId("idDivision").getValue();
                var getQuantityAvl = this.getView().getModel("retailerInfoModel").getProperty("/MaterialInp/0/MaterialDataObj/MATERIAL_STOCK");
                var getMaterialGrp = this.getView().byId("idMaterialGrp").getValue();
                var getExistingTblData = this.getView().getModel("retailerTblModel").getProperty("/visibleRowCountArr");
                var getAddedMaterialObj = this.getView().getModel("retailerInfoModel").getProperty("/MaterialInp/0/MaterialDataObj");
                addedMaterialDataArr.push(getAddedMaterialObj);

                dupMaterialCheck = getExistingTblData.filter(function (a,index) {
                    if(getMaterialCode === a["MATERIAL_CODE"]){
                        sIndex = index;
                        return a;
                    }                
                }, Object.create(null));
                
                this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_AMOUNT",grossAmount);
                this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_TAXES",grossTaxAmount);


                if(getRetailer === ""){
                    MessageBox.error("Please select retailer");
                }
                else if(getShipToAddress === ""){
                    MessageBox.error("Please select ship to address");
                }
                else if(getMaterialGrp === ""){
                    MessageBox.error("Please select Material Group");
                }
                else if(getMaterialCode === null){
                    MessageBox.error("Please select Material");
                }
                else if(Number(getQuantityAvl) === 0){
                    MessageBox.information("The selected material is out of stock");
                }
                else if(getMaterialQty === 0){
                    MessageBox.error("Please enter material quantity");
                }
                else if(dupMaterialCheck.length >0){
                    this.getView().byId("idProductsTable").getItems()[Number(that.sIndex)].removeStyleClass("highlightedRow");
                    that.sIndex = Number(sIndex);
                    this.getView().byId("idProductsTable").getItems()[Number(sIndex)].addStyleClass("highlightedRow");
                    MessageBox.error("The Material "+getMaterialDesc+" is already added ");
                }
                else if(Number(getQuantityAvl) < Number(getMaterialQty)){
                    MessageBox.error("Please check the available quantity");
                }
                else if(getAddedMaterialObj.UPDATED_PRICE === null || Number(getAddedMaterialObj.UPDATED_PRICE) === 0 ||
                isNaN(getAddedMaterialObj.UPDATED_PRICE) === true){
                    MessageBox.information("Please update the price of "+ getMaterialDesc + " .");
                }
                else{
                    var getMaterialDataObj = this.getView().getModel("retailerInfoModel").getProperty("/MaterialInp/0/MaterialDataObj");
                    // if(getMaterialDataObj.UPDATED_PRICE === null || Number(getMaterialDataObj.UPDATED_PRICE) === 0 ||
                    //     isNaN(getMaterialDataObj.UPDATED_PRICE) === true){
                    //     var Std_Price = Number(getMaterialDataObj.UNIT_PRICE);
                    // }
                    // else{
                        var Std_Price = Number(getMaterialDataObj.UPDATED_PRICE);
                    // }
                    var Amount = Number(Std_Price) * Number(getMaterialQty); 
                    var cgstAmount = Amount*(Number(getMaterialDataObj.CGST_PERC)/100);
                    var sgstAmount = Amount*(Number(getMaterialDataObj.SGST_PERC)/100);
                    var totalAmount = Number(cgstAmount) + Number(sgstAmount) + Number(Amount);
                    totalAmount = totalAmount.toFixed(2);

                    // var netAmount = Amount;
                    // this.getView().getModel("retailerTblModel").getProperty(getPath).CGST_AMOUNT = cgstAmount;
                    // this.getView().getModel("retailerTblModel").getProperty(getPath).SGST_AMOUNT = sgstAmount;
                        var taxesAmount = Number(cgstAmount) + Number(sgstAmount);
                        taxesAmount = taxesAmount.toFixed(2);
                    // if(getExistingTblData.length === 0){
                        addedMaterialDataArr.filter(function (a,index) {
                            grossAmount = Number(grossAmount) + Number(totalAmount);
                            grossTaxAmount = Number(grossTaxAmount) + Number(taxesAmount);
                        }, Object.create(null));
                    // }
                    // if(getExistingTblData.length > 0){
                    //     getExistingTblData.filter(function (a,index) {
                    //         grossAmount = Number(grossAmount) + Number(a["TOTAL_AMOUNT"]);
                    //         grossTaxAmount = Number(grossTaxAmount) + Number(a["TAXES_AMOUNT"]);               
                    //     }, Object.create(null));    
                    // }
                    
                    this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_AMOUNT",grossAmount.toFixed(2));
                    this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_TAXES",grossTaxAmount.toFixed(2));
    
                    this.getView().byId("idTotalAmt").setVisible(true);
                    this.getView().byId("idTotalTaxes").setVisible(true);
                    this.getView().byId("saveBt").setEnabled(true);
                    this.getView().byId("idRetailer").setEditable(false);
                    this.getView().byId("idShipTo").setEditable(false);
                    var blankData = this.getOwnerComponent().getModel("retailerDatas").getProperty("/BlankJson");
                    var getRetailerTblData = this.getView().getModel("retailerInfoModel").getProperty("/retailerTblData");
                    if(getRetailerTblData.length === 0){
                        var nullObject = {Retailer:getRetailer,ShipTo:getShipToAddress,MATERIAL_CODE:getMaterialCode,MATERIAL_DESC:getMaterialDesc,
                            MATERIAL_GROUP_DESC:getMaterialDataObj.MATERIAL_GROUP_DESC,MATERIAL_GROUP:getMaterialDataObj.MATERIAL_GROUP,
                            QUANTITY:getMaterialQty,TOTAL_AMOUNT:totalAmount,HSN_CODE:getMaterialDataObj.HSN_CODE,
                            UNIT_OF_MEASURE :getMaterialDataObj.UNIT_OF_MEASURE,STD_PRICE :Number(Std_Price).toFixed(2),BASE_PRICE :getMaterialDataObj.BASE_PRICE,
                            DISC_AMOUNT :getMaterialDataObj.DISC_AMOUNT,DISC_PERCENTAGE :getMaterialDataObj.DISC_PERCENTAGE,
                            NET_AMOUNT: Amount,CGST_PERC:getMaterialDataObj.CGST_PERC, CGST_AMOUNT:cgstAmount,
                            SGST_PERC :getMaterialDataObj.SGST_PERC,SGST_AMOUNT:sgstAmount,IGST_PERC :getMaterialDataObj.IGST_PERC,
                            IGST_AMOUNT:getMaterialDataObj.IGST_AMOUNT,TAXES_AMOUNT :taxesAmount,AVAILABLE_QTY:getQuantityAvl};
                    }
                    else if(getRetailerTblData.length > 0){
                        // visibleRowCountArr = getAddressData;
                        const copyDefaultData = Object.assign({}, blankData[0]);
                        var nullObject = Object.assign(copyDefaultData,{Retailer:getRetailer},{ShipTo:getShipToAddress},{MATERIAL_CODE:getMaterialCode},
                        {MATERIAL_GROUP_DESC:getMaterialDataObj.MATERIAL_GROUP_DESC},{MATERIAL_GROUP:getMaterialDataObj.MATERIAL_GROUP},
                        {MATERIAL_DESC:getMaterialDesc},{QUANTITY:getMaterialQty},{TOTAL_AMOUNT:totalAmount},{HSN_CODE:null},
                        {HSN_CODE:getMaterialDataObj.HSN_CODE},{UNIT_OF_MEASURE :getMaterialDataObj.UNIT_OF_MEASURE},{STD_PRICE :Number(Std_Price).toFixed(2)},
                        {BASE_PRICE :getMaterialDataObj.BASE_PRICE},{DISC_AMOUNT :getMaterialDataObj.DISC_AMOUNT},{DISC_PERCENTAGE :getMaterialDataObj.DISC_PERCENTAGE},
                        {NET_AMOUNT: Amount},{CGST_PERC:getMaterialDataObj.CGST_PERC},{CGST_AMOUNT:cgstAmount}
                        ,{SGST_PERC :getMaterialDataObj.SGST_PERC},{SGST_AMOUNT:sgstAmount},{IGST_PERC :getMaterialDataObj.IGST_PERC},
                        {IGST_AMOUNT:getMaterialDataObj.IGST_AMOUNT},{TAXES_AMOUNT :taxesAmount},{AVAILABLE_QTY:getQuantityAvl});
                        // nullObject = nullObject[0];
                    }
                    object.visibleRowCountArr.push(nullObject);
                    var model = new JSONModel(object);
                    that.getView().setModel(model,"retailerTblModel");
                    this.getView().getModel("retailerInfoModel").setProperty("/retailerTblData",object.visibleRowCountArr);
                    
                    this.getView().byId("idMaterialGrp").setValue("");
                    this.getView().byId("idMaterial").setValue("");
                    this.getView().byId("materialQty").setValue(0);
                    that.getView().byId("idAvlQtyFilter").setVisible(false);
                    that.getView().byId("idMaterialQty").setVisible(false);
                }
            },
            handleDeleteEntries: function (oEvent) {
                
                var grossAmount = 0;
                var grossTaxAmount = 0;
                this.getView().getModel("retailerInfoModel").setProperty("/retailerTblData",[]);
                var index = oEvent.getSource().getBindingContext("retailerTblModel").getPath().split("/")[2];
                // oView.getModel("blankJson").getProperty("/visibleRowCountArr").splice(index, 1);
                this.getView().getModel("retailerTblModel").getProperty("/visibleRowCountArr").splice(index, 1)
                var timesheetArrData = object.visibleRowCountArr;
                // oView.getModel("blankJson").getProperty("/visibleRowCountArr");

                if(timesheetArrData.length > 0){
                    var getExistingTblData = this.getView().getModel("retailerTblModel").getProperty("/visibleRowCountArr");

                    getExistingTblData.filter(function (a,index) {
                        grossAmount = Number(grossAmount) + Number(a["TOTAL_AMOUNT"]);
                        grossTaxAmount = Number(grossTaxAmount) + Number(a["TAXES_AMOUNT"]);
                                    
                    }, Object.create(null));
                    
                    this.getView().getModel("retailerInfoModel").setProperty("/retailerTblData",timesheetArrData);
                }
                else if(timesheetArrData.length === 0){
                    // this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_AMOUNT",0);
                    // this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_TAXES",0);
                    this.getView().byId("idRetailer").setEditable(true);
                    this.getView().byId("idShipTo").setEditable(true);
                    this.getView().byId("saveBt").setEnabled(false);
                    this.getView().byId("idTotalAmt").setVisible(false);
                    this.getView().byId("idTotalTaxes").setVisible(false);
                    // this.getOwnerComponent().getModel("retailerData").setProperty("/visibleRowCountArr",that.nullTimesheetFields);
                }
                this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_TAXES",grossTaxAmount);
                this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_AMOUNT",grossAmount);
                    
                this.getView().getModel("retailerTblModel").refresh(true);
                // oView.byId("trAddId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/visibleRowCountArr").length);
            },
            handleRefresh:function(){
                this.getView().getModel("retailerTblModel").setProperty("/visibleRowCountArr",[]);
                this.getView().getModel("retailerTblModel").refresh(true);
                this.getView().byId("idRetailer").setValue("");
                this.getView().byId("idShipTo").setValue("");
                // this.getView().byId("idDivision").setValue("");
                this.getView().getModel("retailerInfoModel").setProperty("/retailerTblData",[]);
            },
            postAjaxs: function (url, type, data, model) {
            
                $.ajax({
                    url: url,
                    type: type,
                    data:data,
                    contentType: 'application/json',
                    success: function (data, response) {
                    BusyIndicator.hide();
                        // 
                    if(type === "GET"){
                        if(model === "retailerIdData"){
                            var retailerIdArr = [];
                            data.value.filter(function (a,index) {
                                if(a["RETAILER_ID"] && (!this[a["RETAILER_ID"]])){
                                    this[a["RETAILER_ID"]] = true;
                                    retailerIdArr.push({
                                        retailerId:a["RETAILER_ID"],
                                        retailerName:a["RETAILER_NAME"]
                                    });
                                }                
                            }, Object.create(null));
                            data.value = retailerIdArr;
                            // var oModel = new JSONModel(retailerIdArr);
                            // that.getView().setModel(oModel,model);
                        }
                        else if(model === "retailerAddr"){
                            var retailerAddrArr = [];
                            data.value.filter(function (a,index) {
                                // 
                                if(a["ADDRESS_TYPE"]){
                                    if(a["ADDRESS_LINE_2"] === null){
                                        a["ADDRESS_LINE_2"] = "";
                                    }
                                    else{
                                        a["ADDRESS_LINE_2"] = ","+a["ADDRESS_LINE_2"];
                                    }
                                    if(a["ADDRESS_LINE_3"] === null){
                                        a["ADDRESS_LINE_3"] = "";
                                    }
                                    else{
                                        a["ADDRESS_LINE_3"] = ","+a["ADDRESS_LINE_3"];
                                    }
                                    retailerAddrArr.push({address:a["ADDRESS_LINE_1"] + a["ADDRESS_LINE_2"] + a["ADDRESS_LINE_3"]});
                                }                
                            }, Object.create(null));
                            data.value = retailerAddrArr;
                            // var oModel = new JSONModel(retailerAddrArr);
                            // that.getView().setModel(oModel,model);
                        }
                        else if(model === "retailerDummy"){
                            that.getView().getModel("retailerInfoModel").setProperty("/MaterialInp/0/MaterialDataObj",data.value[0]);

                            if(data.value.length > 0){
                                if(data.value[0].UPDATED_PRICE === null || Number(data.value[0].UPDATED_PRICE) === 0 ||
                                        isNaN(data.value[0].UPDATED_PRICE) === true){
                                            that.getView().byId("idAddMaterial").setEnabled(false);
                                            that.getView().byId("idAvlQtyFilter").setVisible(false);
                                            that.getView().byId("idMaterialQty").setVisible(false);
                                            MessageBox.information("Please update the price of "+ data.value[0].MATERIAL_DESC + " .");
                                }
                                else if(data.value[0].MATERIAL_STOCK < 1){
                                    MessageBox.information("The selected material is out of stock");
                                    that.getView().byId("idAddMaterial").setEnabled(false);
                                    that.getView().byId("idAvlQtyFilter").setVisible(false);
                                    that.getView().byId("idMaterialQty").setVisible(false);
                                    // that.getView().byId("idAvlQtyTxt").setValue(data.value[0].MATERIAL_STOCK);
                                }
                                else {
                                    that.getView().byId("idAddMaterial").setEnabled(true);
                                    that.getView().byId("idAvlQtyFilter").setVisible(true);
                                    that.getView().byId("idMaterialQty").setVisible(true);
                                    that.getView().byId("idAvlQtyTxt").setValue(data.value[0].MATERIAL_STOCK);
                                }
                            }
                            else{
                                MessageBox.information("The selected material group has no materials");
                            }
                        }

                        if(model !== "retailerDummy"){
                            var oModel = new JSONModel(data.value);
                            that.getView().setModel(oModel,model);
                        }
                    }
                    else{
                        
                        MessageBox.success(data.value[0], {
                            actions: [MessageBox.Action.OK],
                            onClose: function (oAction) {
                                if (oAction === "OK") {
                                    that.onBack();
                                }
                            }
                        });
                    }
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
            validateTable: function (checkFields) {
                var oView = this.getView();
                if(this.oMP){
                    this.oMP.close();
                }
    
                if (checkFields.length > 0) {
                    var checkFieldsJson = new JSONModel();
                    checkFieldsJson.setData(checkFields);
                    oView.setModel(checkFieldsJson, "message");
                    var oButton = this.getView().byId("messagePopoverBtn");
                    oButton.setVisible(true);
                    setTimeout(function () {
                        this.oMP.openBy(oButton);
                    }.bind(this), 50);
                    this.createMessagePopover();
    
                } else {
                    this.getView().byId("messagePopoverBtn").setVisible(false);
                }
            },
            handleMessagePopoverPress: function (oEvent) {
                if (!this.oMP) {
                    this.createMessagePopover();
                }
                this.oMP.toggle(oEvent.getSource());
            },
    
            createMessagePopover: function () {
                this.oMP = new MessagePopover({
                    activeTitlePress: function (oEvent) {
                        var oItem = oEvent.getParameter("item").getProperty("key");
                        that.getView().byId("iconTabBar").setSelectedKey(oItem);
                    },
                    items: {
                        path: "message>/",
                        template: new MessageItem({
                            title: "{message>description}",
                            activeTitle: true,
                            subtitle: "{message>subtitle}",
                            type: "{message>type}",
                            key: "{message>key}"
                        })
                    },
                    groupItems: true
                });
                this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
            },
            onRetailerDataFetch:function(){
                
                var getTableData = this.getView().getModel("retailerTblModel").getProperty("/visibleRowCountArr");

                var validateTbl = validation.orderCreationTblVal(getTableData,[]);
                if(validateTbl.length>0){
                    this.validateTable(validateTbl);
                }
                else{
                    this.onSubmitData();
                }
            },
            onSubmitData:function(){
                // if(getTableData.length === 0){
                //     MessageBox.error("Please insert the ")
                // }
                var orderDataArr = [];
                var getRetailerId = that.onRetailerValue;
                // this.getView().byId("idRetailer").getValue();
                var getShipToAddress = this.getView().byId("idShipTo").getValue();
                var getTableData = this.getView().getModel("retailerTblModel").getProperty("/visibleRowCountArr");

                for(var i=0;i<getTableData.length;i++){
                    var orderDataObj = {
                        "SO_NO" :"1",
                        "RETAILER_ID":getRetailerId,
                        "ITEM_NO": 1,
                        "MATERIAL_GROUP" : getTableData[i].MATERIAL_GROUP,
                        "MATERIAL_GROUP_DESC": getTableData[i].MATERIAL_GROUP_DESC,
                        "MATERIAL_CODE": getTableData[i].MATERIAL_CODE,
                        "MATERIAL_DESC" :getTableData[i].MATERIAL_DESC,
                        "HSN_CODE" :getTableData[i].HSN_CODE,
                        "UNIT_OF_MEASURE" :getTableData[i].UNIT_OF_MEASURE,
                        "QUANTITY" :Number(getTableData[i].QUANTITY),
                        "FREE_QUANTITY": "0",
                        "DISPATCH_QUANTITY":0, 
                        "STD_PRICE" :String(getTableData[i].STD_PRICE),
                        "BASE_PRICE" :getTableData[i].BASE_PRICE,
                        "DISC_AMOUNT" :getTableData[i].DISC_AMOUNT,
                        "DISC_PERCENTAGE" :getTableData[i].DISC_PERCENTAGE,
                        "NET_AMOUNT" : String(getTableData[i].STD_PRICE),
                        "TOTAL_AMOUNT" :String(getTableData[i].TOTAL_AMOUNT),
                        "CGST_PERC" :getTableData[i].CGST_PERC,
                        "CGST_AMOUNT" :String(getTableData[i].CGST_AMOUNT),
                        "SGST_PERC" :getTableData[i].SGST_PERC,
                        "SGST_AMOUNT" :String(getTableData[i].SGST_AMOUNT),
                        "IGST_PERC" :getTableData[i].IGST_PERC,
                        "IGST_AMOUNT" :getTableData[i].IGST_AMOUNT,
                        "TAXES_AMOUNT" :String(getTableData[i].TAXES_AMOUNT)
                      }
                      orderDataArr.push(orderDataObj);
                }

                var oPayload = {
                    "soHeaders": [
                        {
                            "DISTRIBUTOR_ID": "1100013",
                            "SO_NO": "1",
                            "RETAILER_ID": getRetailerId,
                            "RETAILER_NAME":that.retailerName,
                            "CREATION_DATE" :new Date().toISOString().split("T")[0],
                            "DIVISION" : null,
                            "SHIP_TO_PARTY": getShipToAddress,
                            "GROSS_TOTAL":String(Number(this.getView().getModel("retailerInfoModel").getProperty("/MaterialAmount/0/TOTAL_AMOUNT")).toFixed(2)),
                            "STATUS" : 1
                        }
                    ],
                    "soItems": orderDataArr,
                    "userDetails": {
                            "USER_ROLE": "CM",
                            "USER_ID": "darshan.l@intellectbizware.com"
                    }
                }
                var url = appModulePath + "/OData/v4/ideal-retailer-registration/orderCreation";
                var data = JSON.stringify(oPayload);
                MessageBox.confirm("Do you want to submit ?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					// initialFocus: sap.m.MessageBox.Action.CANCEL,
					onClose: function (oAction) {
						// if (sButton === MessageBox.Action.OK) {
                        if (oAction === 'YES') {
                            BusyIndicator.show(0);
                            that.postAjaxs(url,"POST",data,"null");
						} else if (oAction === 'NO') {
							// Do something
						}

					}
				});
            },
            handleMaterialQty:function(oEvent){
                var grossAmount = 0;
                var grossTaxAmount = 0;
                var getStdPrice = Number(oEvent.getSource().getBindingContext("retailerTblModel").getProperty("STD_PRICE"));
                var getQty = Number(oEvent.getSource().getValue());
                var getPath = oEvent.getSource().getBindingContext("retailerTblModel").getPath();
                var getMaterialDataObj = this.getView().getModel("retailerTblModel").getProperty(getPath);
                
                var getQuantityAvl = Number(oEvent.getSource().getBindingContext("retailerTblModel").getProperty("AVAILABLE_QTY"));
                // Number(this.getView().getModel("retailerInfoModel").getProperty("/MaterialInp/0/MaterialDataObj/QUANTITY"));
                
                if(Number(getQuantityAvl) < Number(getQty)){
                    this.getView().getModel("retailerTblModel").getProperty(getPath).QUANTITY = Number(getMaterialDataObj.QUANTITY);
                    this.getView().getModel("retailerTblModel").refresh(true);
                    MessageBox.error("Please enter a material quantity less than or equal to " + (Number(getQuantityAvl)));
                    // MessageBox.error("Please check the available quantity");
                }
                else if(String(getQty).includes(".")){
                    this.getView().getModel("retailerTblModel").getProperty(getPath).QUANTITY = Number(getMaterialDataObj.QUANTITY);
                    this.getView().getModel("retailerTblModel").refresh(true);
                    MessageBox.error("Please enter a number without dot(.)");
                }
                else{
                    var Amount = getStdPrice * getQty;
                    Amount = Amount.toFixed(2);
                    var cgstAmount = Amount*(Number(getMaterialDataObj.CGST_PERC)/100);
                    cgstAmount = cgstAmount.toFixed(2);
                    var sgstAmount = Amount*(Number(getMaterialDataObj.SGST_PERC)/100);
                    sgstAmount = sgstAmount.toFixed(2);
                    var totalAmount = Number(cgstAmount) + Number(sgstAmount) + Number(Amount);
                    totalAmount = totalAmount.toFixed(2);
                    // this.getView().getModel("retailerTblModel").getProperty(a+"/Std_Price");
                    this.getView().getModel("retailerTblModel").getProperty(getPath).NET_AMOUNT = Amount;
                    this.getView().getModel("retailerTblModel").getProperty(getPath).CGST_AMOUNT = cgstAmount;
                    this.getView().getModel("retailerTblModel").getProperty(getPath).SGST_AMOUNT = sgstAmount;
                    this.getView().getModel("retailerTblModel").getProperty(getPath).TAXES_AMOUNT = Number(Number(cgstAmount) + Number(sgstAmount)).toFixed(2);
                    this.getView().getModel("retailerTblModel").getProperty(getPath).QUANTITY = getQty;
                    this.getView().getModel("retailerTblModel").getProperty(getPath).TOTAL_AMOUNT = Number(totalAmount).toFixed(2);
                    this.getView().getModel("retailerTblModel").refresh(true);
                    
                    var getExistingTblData = this.getView().getModel("retailerTblModel").getProperty("/visibleRowCountArr");

                    getExistingTblData.filter(function (a,index) {
                        grossAmount = Number(grossAmount) + Number(a["TOTAL_AMOUNT"]);
                        grossTaxAmount = Number(grossTaxAmount) + Number(a["TAXES_AMOUNT"]);
                                    
                    }, Object.create(null));
                    this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_TAXES",grossTaxAmount.toFixed(2));
                    this.getView().getModel("retailerInfoModel").setProperty("/MaterialAmount/0/TOTAL_AMOUNT",grossAmount.toFixed(2));
                }
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
