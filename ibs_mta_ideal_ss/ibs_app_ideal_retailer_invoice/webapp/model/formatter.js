sap.ui.define([], function () {
    "use strict";
    return {

        getDataNullValue: function (sValue,sType) {
            if ((sValue === null || sValue === '' || sValue === undefined)) {
                return "NA";
            }
             else {
                return sValue;
            }
        }  
}
})