sap.ui.define([], function () {
	"use strict";
	return {
		orderCreationTblVal: function (sObj,array_s1) {
            for(var i=0;i<sObj.length;i++){
                if(Number(sObj[i].AcceptQty) === 0){
                    array_s1.push({
                        "section": 1,
                        "description": "Please enter accept quantity " + sObj[i].MaterialDesc +".",
                        "subtitle": "Mandatory Field",
                        "type": "Warning",
                        "key":"orderCreation"
                    });
                }
            }
            return array_s1;
        }
    }
})