(function() {
  'use strict';

  angular
    .module('game')
    .controller('RandomChooserController', RandomChooserController);

  RandomChooserController.$inject = ['$stateParams'];

  function RandomChooserController($stateParams) {

    this.collection = $stateParams.filteredCollection;
    this.randomGame = null;

    this.chooseRandomGame = function chooseRandomGame() {
      var randomNumber = Math.floor(Math.random() * this.collection.length);
      this.randomGame = this.collection[randomNumber];
    };
  }

})();
