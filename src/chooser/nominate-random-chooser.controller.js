(function() {
  'use strict';

  angular
    .module('game')
    .controller('NomRandChooserController', NomRandChooserController);

  NomRandChooserController.$inject = ['$stateParams'];

  function NomRandChooserController($stateParams) {
    this.collection = $stateParams.filteredCollection;
    this.nomineesArray = [];
    this.randomGame = null;

    console.log(this.collection);

    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          return true;
        } else{
          return false;
        }
      });
    };

    this.doneNominating = function doneNominating() {
      console.log(this.collection);
      var randomNumber = Math.floor(Math.random() * this.nomineesArray.length);
      this.randomGame = this.nomineesArray[randomNumber];
    };
  }

})();
