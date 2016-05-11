(function() {
  'use strict';

  angular
    .module('game')
    .controller('ChooserController', ChooserController);

  ChooserController.$inject = ['GameFactory'];

  function ChooserController(GameFactory) {
    var that = this;
    this.collection = [];
    this.players = "";
    this.duration = "";
    this.genre = "";

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });
  }
})();
