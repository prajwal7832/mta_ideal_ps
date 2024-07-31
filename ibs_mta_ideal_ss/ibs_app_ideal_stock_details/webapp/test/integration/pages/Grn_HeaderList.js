sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.ibs.ibsappidealstockdetails',
            componentId: 'Grn_HeaderList',
            contextPath: '/Grn_Header'
        },
        CustomPageDefinitions
    );
});