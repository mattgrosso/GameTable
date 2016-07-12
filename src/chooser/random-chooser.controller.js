/**
 * This is the controller for the random chooser.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('RandomChooserController', RandomChooserController);

  RandomChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function RandomChooserController($stateParams, $localStorage, GameFactory) {
    $(window).scrollTop();

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.randomGame = null;

    /**
     * If the user navigated directly to this page this if statement sets the list
     * of games to be the entire collection from localStorage.
     */
    if (!this.collection || !this.collection.length) {
      GameFactory.getUserCollection()
        .then(function () {
          that.collection = $localStorage.collection;
        });
    }

    /**
     * This function is called when the user clicks on the 'choose random game'
     * button.
     * It selects a random game from the list and displays it.
     */
    this.chooseRandomGame = function chooseRandomGame() {
      var randomNumber = Math.floor(Math.random() * this.collection.length);
      this.randomGame = this.collection[randomNumber];
    };
  }

})();
