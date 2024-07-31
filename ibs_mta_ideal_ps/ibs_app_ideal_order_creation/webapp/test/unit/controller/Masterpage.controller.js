/*global QUnit*/

sap.ui.define([
	"comibs/ibs_app_ideal_order_creation/controller/Masterpage.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Masterpage Controller");

	QUnit.test("I should test the Masterpage controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
