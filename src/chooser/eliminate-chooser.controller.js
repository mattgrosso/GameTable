/**
 * This is the controller for the elimination method of choosing.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('EliminateChooserController', EliminateChooserController);

  EliminateChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function EliminateChooserController($stateParams, $localStorage, GameFactory) {

    $(window).scrollTop();

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.downToOne = false;

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
     * This function is called when a user eliminates a game from the list.
     * It sets the eliminated property of the game to true and then refilters
     * the current list of games to take out any that have been eliminated.
     * Finally, it checks to see if the list of games has been reduced to one
     * and, if so, it displays the winning game.
     * @param  {Object} game Game object that was selected.
     */
    this.eliminateGame = function eliminateGame(game) {
      game.eliminated = true;
      console.log(game.eliminated);
      this.collection = this.collection.filter(function (game) {
        if(game.eliminated){
          return false;
        } else{
          return true;
        }
      });
      console.log(this.collection.length);
      if(this.collection.length === 1){
        this.downToOne = true;
      }
    };

  }


})();
