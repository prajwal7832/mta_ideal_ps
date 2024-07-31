sap.ui.define([], function () {
	"use strict";
	return {
        _numberValidation: function (oEvent,sEvents) {
            var oSource = oEvent.getSource();
            var reg = /^[0-9]+$/.test(oSource.getValue());
            if(reg === false) {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please Enter only numbers");
			}
            else{
                oSource.setValueState(sap.ui.core.ValueState.None);
            }
            return reg;
        },
        SpecialCharVal: function (oEvent,sEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[A-Za-z0-9? ,_-]+$/.test(oSource.getValue());
			if(sEvent === "EwayBill"){
				if(reg === false){
					oEvent.getSource().setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
				}
				else if(String(oSource.getValue()).length > 12 || String(oSource.getValue()).length < 12){
					oEvent.getSource().setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("length of E Way Bill no should be 12");
				}
				else {
					oSource.setValueState(sap.ui.core.ValueState.None);
				}
			}
			else{
				if (reg === true) {
					if(sEvent === "vehicleNoVal"){
						oSource.setValue(String(oSource.getValue()).toUpperCase());
					}
					oSource.setValueState(sap.ui.core.ValueState.None);
				} else {
					oEvent.getSource().setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
				}
			}
			return reg;
		},
		_dispatchQtyVal:function(oEvent){
			var oSource = oEvent.getSource();
            var reg = /^[0-9]+$/.test(oSource.getValue());
            if(reg === false) {
				if(Number(oSource.getValue()) === 0){
					oSource.setValue(Number(oSource.getValue()));
					oSource.setValueState(sap.ui.core.ValueState.None);
				}
				else{
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please Enter only numbers");
				}
			}
            else{
				oSource.setValue(Number(oSource.getValue()));
                oSource.setValueState(sap.ui.core.ValueState.None);
            }
            return reg;
		}
}
})