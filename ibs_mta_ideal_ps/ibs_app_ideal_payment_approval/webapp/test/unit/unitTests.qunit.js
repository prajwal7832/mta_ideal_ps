/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comibs/ibs_app_ideal_payment_approval/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
