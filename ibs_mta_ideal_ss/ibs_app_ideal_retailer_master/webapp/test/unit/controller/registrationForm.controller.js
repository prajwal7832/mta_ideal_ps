/*global QUnit*/

sap.ui.define([
	"comibs/ibs_app_ideal_retailer_master/controller/registrationForm.controller"
], function (Controller) {
	"use strict";

	QUnit.module("registrationForm Controller");

	QUnit.test("I should test the registrationForm controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
