(function() {
  'use strict';

  angular
    .module('game')
    .controller('ChooserController', ChooserController);

  ChooserController.$inject = ['GameFactory', '$localStorage'];

  function ChooserController(GameFactory, $localStorage) {
    var that = this;

    this.collection = [];
    this.players = "";
    this.duration = "";
    this.genreArray = $localStorage.genreArray;

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });
  }
})();
