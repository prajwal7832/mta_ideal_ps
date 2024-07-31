sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ibs/ibsappidealrequestreportfiori/test/integration/FirstJourney',
		'com/ibs/ibsappidealrequestreportfiori/test/integration/pages/MasterClientInfoList',
		'com/ibs/ibsappidealrequestreportfiori/test/integration/pages/MasterClientInfoObjectPage'
    ],
    function(JourneyRunner, opaJourney, MasterClientInfoList, MasterClientInfoObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ibs/ibsappidealrequestreportfiori') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheMasterClientInfoList: MasterClientInfoList,
					onTheMasterClientInfoObjectPage: MasterClientInfoObjectPage
                }
            },
            opaJourney.run
        );
    }
);