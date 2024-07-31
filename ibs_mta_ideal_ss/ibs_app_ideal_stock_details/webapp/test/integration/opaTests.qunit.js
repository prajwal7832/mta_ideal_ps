sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ibs/ibsappidealstockdetails/test/integration/FirstJourney',
		'com/ibs/ibsappidealstockdetails/test/integration/pages/Grn_HeaderList',
		'com/ibs/ibsappidealstockdetails/test/integration/pages/Grn_HeaderObjectPage'
    ],
    function(JourneyRunner, opaJourney, Grn_HeaderList, Grn_HeaderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ibs/ibsappidealstockdetails') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheGrn_HeaderList: Grn_HeaderList,
					onTheGrn_HeaderObjectPage: Grn_HeaderObjectPage
                }
            },
            opaJourney.run
        );
    }
);