(function() {
  'use strict';

  angular
    .module('game')
    .controller('BracketChooserController', BracketChooserController);

  BracketChooserController.$input = ['$stateParams'];

  function BracketChooserController($stateParams) {

    this.collection = $stateParams.filteredCollection;
    this.arrayToBeRandomized = this.collection;
    this.entrantArray = [];
    this.winnersArray = [];
    this.numberOfEntrants = this.seededCollection.length;
    this.currentSeedMatchup = 0;
    this.firstContender = null;
    this.secondContender = null;
    this.showStart = true;
    this.showMatchUp = false;

    this.startTournament = function startTournament() {
      if(this.arrayToBeRandomized.length > 0){
        var randomIndex = Math.floor((Math.random() * this.arrayToBeRandomized.length));
        this.entrantArray.push(this.arrayToBeRandomized[randomIndex]);
        this.arrayToBeRandomized.splice(randomIndex, 1);
        this.startTournament();
      } else {
        this.nextMatchup();
      }
    };

    this.nextMatchup = function nextMatchup() {
      if((this.entrantArray.length % 2) > 0){
        var randomIndex = Math.floor((Math.random() * this.entrantArray.length));
        this.winnersArray.push(this.entrantArray[randomIndex]);
        this.entrantArray.splice(randomIndex, 1);
      }
      this.firstContender = this.entrantArray[this.currentSeedMatchup];
      this.secondContender = this.entrantArray[this.currentSeedMatchup + 1];
      this.currentSeedMatchup = this.currentSeedMatchup + 2;

      this.showStart = false;
      this.showMatchUp = true;
    };

    this.pickWinner = function pickWinner(number) {
      if(number === 1){
        this.winnersArray.push(this.firstContender);
      }
      else if(number === 2){
        this.winnersArray.push(this.secondContender);
      }
    };
  }

})();
