(function(){
	'use strict';

	angular
		.module('app.suggestions')
		.controller('SuggestionsController', SuggestionsController);

	function SuggestionsController($uibModal, $state, $stateParams, user, ConfirmDialog, SuggestionsResource, configs) {

		this.currentUser = user;
		this.itemsPerPage = 50;
		this.forumId = configs.SUGGESTIONS_FORUM_ID;
		this.currentView = $stateParams.view;

		this.voteOptions = {
			0: '---',
			1: 'Färdigt',
			2: 'Godkänt',
			3: 'Nekat',
			4: 'Ingen åtgärd'
		};

		this.getSuggestions = function () {
			this.suggestions = null;

			SuggestionsResource.Suggest.query({
				'limit': this.itemsPerPage,
				'view': this.currentView,
			}, (data) => {
				this.suggestions = data;
			});
		};

		this.switchView = function (viewName) {
			this.currentView = viewName;
			this.getSuggestions();
			$state.go($state.current.name, {view: this.currentView}, {notify: false});
		};

		this.voteUp = function (suggest) {
			SuggestionsResource.Votes.save({
				id: suggest.id,
				direction: 'up'
			}, function (data) {
				suggest.votes = data.numVotes;
			});
		};

		this.voteDown = function (suggest) {
			SuggestionsResource.Votes.save({
				id: suggest.id,
				direction: 'down'
			}, (data) => {
				suggest.votes = data.numVotes;
			});
		};

		this.delete = function (suggestion) {
			ConfirmDialog('Radera förslag', 'Vill du radera förslaget? (Forumtråden kvarstår)')
				.then(() => {
					return SuggestionsResource.Suggest.delete({ id: suggestion.id }).$promise;
				})
				.then(() => {
					var index = this.suggestions.indexOf(suggestion);
					this.suggestions.splice(index, 1);
				});
		};

		this.createSuggestion = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: '../app/suggestions/create-suggestion-dialog.template.html',
				controller: 'CreateSuggestionController',
				controllerAs: 'vm',
				size: 'md',
				backdrop: 'static',
			});

			modalInstance.result
				.then((topic) => {
					$state.go('forum.topic', {forumid: this.forumId, id: topic.id, slug: topic.slug});
				});
		};

		this.updateStatus = function (suggest) {
			SuggestionsResource.Suggest.update(suggest);
		};

		this.convertToInt = function(id){
			return parseInt(id, 10);
		};

		this.getSuggestions();
	}

})();
