sap.ui.define([], function () {
	"use strict";
	return {
		checkExcelData: function (sObj,array_s1) {
            for(var i=0;i<sObj.length;i++){
                debugger;
                if(sObj[i].sObj[i]["UPDATED PRICE"] === NULL){
                    array_s1.push({
                        "section": 1,
                        "description": "Please enter updated price for material " + sObj[i]["MATERIAL"],
                        "subtitle": "Mandatory Field",
                        "type": "Warning",
                        "key":"updatedPrice"
                    });
                }
            }
            return array_s1;
        }
    }
})