(function() {
  'use strict';

  angular
    .module('game')
    .controller('BracketChooserController', BracketChooserController);

  BracketChooserController.$input = ['$stateParams', '$localStorage', 'GameFactory'];

  function BracketChooserController($stateParams, $localStorage, GameFactory) {

    var that = this;

    this.arrayToBeRandomized = $stateParams.filteredCollection;
    this.entrantArray = [];
    this.winnersArray = [];
    this.numberOfRounds = null;
    this.currentRound = null;
    this.firstContender = null;
    this.secondContender = null;

    this.showStart = true;
    this.showMatchUp = false;
    this.showWinner = false;
    this.showRoundCounter = false;

    if (!this.arrayToBeRandomized || !this.arrayToBeRandomized.length) {
      GameFactory.getUserCollection()
        .then(function () {
          that.arrayToBeRandomized = $localStorage.collection;
        });
    }

    this.startTournament = function startTournament() {
      if(this.arrayToBeRandomized.length > 0){
        var randomIndex = Math.floor((Math.random() * this.arrayToBeRandomized.length));
        this.entrantArray.push(this.arrayToBeRandomized[randomIndex]);
        this.arrayToBeRandomized.splice(randomIndex, 1);
        this.startTournament();
      } else {
        this.countRounds(this.entrantArray.length);
        this.currentRound = 1;
        this.showRoundCounter = true;
        this.nextMatchup();
      }
    };

    this.nextMatchup = function nextMatchup() {
      if(this.entrantArray.length === 0) {
        this.entrantArray = this.winnersArray;
        this.winnersArray = [];
        this.currentRound++;
      }
      if(this.entrantArray.length === 1){
        this.winner = this.entrantArray[0];
        this.showMatchUp = false;
        this.showStart = false;
        this.showRoundCounter = false;
        this.showWinner = true;
        return;
      }
      if((this.entrantArray.length % 2) > 0){
        var randomIndex = Math.floor((Math.random() * this.entrantArray.length));
        this.winnersArray.push(this.entrantArray[randomIndex]);
        this.entrantArray.splice(randomIndex, 1);
      }
      this.firstContender = this.entrantArray[0];
      this.secondContender = this.entrantArray[1];
      console.log(this.entrantArray);
      console.log(this.firstContender);

      this.showStart = false;
      this.showMatchUp = true;
    };

    this.pickWinner = function pickWinner(number) {
      console.log(number);
      if(number === 1){
        this.winnersArray.push(this.firstContender);
        this.entrantArray.splice(0, 2);
        this.nextMatchup();
      }
      else if(number === 2){
        this.winnersArray.push(this.secondContender);
        this.entrantArray.splice(0, 2);
        this.nextMatchup();
      }
      else if (number === 'random') {
        this.pickWinner( Math.floor((Math.random() * 2)) + 1 );
      }
    };

    this.countRounds = function countRounds(entrants, roundCount) {
      var runningTotal = entrants;
      var roundCounter = roundCount || 0;
      if (runningTotal/2 > 1) {
        roundCounter++;
        this.countRounds(runningTotal/2, roundCounter);
      } else {
        roundCounter++;
        this.numberOfRounds = roundCounter;
      }
    };
  }

})();
