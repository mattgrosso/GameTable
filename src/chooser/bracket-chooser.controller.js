(function() {
  'use strict';

  angular
    .module('game')
    .controller('BracketChooserController', BracketChooserController);

  BracketChooserController.$input = ['$stateParams'];

  function BracketChooserController($stateParams) {

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.arrayToBeRandomized = this.collection;
    this.randomizedArray = [];
    this.winnersArray = [];
    this.numberOfEntrants = this.seededCollection.length;
    this.currentSeedMatchup = 0;
    this.firstContender = null;
    this.secondContender = null;
    this.showStart = true;
    this.showMatchUp = false;

    this.startTournament = function startTournament() {
      if(this.arrayToBeRandomized.length > 0){
        var randomIndex = Math.floor((Math.random() * that.arrayToBeRandomized.length));
        that.randomizedArray.push(that.arrayToBeRandomized[randomIndex]);
        that.arrayToBeRandomized.splice(randomIndex, 1);
        that.startTournament();
      } else {
        that.nextMatchup();
      }
    };

    this.nextMatchup = function nextMatchup() {
      this.firstContender = this.seededCollection[this.currentSeedMatchup];
      this.secondContender = this.seededCollection[(this.numberOfEntrants - this.currentSeedMatchup) - 1];
      console.log('firstContender: ', this.firstContender);
      console.log('secondContender: ', this.secondContender);
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
