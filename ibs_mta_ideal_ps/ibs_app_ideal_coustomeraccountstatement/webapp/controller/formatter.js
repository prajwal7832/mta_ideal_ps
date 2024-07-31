jQuery.sap.declare("com.ibs.ibsappidealcoustomeraccountstatement.controller.formatter");

com.ibs.ibsappidealcoustomeraccountstatement.controller.formatter = {
	formatDate: function (oDate) {
		if (oDate !== "" && oDate !== null && oDate !== undefined) {
			var year = oDate.substring(0, 4);
			var mm = oDate.substring(4, 6);
			var day = oDate.substring(6, 8);
			var date = day + "." + mm + "." + year;
			if (day === "00") {
				return "";
			} else { return date; }
		} else { return ""; }
	},
	LinkVisible: function (oValue) {
		if (oValue == "X") { return true; }
		return false;
	},
	TextVisible: function (oValue) {
		if (oValue == "X") { return false; }
		return true;
	},
	openFlag: function(oVal1,oVal2){
		// var patt = new RegExp("-");
		// var str = patt.test(oVal1);
		// if(!str && oVal2=='X'){return 'DR';}  //str
		// if(str && oVal2=='X'){return 'CR';}   //!str
		// if(str && !oVal2){return 'DR';}
		// else return oVal1;
		if(oVal2=='X'){return 'DR';}
		if(!oVal2){return 'CR';}
		else return oVal1;
	},
	salesFlag:  function(oVal){
		var intVal = parseInt(oVal);
		var patt = new RegExp("-");
		var str = patt.test(oVal);
		if(str && intVal){return oVal+' DR';}
		if(!str && intVal){return oVal+' CR';}
		else return oVal;
	},
	collectionFlag: function(oVal1,oVal2){
		var str = parseInt(oVal1);
		if(str && oVal2=='X'){return 'DR';}
		if(str && !oVal2){return 'CR';}
		else return '';
	},
	debitNote: function(oVal){
		var str = parseInt(oVal);
		if(str){return oVal+' DR';}
		else return oVal;  //'0.00'
	},
	creditNote: function(oVal){
		var str = parseInt(oVal);
		if(str){return oVal+' CR';}
		else return oVal; //'0.00' 
	},
	closeFlag: function(oVal1,oVal2){
	
		if(oVal2=='X'){return 'DR';}
		if(!oVal2){return 'CR';}
		else return ''; //oVal1
	},
	checkFlag: function(oVal1,oVal2){
		var patt = new RegExp("-");
		var str = patt.test(oVal1);
		if(!str && oVal2=='X'){return 'DR';}
		if(str && oVal2=='X'){return 'CR';}
		if(str && !oVal2){return 'DR';}
		else return '';
	}
};