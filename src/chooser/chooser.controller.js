(function() {
  'use strict';

  angular
    .module('game')
    .controller('ChooserController', ChooserController);

  ChooserController.$inject = ['GameFactory', '$localStorage', '$state'];

  function ChooserController(GameFactory, $localStorage) {
    var that = this;

    this.collection = [];
    this.players = "";
    this.duration = "";
    this.genre = "";
    this.genreArray = $localStorage.genreArray;
    this.chooser = "";
    this.chooserArray = ['random'];

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });

    this.goToChooser = function () {
      // $state.go('random');
    };
  }
})();
