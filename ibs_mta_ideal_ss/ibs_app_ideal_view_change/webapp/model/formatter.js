jQuery.sap.declare("com.ibs.ibsappidealviewchange.model.formatter");

com.ibs.ibsappidealviewchange.model.formatter = {
getDataNullValue: function (sValue,sType) {
    if ((sValue === null || sValue === '' || sValue === undefined) && sType !== "EMAIL_CHECK") {
        return "NA";
    }
    // else if(sType === "EMAIL_CHECK" && sValue !== null){
    //     if(sValue !== undefined){
    //     return sValue.toLowerCase();
    //     }
    //     else{
    //         return "NA";
    //     }
    // }
     else {
        return sValue;
    }
},
formatterAmount: function (num) {
    if(num === null || num === "" || num === undefined){
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

},
getPrimaryMobile:function(sValue2,sValue){
    if(sValue === null || sValue === undefined || sValue === ""){
        return "NA";
    }
    else{
        var result1 = sValue.filter(function (a) {
            if(a.ADDRESS_TYPE === "BL_ADDR"){
                return a;
            }
        }, Object.create(null));

        if(result1.length >0 && result1[0].MOBILE_NO !== null){
            return result1[0].MOBILE_NO;
        }
        else{
            return "NA";
        }
    }
},
getPrimaryEmail:function(sValue2,sValue){
    if(sValue === null || sValue === undefined || sValue === ""){
        return "NA";
    }
    else{
        var result1 = sValue.filter(function (a) {
            if(a.ADDRESS_TYPE === "BL_ADDR"){
                return a;
            }
        }, Object.create(null));

        if(result1.length >0 && result1[0].EMAIL_ID !== null){
            return result1[0].EMAIL_ID.toLowerCase();
        }
        else{
            return "NA";
        }
    }
},
getPrimaryCountry:function(sValue2,sValue){
    if(sValue === null || sValue === undefined || sValue === ""){
        return "NA";
    }
    else{
        var result1 = sValue.filter(function (a) {
            if(a.ADDRESS_TYPE === "BL_ADDR"){
                return a;
            }
        }, Object.create(null));

        if(result1.length >0 && result1[0].TO_COUNTRY !== null){
            return result1[0].TO_COUNTRY.LANDX;
        }
        else{
            return "NA";
        }
    }
},
getPrimaryCity:function(sValue2,sValue){
    if(sValue === null || sValue === undefined || sValue === ""){
        return "NA";
    }
    else{
        var result1 = sValue.filter(function (a) {
            if(a.ADDRESS_TYPE === "BL_ADDR"){
                return a;
            }
        }, Object.create(null));

        if(result1.length > 0 && result1[0].TO_CITY !== null){
            return result1[0].TO_CITY.CITY_DESC;
        }
        else{
            return "NA";
        }
    }
}
}