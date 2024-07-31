jQuery.sap.declare("com.ibs.ibsappidealorderdispatch.model.formatter");

com.ibs.ibsappidealorderdispatch.model.formatter = {
	
    getDataNullValue: function (sValue) {
        if ((sValue === null || sValue === '' || sValue === undefined)) {
            return "NA";
        }
         else {
            return sValue;
        }
    },
	formatDate: function (oDate) {
    if (oDate === "" || oDate === null || oDate === undefined) {
        return "NA"
    } else if (oDate !== "" && oDate !== null && oDate !== undefined) {
        // if (oDate.split === undefined) {
            var DateInstance = new Date(oDate);
            var date = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy"
            });
            return date.format(DateInstance);
        }
    },
    getStatus:function(sValue){
        if (sValue == 1) {
			return "Indication05";
		}
        else if(sValue == 3){
            return "Indication03";
        }
        else if(sValue == 4){
            return "Indication01";
        }
        else{
            "None";
        }
    },
    setEditQtyEnabled:function(sValue){
        if(Number(sValue) > 0){
            return true;
        }
        else{
            return false;
        }
    },
    formatterAmount: function (num) {
        if(num === null || num === "" || num === undefined || isNaN(num)){
            return "NA";
        }
        else{
            var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                pattern: "#,##,##0.00"
            });
            return "₹ "+ oNumberFormat.format(num);
        }
        // num = parseInt(num,10).toFixed(2);
        // return String(num);

    }
}