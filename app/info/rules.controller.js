(function(){
	'use strict';

	angular
		.module('app.shared')
		.controller('RulesController', RulesController);

	function RulesController(RulesResource, $uibModal, ConfirmDialog, user) {

		this.currentUser = user;

		RulesResource.query({}, (data) => {
			this.rules = data;
		});

		this.delete = function (rule) {
			var dialog = ConfirmDialog('Radera regel', 'Vill du radera den valda regeln?');

			dialog
				.then(() => {
					return RulesResource.delete(rule).$promise;
				})
				.then(() => {
					var index = this.rules.indexOf(rule);
					this.rules.splice(index, 1);
				});
		};

		this.edit = function (rule) {
			var modal = $uibModal.open({
				animation: true,
				templateUrl: '../app/info/rules-admin-dialog.template.html',
				controller: 'RulesAdminDialogController',
				controllerAs: 'vm',
				backdrop: 'static',
				size: 'lg',
				resolve: {
					rule: () => rule
				}
			});
			modal.result
				.then((rule) => {
					RulesResource.update(rule);
				});
		};

		this.create = function () {
			var modal = $uibModal.open({
				animation: true,
				templateUrl: '../app/info/rules-admin-dialog.template.html',
				controller: 'RulesAdminDialogController',
				controllerAs: 'vm',
				backdrop: 'static',
				size: 'lg',
				resolve: {
					rule: () => {
						return {
							flag: 1,
							type: 'categ',
							categ: 0,
							order: 0,
							question: '',
							answer: ''
						};
					}
				}
			});
			modal.result
				.then((rule) => {
					RulesResource.save(rule);
					this.rules.push(rule);
				});
		};

	}

})();
