jQuery.sap.declare("com.ibspl.ideal.idealordercreation.model.formatter");

com.ibspl.ideal.idealordercreation.model.formatter = {
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
    getDataNullValue: function (sValue,sType) {
        if ((sValue === null || sValue === '' || sValue === undefined) && sType !== "EMAIL_CHECK") {
            return "NA";
        }
         else {
            return sValue;
        }
    },
    getAmount:function(sValue){
        if(Number(sValue) == 0 || sValue === null || sValue === undefined){
            return 0;
        }
        else{
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