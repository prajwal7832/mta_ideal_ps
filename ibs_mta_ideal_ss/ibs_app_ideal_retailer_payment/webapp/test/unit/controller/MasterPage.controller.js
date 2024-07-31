/*global QUnit*/

sap.ui.define([
	"comibs/ibs_app_ideal_retailer_payment/controller/MasterPage.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MasterPage Controller");

	QUnit.test("I should test the MasterPage controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
