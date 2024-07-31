sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.ibs.ibsappidealstockdetails',
            componentId: 'Grn_HeaderObjectPage',
            contextPath: '/Grn_Header'
        },
        CustomPageDefinitions
    );
});