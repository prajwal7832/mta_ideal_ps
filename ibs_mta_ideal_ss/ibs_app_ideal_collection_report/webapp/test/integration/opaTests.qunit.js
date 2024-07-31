sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ibs/ibsappidealcollectionreport/test/integration/FirstJourney',
		'com/ibs/ibsappidealcollectionreport/test/integration/pages/RetailerPaymentsList',
		'com/ibs/ibsappidealcollectionreport/test/integration/pages/RetailerPaymentsObjectPage'
    ],
    function(JourneyRunner, opaJourney, RetailerPaymentsList, RetailerPaymentsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ibs/ibsappidealcollectionreport') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheRetailerPaymentsList: RetailerPaymentsList,
					onTheRetailerPaymentsObjectPage: RetailerPaymentsObjectPage
                }
            },
            opaJourney.run
        );
    }
);