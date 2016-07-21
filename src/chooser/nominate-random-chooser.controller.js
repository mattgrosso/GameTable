/**
 * This is the controller for the Nomrand chooser.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('NomRandChooserController', NomRandChooserController);

  NomRandChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function NomRandChooserController($stateParams, $localStorage, GameFactory) {

    $(window).scrollTop();

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.nomineesArray = [];
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
     * This function is called when the user clicks on a nominate button.
     * It sets the nomineesArray to a filtered set of the collection that only
     * includes games that have the property 'nominated'.
     */
    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          return true;
        } else{
          return false;
        }
      });
    };

    /**
     * This function is called when a user clicks on the 'done nominating'
     * button.
     * It chooses a random game from the array of nominees and displays it.
     */
    this.doneNominating = function doneNominating() {
      console.log(this.collection);
      var randomNumber = Math.floor(Math.random() * this.nomineesArray.length);
      this.randomGame = this.nomineesArray[randomNumber];
    };
  }

})();
