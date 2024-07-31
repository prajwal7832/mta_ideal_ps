// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealdistributorstockdata.controller.Masterpage", {
//         onInit: function () {

//         }
//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet",
	"../model/xlsx",
	"../model/jszip",
    "../model/validation",
    "../model/formatter",
    "sap/ui/Device"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,BusyIndicator,MessageBox,Filter,exportLibrary,Spreadsheet,
        xlsx,jszip,validation,formatter,Device) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        var appModulePath,that,context,sDevice;

        return Controller.extend("com.ibs.ibsappidealdistributorstockdata.controller.Masterpage", {
            formatter:formatter,
            onInit: function () {
                that = this;
                context = this;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);

                
                const oDeviceModel = new JSONModel(Device);
			    oDeviceModel.setDefaultBindingMode("OneWay");
			    this.getOwnerComponent().setModel(oDeviceModel, "device");

			    sDevice = this.getOwnerComponent().getModel("device").getData();

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("RouteMasterpage").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched:function(){
                var dupValueModel = new JSONModel({});
                this.getView().setModel(dupValueModel,"dupValueModel");
                this.getView().setModel(dupValueModel,"dupValueModel2");
                this.getView().byId("idInpPrice").setVisible(true);
                this.getView().byId("idEditBtn").setVisible(false);
                this.getView().byId("idStatus").setVisible(false);
                this.getView().byId("saveBt").setEnabled(false);

                if(sDevice.system.phone === true && sDevice.orientation.portrait === true){
                    that.getView().byId("FileUploaderId").setButtonText(" ");
                }
                else{
                    that.getView().byId("FileUploaderId").setButtonText("Upload");
                }
                // var url = appModulePath + "/sap/opu/odata/sap/ZIBS_DMS_GRN_SRV/PricingSet";
                // BusyIndicator.show(0);
                this.readEntity();
                
                
                // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                // this.postAjaxs(url,"GET","null","distributorData","UPDATE","onLoad");

                
                
                // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Material_Code_Master";
                // this.postAjaxs(url,"GET","null","materialMaster",null,"onMaterialGrpSelect");

                var countOrders = {
                    oCountPending:0,
                    oCountUpdated:0,
                    oCountAll:0,
                    materialGrpFilter:null,
                    materialFilter:null,
                    materialGrpItem:null,
                    materialItem:null
                }
                var oModel = new JSONModel(countOrders);
                this.getView().setModel(oModel,"defaultDataModel");
            },
            readEntity:function(url,type,model,sType,sAction){
                debugger
                context.oDataModel = context.getOwnerComponent().getModel("onPremiseSrv");
                context.oDataModel.read("/" + "PricingSet", {
                    // filters: [sFilter],
                    success: function (oData, responce) {
                        // BusyIndicator.hide();
                        var oModel = new JSONModel(oData.results);
                        that.getView().setModel(oModel,"S4DataModel");

                        // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                        // BusyIndicator.show(0);
                        var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                        that.postAjaxs(url,"GET","null","distributorData","PENDING","onLoad");
                        // that.postAjaxs(url,"GET","null","distributorData","ALL","onLoad");
                        // that.postAjaxs(url,"GET","null","distributorData","PENDING","onLoad");
                    },
                    error:function(error){
                        // BusyIndicator.hide();
                        var oXML,oXMLMsg;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"].value;
                        } else {
                            oXMLMsg = error.responseText
                        }
                        MessageBox.error(oXMLMsg);
                    }
            })
            },
            postAjaxs: function (url, type, data, model,sType,sAction) {
                var materialGrpArr = [];
                var materialArr = [];
                var getS4Data = that.getView().getModel("S4DataModel").getData();
                $.ajax({
                    url: url,
                    data:data,
                    type: type,
                    contentType: 'application/json',
                    dataType:'JSON',
                    success: function (data, response) {
                        // BusyIndicator.hide();
                        var getUpdateFieldsArr = [];
                        var getPendingDataArr = [];
                        var getPendingForMerge = [];
                        var getUpdateForMerge = [];
                        // var getUpdatedDataArr = [];
                        var dupValueModel = new JSONModel({});
                        that.getView().setModel(dupValueModel,"dupValueModel2");
                        if(type === "GET"){
                            var combPendingData;
                            if(sType === "PENDING" || sType === "UPDATE" || sType === "ALL"){
                                for(var i=0;i<data.value.length;i++){
                                    var getUpdatedDataArr = getS4Data.filter(function (a,index) {
                                        combPendingData = a;
                                        var comb = data.value[i].MATERIAL_GROUP +"|"+data.value[i].MATERIAL_CODE;
                                        if(data.value[i].STATUS === 4){
                                                // var comb = combPendingData.MaterialGroup +"|"+combPendingData.MaterialCode;
                                                var getProp = that.getView().getModel("dupValueModel2").getProperty("/"+comb,comb);
                                                if(getProp === undefined){
                                                    getUpdateFieldsArr.push(data.value[i]);
                                                    that.getView().getModel("dupValueModel2").setProperty("/"+comb,comb);
                                                }
                                        }    
                                        // else if(data.value[i].STATUS === 3){
                                        //     var comb = combPendingData.MaterialGroup +"|"+combPendingData.MaterialCode;
                                        //          var getProp = that.getView().getModel("dupValueModel").getProperty("/"+comb,comb);
                                        //         if(getProp === undefined){
                                        //             getPendingDataArr.push(combPendingData);
                                        //             that.getView().getModel("dupValueModel").setProperty("/"+comb,comb);
                                        //         }
                                        // } 
                                        else{        
                                            var sFlag = true;                                        
                                                var getStatusUptData = data.value.filter(function (a,index) {
                                                        if(a["MATERIAL_CODE"] === data.value[i].MATERIAL_CODE &&
                                                        a["MATERIAL_GROUP"] === data.value[i].MATERIAL_GROUP && a["STATUS"] == 4){
                                                            return a;
                                                        }  
                                                        else if(a["MATERIAL_CODE"] === data.value[i].MATERIAL_CODE &&
                                                        a["MATERIAL_GROUP"] === data.value[i].MATERIAL_GROUP && a["STATUS"] == 3){
                                                            sFlag = false;
                                                        }         
                                                }, Object.create(null));

                                            if(getStatusUptData.length > 0){
                                                var comb = getStatusUptData[0].MATERIAL_GROUP +"|"+getStatusUptData[0].MATERIAL_CODE;
                                                var getProp = that.getView().getModel("dupValueModel2").getProperty("/"+comb,comb);
                                                if(getProp === undefined){
                                                    that.getView().getModel("dupValueModel2").setProperty("/"+comb,comb);
                                                    getUpdateFieldsArr.push(getStatusUptData[0]);
                                                }
                                            }
                                            else if(sFlag === false){
                                                var comb = data.value[i].MATERIAL_GROUP +"|"+data.value[i].MATERIAL_CODE;
                                                var getProp = that.getView().getModel("dupValueModel").getProperty("/"+comb,comb);
                                                if(getProp === undefined){
                                                    that.getView().getModel("dupValueModel").setProperty("/"+comb,comb);
                                                    getPendingDataArr.push(data.value[i]);
                                                }
                                            }
                                            else{
                                            var comb = combPendingData.MaterialGroup +"|"+combPendingData.MaterialCode;
                                                 var getProp = that.getView().getModel("dupValueModel").getProperty("/"+comb,comb);
                                                if(getProp === undefined){
                                                    getPendingDataArr.push(combPendingData);
                                                    that.getView().getModel("dupValueModel").setProperty("/"+comb,comb);
                                                }
                                            }
                                        }      
                                    }, Object.create(null));
                                    // data.value[i].MATERIAL_CODE = Number(data.value[i].MATERIAL_CODE);
                                    
                                    if(Number(data.value[i].UPDATED_PRICE) !== 0){
                                        data.value[i].UPDATED_PRICE = Number(data.value[i].UPDATED_PRICE).toFixed(2);
                                    }
                                }

                                // For filter

                                if(sAction === "onLoad" || sType === "PENDING" || sAction === "onSelect" || (sAction === sType)){
                                    var getFilterArr = [];
                                    if(sType === "PENDING"){
                                        // for(var i=0;i<getPendingDataArr.length;i++){
                                        //     getPendingDataArr[i].MATERIAL_GROUP = getPendingDataArr[i].MaterialGroup;
                                        //     getPendingDataArr[i].MATERIAL_GROUP_DESC = getPendingDataArr[i].MaterialGrpdes;
                                        //     getPendingDataArr[i].MATERIAL_CODE = Number(getPendingDataArr[i].MaterialCode);
                                        //     getPendingDataArr[i].MATERIAL_DESC = getPendingDataArr[i].MaterialDesc;
                                        //     getPendingDataArr[i].UNIT_PRICE = getPendingDataArr[i].UnitPrice;
                                        // }
                                        getFilterArr = getPendingDataArr;
                                    }
                                    else if(sType === "UPDATE"){
                                        getFilterArr = getUpdateFieldsArr;
                                    }
                                    else if(sType === "ALL"){
                                        getPendingForMerge = getPendingDataArr;
                                        getUpdateForMerge = getUpdateFieldsArr;
                                        var getFilterArr=getPendingForMerge.concat(getUpdateForMerge);
                                        // $.merge(getPendingForMerge,getUpdateForMerge);
                                        // var getFilterArr = getPendingForMerge;
                                    }
                                    for(var i=0;i<getFilterArr.length;i++){
                                         var getMaterialGrpObj ={
                                                MATERIAL_GROUP :getFilterArr[i].MATERIAL_GROUP,
                                                MATERIAL_GROUP_DESC:getFilterArr[i].MATERIAL_GROUP_DESC  
                                            }
                                            if(materialGrpArr.length === 0){
                                                materialGrpArr.push(getMaterialGrpObj);
                                            }
                                            else{
                                                var getMaterialArr = materialGrpArr.filter(function (a,index) {
                                                    if(a["MATERIAL_GROUP"] == getFilterArr[i].MATERIAL_GROUP){
                                                        return a;
                                                    }           
                                                }, Object.create(null));

                                                if(getMaterialArr.length === 0){
                                                    materialGrpArr.push(getMaterialGrpObj);
                                                }
                                            }

                                    var getMaterialObj={
                                        MATERIAL_GROUP :getFilterArr[i].MATERIAL_GROUP,
                                        MATERIAL_CODE:getFilterArr[i].MATERIAL_CODE,
                                        MATERIAL_DESC:getFilterArr[i].MATERIAL_DESC 
                                    }
                                    materialArr.push(getMaterialObj);
                                    }
                                    that.getView().getModel("defaultDataModel").setProperty("/materialGrpFilter",materialGrpArr);
                                    var oModel = new JSONModel(materialArr);
                                    that.getView().setModel(oModel,"materialMaster");
                                }

                                if(sType === "PENDING"){
                                    if(sAction === "onFilter"){
                                        getPendingDataArr = data.value;
                                    }
                                    else{
                                        that.getView().getModel("defaultDataModel").setProperty("/oCountUpdated",getUpdateFieldsArr.length);
                                        that.getView().getModel("defaultDataModel").setProperty("/oCountAll",getUpdateFieldsArr.length + getPendingDataArr.length);
                                    }
                                    that.getView().getModel("defaultDataModel").setProperty("/oCountPending",getPendingDataArr.length);
                                    var oModel = new JSONModel(getPendingDataArr);
                                    that.getView().setModel(oModel,model);
                                    }
                               
                                else if(sType === "ALL"){
                            
                                    if(sAction !== "onFilter"){
                                        that.getView().getModel("defaultDataModel").setProperty("/oCountUpdated",getUpdateFieldsArr.length);
                                        that.getView().getModel("defaultDataModel").setProperty("/oCountPending",getPendingDataArr.length);
                                    }
                                    that.getView().getModel("defaultDataModel").setProperty("/oCountAll",getUpdateFieldsArr.length + getPendingDataArr.length);
                                }
                                
                            }
                            
                            if(sType === "UPDATE" || sAction === "onPost"){
                                // that.getView().getModel("defaultDataModel").setProperty("/oCountAll",getUpdateFieldsArr.length + getPendingDataArr.length);
                                that.getView().getModel("defaultDataModel").setProperty("/oCountUpdated",getUpdateFieldsArr.length);
                                // that.getView().getModel("defaultDataModel").setProperty("/oCountPending",getPendingDataArr.length);
                                
                                if(sAction === "onPost" || sAction !== "onLoad"){
                                    var oModel = new JSONModel(getUpdateFieldsArr);
                                    that.getView().setModel(oModel,model);
                                }
                            }

                            if(sType === "ALL" || sAction === "ALL"){
                                that.getView().getModel("defaultDataModel").setProperty("/oCountAll",getUpdateFieldsArr.length + getPendingDataArr.length);
                                getPendingForMerge = getPendingDataArr;
                                getUpdateForMerge = getUpdateFieldsArr;
                                var getFilterArr=getPendingForMerge.concat(getUpdateForMerge);
                                if(sAction !== "onLoad"){
                                    // $.merge(getPendingForMerge,getUpdateForMerge);
                                    var oModel = new JSONModel(getFilterArr);
                                    that.getView().setModel(oModel,model);
                                }
                            }

                            if((sAction === "onSelect" && sType === "PENDING") || sAction === "onMaterialGrpSelect"){
                                if(sType === "PENDING"){
                                    that.getView().getModel("defaultDataModel").setProperty("/oCountPending",getPendingDataArr.length);
                                }
                                if(sAction === "onSelect" ){
                                    that.getView().getModel("defaultDataModel").setProperty("/oCountUpdated",getUpdateFieldsArr.length);
                                    that.getView().getModel("defaultDataModel").setProperty("/oCountAll",getPendingDataArr.length + getUpdateFieldsArr.length);
                                }
                            }  
                            else if((sAction === "onSelect" && sType === "UPDATE") || sAction === "onMaterialGrpSelect"){

                                // for(var i=0;i<getPendingDataArr.length;i++){
                                //     getPendingDataArr[i].MATERIAL_GROUP = getPendingDataArr[i].MaterialGroup;
                                //     getPendingDataArr[i].MATERIAL_GROUP_DESC = getPendingDataArr[i].MaterialGrpdes;
                                //     getPendingDataArr[i].MATERIAL_CODE = getPendingDataArr[i].MaterialCode;
                                //     getPendingDataArr[i].MATERIAL_DESC = getPendingDataArr[i].MaterialDesc;
                                //     getPendingDataArr[i].UNIT_PRICE = getPendingDataArr[i].UnitPrice;
                                // }
                                var oModel = new JSONModel(getUpdateFieldsArr);
                                that.getView().setModel(oModel,model);
                                if(sType === "UPDATE"){
                                    that.getView().getModel("defaultDataModel").setProperty("/oCountUpdated",getUpdateFieldsArr.length);
                                }
                                if(sAction === "onSelect"){
                                    that.getView().getModel("defaultDataModel").setProperty("/oCountPending",getPendingDataArr.length);
                                    that.getView().getModel("defaultDataModel").setProperty("/oCountAll",getUpdateFieldsArr.length + getPendingDataArr.length);
                                }
                            }                            
                        }
                        else{
                            var dupValueModel = new JSONModel({});
                            that.getView().setModel(dupValueModel,"dupValueModel");
                            that.getView().setModel(dupValueModel,"dupValueModel2");
                            MessageBox.success(data.value);
                            that.getView().byId("idSearchValue").setValue("");
                            if(sType === "UPDATE"){
                            var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                            that.postAjaxs(url,"GET","null","distributorData","UPDATE","onPost");
                            }
                            else if(sType === "PENDING"){
                                // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                                // that.postAjaxs(url,"GET","null","distributorData","UPDATE","onLoad");

                                var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                                that.postAjaxs(url,"GET","null","distributorData","PENDING","onLoad");

                            }
                            else{
                                var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                                that.postAjaxs(url,"GET","null","distributorData","ALL");                                
                                // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                                // that.postAjaxs(url,"GET","null","distributorData","UPDATE",sAction);
                                // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock?$filter=STATUS eq 3 and MATERIAL_STOCK gt 0";
                                // that.postAjaxs(url,"GET","null","distributorData","PENDING",sAction);

                            }
                        }
                    },
                    error:function(error){
                        
                        // BusyIndicator.hide();
                        var oXML,oXMLMsg;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"].value;
                        } else {
                            oXMLMsg = error.responseText
                        }
                        MessageBox.error(oXMLMsg);
                    }
                })
            },
            
            onMaterial:function(){
                var getMaterialGrp = this.getView().byId("idMaterialGrp").getValue();

                // if(getMaterialGrp === "" || getMaterialGrp === null || getMaterialGrp === undefined){
                //     MessageBox.error("Please select material group");
                // }
                // else{
                    if (!this.materialFrag) {
                        this.materialFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealdistributorstockdata.view.Fragment.materialFrag", this);
                        this.getView().addDependent(this.materialFrag);
                    }
                        this.materialFrag.open();
                        sap.ui.getCore().byId("materialSrch").setValue("");
                        if(sap.ui.getCore().byId("material_listId").getBinding("items") !== undefined){
                            sap.ui.getCore().byId("material_listId").getBinding("items").filter();
                        }
                    // }
            },
            handleMaterialSrch:function(oEvent){
                debugger
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
                var materialCode = oEvent.getSource().getSelectedItem().getBindingContext("materialMaster").getProperty("MATERIAL_CODE");
                var materialDesc = oEvent.getSource().getSelectedItem().getBindingContext("materialMaster").getProperty("MATERIAL_DESC");
                this.getView().byId("idMaterial").setValue(materialDesc);
                that.getView().getModel("defaultDataModel").setProperty("/materialItem",materialCode);
                oEvent.getSource().removeSelections(true);
                this.closeMaterial();
            },
            closeMaterial:function(){
                this.materialFrag.close();
            },
            onMaterialGrp:function(oEvent){
                debugger
                if (!this.materialGrpFrag) {
                    this.materialGrpFrag = new sap.ui.xmlfragment("com.ibs.ibsappidealdistributorstockdata.view.Fragment.materialGrpFrag", this);
                    this.getView().addDependent(this.materialGrpFrag);
                }
                    this.materialGrpFrag.open();
                    sap.ui.getCore().byId("materialGrpSrch").setValue("");
                    if(sap.ui.getCore().byId("materialGrp_listId").getBinding("items") !== undefined){
                        sap.ui.getCore().byId("materialGrp_listId").getBinding("items").filter();
                    }
            },
            handleMaterialGrpSrch:function(oEvent){
                debugger
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
                debugger
                var getMaterialArr = [];
                var materialCode = oEvent.getSource().getSelectedItem().getBindingContext("defaultDataModel").getProperty("MATERIAL_GROUP");
                var materialDesc = oEvent.getSource().getSelectedItem().getBindingContext("defaultDataModel").getProperty("MATERIAL_GROUP_DESC");
                this.getView().byId("idMaterialGrp").setValue(materialDesc);
                that.getView().getModel("defaultDataModel").setProperty("/materialGrpItem",materialCode);

                var getMaterialData = that.getView().getModel("materialMaster").getData();

                if(getMaterialData.length > 0){
                    getMaterialArr = getMaterialData.filter(function (a,index) {
                        if(a["MATERIAL_GROUP"] == materialCode){
                            return a;
                        }           
                    }, Object.create(null));
                }
                var oModel = new JSONModel(getMaterialArr);
                this.getView().setModel(oModel,"materialMaster");
                // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Material_Code_Master?$filter=MATERIAL_GROUP eq '" + materialCode + "' and MATERIAL_STOCK gt 0";
                // this.postAjaxs(url,"GET","null","materialMaster",null,"onMaterialGrpSelect");
                this.getView().byId("idMaterial").setValue(null);
                that.getView().getModel("defaultDataModel").setProperty("/materialItem",null);
                oEvent.getSource().removeSelections(true);
                this.closeMaterialGrp();
            },
            closeMaterialGrp:function(){
                this.materialGrpFrag.close();
            },
            onSelectGo:function(){
                
                var aFilter = [];
                var getMaterialGrpItem = that.getView().getModel("defaultDataModel").getProperty("/materialGrpItem");
                var getMaterialItem = that.getView().getModel("defaultDataModel").getProperty("/materialItem");

                if(getMaterialGrpItem !== null){
                    var oFilter = new Filter("MATERIAL_GROUP", sap.ui.model.FilterOperator.Contains, getMaterialGrpItem);
                    var aFilterItem = "MATERIAL_GROUP eq '"+getMaterialGrpItem+"'";
                    aFilter.push(aFilterItem);
                }

                if(getMaterialItem !== null){
                    var oFilter1 = new Filter("MATERIAL_CODE", sap.ui.model.FilterOperator.Contains, getMaterialItem);
                    
                    var aFilterItem = "MATERIAL_CODE eq '"+getMaterialItem+"'";
                    aFilter.push(aFilterItem);
                }

                if(aFilter.length > 0){
                    // BusyIndicator.show(0);
                        var oTable = this.getView().byId("distributorTblData");
			            this.binding = oTable.getBinding("items");
                        var oFil = new sap.ui.model.Filter([oFilter,oFilter1]);

                        for(var i=0;i<oFil.aFilters.length;i++){
                            if(oFil.aFilters[i] === undefined){
                                oFil.aFilters.splice(i,1);
                            }
                        }
				        this.binding.filter(oFil, sap.ui.model.FilterType.Application);
                        var oTable = this.getView().byId("distributorTblData");
                        var getCount = oTable.getBinding("items").getCount();
                    
                        var getSelectedKey = this.getView().byId("idIconTabBar").getSelectedKey();
                        if(getSelectedKey === "Pending_Orders"){
                            that.getView().getModel("defaultDataModel").setProperty("/oCountPending",getCount); 
                        }
                        else if(getSelectedKey === "ALL_Orders"){
                            that.getView().getModel("defaultDataModel").setProperty("/oCountAll",getCount);
                        }
                        else if(getSelectedKey === "Updated_Orders"){
                            that.getView().getModel("defaultDataModel").setProperty("/oCountUpdated",getCount);
                        }
                }

            },
            handleRefresh:function(){
                this.getView().byId("idSearchValue").setValue("");
                this.getView().byId("idMaterialGrp").setValue();
                this.getView().byId("idMaterial").setValue();

                that.getView().getModel("defaultDataModel").setProperty("/materialGrpFilter",null);
                that.getView().getModel("defaultDataModel").setProperty("/materialFilter",null);
                that.getView().getModel("defaultDataModel").setProperty("/materialItem",null);
                that.getView().getModel("defaultDataModel").setProperty("/materialGrpItem",null);

                var dupValueModel = new JSONModel({});
                that.getView().setModel(dupValueModel,"dupValueModel");
                
                // BusyIndicator.show(0);
                var getSelectedKey = this.getView().byId("idIconTabBar").getSelectedKey();
                var sKey,sStatus,url;
                if(getSelectedKey === "Pending_Orders"){
                    sKey = "PENDING";
                    sStatus = "STATUS eq 3 and MATERIAL_STOCK gt 0";
                    url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                }
                else if(getSelectedKey === "ALL_Orders"){
                    sKey = "ALL";
                    url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                }
                else{
                    sKey = "UPDATE";
                    sStatus = "STATUS eq 4 and MATERIAL_STOCK gt 0";
                    url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                }
                this.postAjaxs(url,"GET","null","distributorData",sKey,sKey);

                // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Material_Code_Master";
                // this.postAjaxs(url,"GET","null","materialMaster",null,"onMaterialGrpSelect");
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
            onSearch:function(oEvent,onRoute){
                var sQuery;
                var getSelecteyKey = this.getView().byId("idIconTabBar").getSelectedKey();
                if(onRoute === "onRouteMatch"){
                    sQuery = oEvent;
                }
                else{
                    sQuery = oEvent.getSource().getValue();
                }
                // oEvent.getSource().getValue();
                var oTable = this.getView().byId("distributorTblData");
                this.binding = oTable.getBinding("items");

                if (sQuery && sQuery.length > 0) {
                    var oFilter1 = new Filter("MATERIAL_GROUP", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter2 = new Filter("MATERIAL_DESC", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter3 = new Filter("MATERIAL_GROUP_DESC", sap.ui.model.FilterOperator.Contains, sQuery);
                    var oFilter4 = new Filter("MATERIAL_CODE", sap.ui.model.FilterOperator.Contains, sQuery);

                    var oFil = new sap.ui.model.Filter([oFilter1,oFilter2,oFilter3,oFilter4]);
		
                    this.binding.filter(oFil, sap.ui.model.FilterType.Application);

                    var oTable = this.getView().byId("distributorTblData");
                    var getCount = oTable.getBinding("items").getCount();
                    var getSelectedKey = this.getView().byId("idIconTabBar").getSelectedKey();

                    if(getSelectedKey === "Pending_Orders"){
                        that.getView().getModel("defaultDataModel").setProperty("/oCountPending",getCount); 
                    }
                    else if(getSelectedKey === "ALL_Orders"){
                        that.getView().getModel("defaultDataModel").setProperty("/oCountAll",getCount);
                    }
                    else if(getSelectedKey === "Updated_Orders"){
                        that.getView().getModel("defaultDataModel").setProperty("/oCountUpdated",getCount);
                       
                    }
                } else {
                    this.binding.filter([]);
                }

            },
            onFilterSelect:function(oEvent){
                that = this;
                var dupValueModel = new JSONModel({});
                this.getView().setModel(dupValueModel,"dupValueModel");
                this.getView().setModel(dupValueModel,"dupValueModel2");

                this.getView().byId("idSearchValue").setValue("");
                this.getView().byId("idMaterialGrp").setValue();
                this.getView().byId("idMaterial").setValue();
                // BusyIndicator.show(0);
                
                // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock?$filter=STATUS eq 3 and MATERIAL_STOCK gt 0";
                // this.postAjaxs(url,"GET","null","distributorData","PENDING","onLoad");
                // var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                // this.postAjaxs(url,"GET","null","distributorData","UPDATE","onLoad");

                var getSelectedKey = oEvent.getSource().getSelectedKey();

                // if(getSelectedKey !== "ALL_Orders"){
                //     BusyIndicator.show(0);
                //     var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock?$filter=MATERIAL_STOCK gt 0";
                //     this.postAjaxs(url,"GET","null","distributorData","ALL","onLoad");
                // }

                if(getSelectedKey === "Pending_Orders"){
                    this.getView().byId("FileUploaderId").setVisible(true);
                    // that.getView().byId("idFilterBar").setVisible(true);
                    this.getView().byId("idMasterPage").setShowFooter(true);
                    this.getView().byId("idEditBtn").setVisible(false);
                    this.getView().byId("idInpPrice").setVisible(true);
                    this.getView().byId("idTextPrice").setVisible(false);
                    this.getView().byId("idStatus").setVisible(false);
                    // BusyIndicator.show(0);
                    var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                    this.postAjaxs(url,"GET","null","distributorData","PENDING","onSelect");
                }
                else if(getSelectedKey === "Updated_Orders"){
                    this.getView().byId("FileUploaderId").setVisible(true);
                    // that.getView().byId("idFilterBar").setVisible(true);
                    this.getView().byId("idMasterPage").setShowFooter(false);
                    this.getView().byId("idEditBtn").setVisible(true);
                    this.getView().byId("idInpPrice").setVisible(false);
                    this.getView().byId("idTextPrice").setVisible(true);
                    this.getView().byId("idStatus").setVisible(false);
                    // BusyIndicator.show(0);
                    var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                    this.postAjaxs(url,"GET","null","distributorData","UPDATE","onSelect");
                }
                else{   
                    this.getView().byId("FileUploaderId").setVisible(false);
                    // that.getView().byId("idFilterBar").setVisible(false);
                    this.getView().byId("idMasterPage").setShowFooter(false);
                    this.getView().byId("idEditBtn").setVisible(false);
                    this.getView().byId("idInpPrice").setVisible(false);
                    this.getView().byId("idTextPrice").setVisible(true);
                    this.getView().byId("idStatus").setVisible(true);
                    // BusyIndicator.show(0);
                    var url = appModulePath + "/odata/v4/ideal-grn-acceptance/Grn_Stock";
                    this.postAjaxs(url,"GET","null","distributorData","ALL","onSelect");
                    
                }
            },
            onEdit:function(oEvent){
                
                var getEditDataObj = oEvent.getSource().getBindingContext("distributorData").getObject();
                that.updatedPriceFrag = getEditDataObj.UPDATED_PRICE;
                var oModel = new JSONModel(getEditDataObj);
                this.getView().setModel(oModel,"editStockModel");

                if (!this.tabFieldsFrag) {
                    this.tabFieldsFrag = sap.ui.xmlfragment("com.ibs.ibsappidealdistributorstockdata.view.Fragment.editStockFrag", this);
                    this.getView().addDependent(this.tabFieldsFrag);
                }
                this.tabFieldsFrag.open();
                sap.ui.getCore().byId("idUpdatedPrice").setValue(getEditDataObj.UPDATED_PRICE);
            },
            onCloseFrag:function(){
                this.tabFieldsFrag.close();
                // this.getView().getModel("editStockModel").setData(null);
            },
            onUpdatedPriceChange:function(oEvent){
                
                var getSelectedItemObj = oEvent.getSource().getValue();
                // .getBindingContext("distributorItemsData").getObject();
                var changedAccQty = Number(oEvent.getSource().getValue());

                //  if(String(changedAccQty).includes(".")){
                //     getSelectedItemObj.UPDATED_PRICE = getSelectedItemObj.UPDATED_PRICE;
                //     this.getOwnerComponent().getModel("distributorItemsData").refresh(true);
                //     MessageBox.error("Please enter a number without dot(.)");
                // }
                
                if(String(changedAccQty).includes("-")){
                    oEvent.getSource().setValue(that.updatedPriceFrag);
                    MessageBox.error("Please enter only numbers for updated price");
                }
                else{
                    oEvent.getSource().setValue(getSelectedItemObj);                    
                }
            },
            onSubmitStockFrag:function(){
                debugger
                var getUpdatedPrice = sap.ui.getCore().byId("idUpdatedPrice").getValue();
                if(Number(getUpdatedPrice) === 0){
                    MessageBox.error("Please enter updated price");
                }
                else if(Number(that.updatedPriceFrag) === Number(getUpdatedPrice)){
                    MessageBox.error("Please enter the updated price different from old price");
                }
                else{
                    var getFragData = this.getView().getModel("editStockModel").getData();
                    var updatedPriceDetails = [
                        {
                            "DISTRIBUTOR_ID": getFragData.DISTRIBUTOR_ID,
                            "MATERIAL_GROUP": getFragData.MATERIAL_GROUP,
                            "MATERIAL_CODE": String(getFragData.MATERIAL_CODE),
                            "UPDATED_PRICE": getUpdatedPrice,
                            "STATUS": 4
                        }
                    ]
                    this.onSubmitStockData(updatedPriceDetails,"onFrag");
                }
            },
            onSubmitStockData:function(updatedPriceDetails,oAction){
                var sType,sMessage;
                var sKey = this.getView().byId("idIconTabBar").getSelectedKey();

                if(updatedPriceDetails.length === 0){
                    MessageBox.error("Please edit the updated price of material and submit");
                }
                else{
                    if(sKey === "Pending_Orders"){
                        sType = "PENDING";
                    }
                    else{
                        sType = "UPDATE"
                    }

                    if(updatedPriceDetails.length === 1 && (oAction === "onTable" || oAction === "onFrag")){
                        sMessage = "Do you agree with the updated price of Material ?"
                    }
                    else if(updatedPriceDetails.length > 1 && (oAction === "onTable" || oAction === "onFrag")){
                        sMessage = "Do you agree with the updated price of Materials ?";
                    }
                    else if((updatedPriceDetails.length === 1 || updatedPriceDetails.length > 1) && (oAction === "onUpload")){
                        sMessage = "Make sure to edit only the 'Updated price' field. All other fields should remain unchanged.";
                    }
                    // else if(updatedPriceDetails.length > 1 && && (oAction === "onUpload")){
                    //     sMessage = "Do you agree with the updated price of Materials ?";
                    // }

                    var oPayload =
                        
                    {
                        "appType": "RG",
                        "updPriceDetails": updatedPriceDetails,                        
                        "Event": 
                        {
                            "USER_ID": "darshan.l@intellectbizware.com",
                            "USER_ROLE": "CM"
                        }
                    }

                    var url = appModulePath + "/odata/v4/ideal-grn-acceptance/updateGrnPrice";
                    var data = JSON.stringify(oPayload);
                    // BusyIndicator.hide();
                    MessageBox.confirm(sMessage,{    
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            // initialFocus: sap.m.MessageBox.Action.CANCEL,
                            onClose: function (sAction) {
                                if (sAction === 'YES') {
                                    // BusyIndicator.show(0);
                                    if(oAction === "onFrag"){
                                        that.tabFieldsFrag.close();
                                    }
                                    // that.tabFieldsFrag.close();
                                    that.postAjaxs(url,"POST",data,"null",sType,sType);
                                } else{
                                    // Do something
                                }
        
                            }
                        });
                    }
            },
            // onLiveUpdPriceChange:function(oEvent){
            //     var getChangedVal = oEvent.getSource().getValue();
            //     if(isNaN(Number(getChangedVal)) || String(getChangedVal).includes("-")){
            //         oEvent.getSource().setValue(0);
            //         MessageBox.error("Please enter only numbers.");
            //     }
            // },
            onChangeUpdPrice:function(oEvent){
                var getTblData = this.getView().getModel("distributorData").getData();
                var getChangedValObj = oEvent.getSource().getBindingContext("distributorData").getObject();
                var getUnitPrice = Number(getChangedValObj.UNIT_PRICE);
                var getChangedVal = oEvent.getSource().getValue();
                // getChangedValObj.UPADATED_PRICE = getChangedVal;
                var getPath = Number(oEvent.getSource().getBindingContext("distributorData").getPath().split("/")[1]);

                if(Number(getChangedVal) === Number(getUnitPrice)){
                    oEvent.getSource().setValue("");
                    MessageBox.error("Please enter the updated price different from unit price");
                }
                else if(isNaN(Number(getChangedVal)) || String(getChangedVal).includes("-")){
                    oEvent.getSource().setValue("");
                    MessageBox.error("Please enter only numbers.");
                }

                var getMaterialArr = getTblData.filter(function (a,index) {
                    if((index == getPath) && Number(getChangedVal) === 0){
                        
                    }
                    else if((index == getPath) && Number(getChangedVal) > 0){
                        return a;                        
                    }
                    else if(Number(a["UPDATED_PRICE"]) == 0 || isNaN(a["UPDATED_PRICE"]) === true){

                    }     
                    else{
                        return a;
                    } 
                    
                }, Object.create(null));

                if(getMaterialArr.length > 0){
                    this.getView().byId("saveBt").setEnabled(true);
                }
                else{
                    this.getView().byId("saveBt").setEnabled(false);
                }
            },
            onDistributorDataFetch:function(){
                
                var sPayloadArr = []
                var sUpdatedFieldsArr = [];
                var getTableData = this.getView().getModel("distributorData").getData();

                if(getTableData !== null){
                    sUpdatedFieldsArr = getTableData.filter(function (a,index) {
                        if(a["UPDATED_PRICE"] === "NULL" || a["UPDATED_PRICE"] === undefined ||
                        Number(a["UPDATED_PRICE"]) === NaN || Number(a["UPDATED_PRICE"]) === 0 ||
                        a["UPDATED_PRICE"] === "NaN" || a["UPDATED_PRICE"] === null){

                        }      
                        else{
                            return a;
                        }                
                }, Object.create(null));

                    if(sUpdatedFieldsArr.length === 0){
                        MessageBox.error("Please update the price of any material then submit.");
                    }
                    else if(sUpdatedFieldsArr.length >0){
                        
                        for(var i=0;i<sUpdatedFieldsArr.length;i++){
                            var sUpdatedFieldsObj =
                            {
                                "DISTRIBUTOR_ID": sUpdatedFieldsArr[i].DISTRIBUTOR_ID,
                                "MATERIAL_GROUP": sUpdatedFieldsArr[i].MATERIAL_GROUP,
                                "MATERIAL_CODE": String(sUpdatedFieldsArr[i].MATERIAL_CODE),
                                "UPDATED_PRICE": sUpdatedFieldsArr[i].UPDATED_PRICE,
                                "STATUS": 3
                            }
                            sPayloadArr.push(sUpdatedFieldsObj)
                        }
                        this.onSubmitStockData(sPayloadArr,"onTable");
                    }
                }
            },
            onPress:function(oEvent){
                var sInvoiceValue = oEvent.getSource().getBindingContext("distributorData").getProperty("INVOICE_NO");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDetailpage", {
                    INVOICE_NO: sInvoiceValue
                });
            },
            onExport: function () {
			
                var aCols, oRowBinding, oSettings, oSheet, oTable;
                if (!this._oTable) {
                    this._oTable = this.byId('distributorTblData');
                }
    
                oTable = this._oTable;
                // context.formattingFinalApproval(oTable.getModel("onBoarding").getData());
    
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();
    
                oSettings = {
                    workbook: {
                        columns: aCols,
                        context: {
                            application: 'Distributor Stock Report',
                            version: '0.0.1',
                            sheetName: 'Stock report'
                        },
                        hierarchyLevel: 'level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Distributor Stock Data.xlsx',
                    worker: false
                };
    
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            createColumnConfig: function () {
                var aCols = [];

                aCols.push({
                    label: "Distributor ID",
                    type: EdmType.String,
                    property: 'DISTRIBUTOR_ID'
                });

                aCols.push({
                    label: "Material Group",
                    type: EdmType.String,
                    property: 'MATERIAL_GROUP'
                });
    
                aCols.push({
                    label: "Material Group Description",
                    type: EdmType.String,
                    property: 'MATERIAL_GROUP_DESC'
                });

                aCols.push({
                    label: "Material Code",
                    type: EdmType.String,
                    property: 'MATERIAL_CODE'
                });
    
                aCols.push({
                    label: "Material Description",
                    type: EdmType.String,
                    property: 'MATERIAL_DESC'
                });

                // aCols.push({
                //     label: "Stock",
                //     type: EdmType.String,
                //     property: 'MATERIAL_STOCK'
                // });
    
                aCols.push({
                    label: "Price",
                    type: EdmType.String,
                    property: 'UNIT_PRICE'
                });
    
                aCols.push({
                    label: "Updated Price",
                    type: EdmType.String,
                    property: 'UPDATED_PRICE'
                });
    
                return aCols;
            },
            onUpload: function (e) {
                // BusyIndicator.show(0);
                this._import(e.getParameter("files") && e.getParameter("files")[0]);
            },
            _import:function(file){
                var getTableData = that.getView().getModel("distributorData").getData();
                jQuery.sap.delayedCall(5000, this, function () {
                    that.arrayData = [];
                    var sUpdatedFieldsArr = [];
                    var sMaterialCodeCheck = [];
                    var sMaterialGrpCheck = [];
                    var sUpdatePriceCheck = [];
                    var sValidationCheck = [];
                    var excelData = {};
                    if (file && window.FileReader) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var data = e.target.result;
                            var workbook = XLSX.read(data, {
                                type: 'binary'
                            });
                            workbook.SheetNames.forEach(function (sheetName) {
                                // Here is your object for every sheet in workbook
                                excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                that.arrayData.push(excelData);							
                            });
    
                            if(that.arrayData[0].length > 0){
                                sUpdatedFieldsArr = that.arrayData[0].filter(function (a,index) {
                        
                                    if(a["UPDATED PRICE"] === "NULL" || a["UPDATED PRICE"] === undefined ||
                                    Number(a["UPDATED PRICE"]) === NaN || Number(a["UPDATED PRICE"]) === 0 || 
                                    a["UPDATED PRICE"] === "NaN" || a["UPDATED PRICE"] === null ||
                                    isNaN(Number(a["UPDATED PRICE"])) === true){

                                    }      
                                    else{
                                        return a;
                                    }          
                                }, Object.create(null));

                                if(sUpdatedFieldsArr.length > 0){
                                    sMaterialCodeCheck = sUpdatedFieldsArr.filter(function (a,index) {
                                        for(var i=0;i<getTableData.length;i++){
                                            if(a["MATERIAL CODE"] == getTableData[i].MATERIAL_CODE){
                                                return a;
                                            }   
                                        }             
                                    }, Object.create(null));
                                }
                                if(sUpdatedFieldsArr.length > 0){
                                    sMaterialGrpCheck = sUpdatedFieldsArr.filter(function (a,index) {
                                        for(var i=0;i<getTableData.length;i++){
                                            if(a["MATERIAL GROUP"] == getTableData[i].MATERIAL_GROUP){
                                                return a;
                                            }   
                                        }             
                                    }, Object.create(null));
                                }

                                if(sUpdatedFieldsArr.length > 0){
                                    sUpdatePriceCheck = sUpdatedFieldsArr.filter(function (a,index) {
                                        for(var i=0;i<getTableData.length;i++){
                                            if(a["MATERIAL GROUP"] == getTableData[i].MATERIAL_GROUP && 
                                            a["MATERIAL CODE"] == getTableData[i].MATERIAL_CODE &&
                                            Number(a["UPDATED PRICE"]) === Number(getTableData[i].UPDATED_PRICE)){
                                                return a;
                                            }   
                                        }             
                                    }, Object.create(null));
                                }
                                if(sUpdatedFieldsArr.length > 0){
                                    sValidationCheck = sUpdatedFieldsArr.filter(function (a,index) {
                                        if(a["UPDATED PRICE"].includes("-") === true) {
                                            return a;
                                        }           
                                    }, Object.create(null));
                                }

                                if(sUpdatedFieldsArr.length === 0){
                                    MessageBox.error("Please update the price of any material then submit.");
                                }
                                else if(that.arrayData[0].length > getTableData.length){
                                    MessageBox.error("Please check the uploaded items and the table items.");
                                }
                                else if(sUpdatedFieldsArr.length !== sMaterialCodeCheck.length){
                                    MessageBox.error("Uploaded material items does not match the material items in the table");
                                }
                                else if(sUpdatedFieldsArr.length !== sMaterialGrpCheck.length){
                                    MessageBox.error("Uploaded material group items does not match the material group items in the table");
                                }
                                else if(sUpdatePriceCheck.length > 0 && that.arrayData[0].length === sUpdatePriceCheck.length){
                                    MessageBox.error("Please make sure that the old price and updated price are not the same")
                                }
                                else if(sValidationCheck.length > 0){
                                    MessageBox.error("Please make sure that all the fields are valid.")
                                }
                                else if(sUpdatedFieldsArr.length >0){
                                    var sPayloadArr = [];
                                    for(var i=0;i<sUpdatedFieldsArr.length;i++){
                                        var sUpdatedFieldsObj =
                                        {
                                            "DISTRIBUTOR_ID": sUpdatedFieldsArr[i]["DISTRIBUTOR ID"],
                                            "MATERIAL_GROUP": sUpdatedFieldsArr[i]["MATERIAL GROUP"],
                                            "MATERIAL_CODE": String(sUpdatedFieldsArr[i]["MATERIAL CODE"]),
                                            "UPDATED_PRICE": sUpdatedFieldsArr[i]["UPDATED PRICE"],
                                            "STATUS": 3
                                        }
                                        sPayloadArr.push(sUpdatedFieldsObj)
                                    }
                                    that.onSubmitStockData(sPayloadArr,"onUpload");
                                }

                                // var checkStockVal = validation.checkExcelData(that.arrayData[0],[]);

                                // if(checkStockVal.length >0){
                                //     that.validateForm(checkStockVal);
                                // }
                            }
                        };
                        reader.onerror = function (ex) {
                            // sap.ui.core.BusyIndicator.hide();
                            console.log(ex);
                        };
                        reader.readAsBinaryString(file);
                        // sap.ui.core.BusyIndicator.hide();
                    }
                });
            },
            validateForm: function (checkFields) {
                if(this.oMP || checkFields.length === 0){
                    this.oMP.close();
                }

                if (checkFields.length > 0) {
                    var checkFieldsJson = new JSONModel();
                    checkFieldsJson.setData(checkFields);
                    oView.setModel(checkFieldsJson, "checkFieldsJson");
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
            createMessagePopover: function () {
			                                        
                this.oMP = new MessagePopover({
                    activeTitlePress: function (oEvent) {
                        var oItem = oEvent.getParameter("item").getProperty("key");
                        // that.getView().byId("iconTabBar").setSelectedKey(oItem);
                    },
                    items: {
                        path: "message>/",
                        template: new MessageItem({
                            title: "{message>desc}",
                            activeTitle: true,
                            subtitle: "{message>BUSINESS}",
                            type: "{message>type}",
                            key: "{message>key}"
                        })
                    },
                    groupItems: true
                });
                this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
            },
            handleMessagePopoverPress: function (oEvent) {
                if (!this.oMP) {
                    this.createMessagePopover();
                }
                this.oMP.toggle(oEvent.getSource());
            },
    
        });
    });

