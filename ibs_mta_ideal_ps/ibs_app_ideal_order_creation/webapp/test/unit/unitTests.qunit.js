/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comibs/ibs_app_ideal_order_creation/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
