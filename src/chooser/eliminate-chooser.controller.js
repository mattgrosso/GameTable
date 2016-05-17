(function() {
  'use strict';

  angular
    .module('game')
    .controller('EliminateChooserController', EliminateChooserController);

  EliminateChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function EliminateChooserController($stateParams, $localStorage, GameFactory) {

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.downToOne = false;

    if (!this.collection || !this.collection.length) {
      GameFactory.getUserCollection()
        .then(function () {
          that.collection = $localStorage.collection;
        });
    }

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
