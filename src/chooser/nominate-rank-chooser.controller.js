(function() {
  'use strict';

  angular
    .module('game')
    .controller('NomRankChooserController', NomRankChooserController);

  NomRankChooserController.$inject = ['$stateParams', '$state'];

  function NomRankChooserController($stateParams, $state) {

    this.collection = $stateParams.filteredCollection;
    this.nomineesArray = [];
    this.currentValueOfVotes = 0;

    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          return true;
        } else{
          return false;
        }
      });
    };

    this.goToValue1 = function goToValue1() {
      this.currentValueOfVotes++;
      $state.go('nominate-rank.value1');
    };

    this.addValue = function addValue(game) {
      game.value = game.value + this.currentValueOfVotes;
    };

  }

})();
