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
    this.genre = "";
    this.genreArray = $localStorage.genreArray;

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });

    this.tester = function () {
      console.log(this.genre, this.players, this.duration);
    };
  }
})();
