jQuery.sap.declare("com.ibs.ibsappidealretailerpayment.model.formatter");

com.ibs.ibsappidealretailerpayment.model.formatter = {
	getStatus: function (sValue) {
        if(sValue == "1"){
            return "Created";
        }
        else if(sValue == "2"){
            return "Completed";
        }
    },
    getStatusDesc:function(sValue){
        if(sValue == "1"){
            return "Indication07";
        }
        else if(sValue == "2"){
            return "Indication08";
        }
    },
    getDataNullValue: function (sValue) {
        if ((sValue === null || sValue === '' || sValue === undefined)) {
            return "NA";
        }
         else {
            return sValue;
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
            return oNumberFormat.format(num);
        }
        // num = parseInt(num,10).toFixed(2);
        // return String(num);

    }
}