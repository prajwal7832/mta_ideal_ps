sap.ui.define([
], function(MessageToast) {
    'use strict';

    return {
        onPress: function(oEvent) {
            // MessageToast.show("Custom handler invoked.");
            var number=Number(oEvent.replace(/,/g, ''));
            return number;
        }
    };
});
