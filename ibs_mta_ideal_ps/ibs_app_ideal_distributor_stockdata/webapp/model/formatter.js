sap.ui.define([], function () {
    "use strict";
    return {

        getCurrencyVal: function (sValue) {
            if(sValue === null || sValue === "" || sValue === undefined){
                return "NA";
            }
            else{
                return sValue;
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
        getStatusDesc:function(sValue){
            if (sValue == 3) {
                return "Pending";
            } else if (sValue == 4) {
                return "Updated";
            }
        },
        getStatus:function(sValue){
            if (sValue == 3) {
                return "Indication01";
            } else if (sValue == 4) {
                return "Indication04";
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
})