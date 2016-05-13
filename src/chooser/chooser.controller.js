(function() {
  'use strict';

  angular
    .module('game')
    .controller('ChooserController', ChooserController);

  ChooserController.$inject = ['GameFactory', '$localStorage', '$state'];

  function ChooserController(GameFactory, $localStorage, $state) {
    var that = this;

    this.collection = [];
    this.players = "";
    this.duration = "";
    this.genre = "";
    this.genreArray = $localStorage.genreArray;
    this.chooser = "";
    this.addGameTitle = "";
    this.chooserArray = ['random', 'nominate-random', 'eliminate', 'vote', 'nominate-rank', 'bracket'];

    this.showFilters = true;
    this.showAddGame = false;

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });

    this.goToChooser = function (filtered) {
      $state.go(this.chooser, {filteredCollection: filtered});
    };

    this.showAddGameForm = function showAddGameForm() {
      this.showAddGame = true;
    };

    this.findGameToAdd = function findGameToAdd(title) {
      GameFactory.getSingleGame(title).then(function (response) {
        console.log(response.data);
      });
    };
  }
})();
