/**
 * This is the controller for the bracket style chooser.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('BracketChooserController', BracketChooserController);

  BracketChooserController.$input = ['$stateParams', '$state'];

  function BracketChooserController($stateParams, $state) {

    $(window).scrollTop();

    console.log('initiating BracketChooserController');

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

    /**
     * This checks to see if the user arrived here correctly. If they came
     * directly to this page without passing in the arry of games they are
     * directed back to the choose state.
     */
    if (!this.arrayToBeRandomized || !this.arrayToBeRandomized.length) {
      $state.go('choose');
    }

    /**
     * This function is triggered by the 'start tournament' button. It takes in
     * the array of games from the main list and generates a new array where
     * the games are arranged randomly. Once it has randomized the entire array
     * it calls countRounds with the length of the entrantArray and then
     * calls 'nextMatchup'.
     */
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

    /**
     * This function checks to see if there are any games left in the array of
     * entrants.
     * If there is only one game remaining, that game is set as the winner of
     * the tournament.
     * If the number of games in the array is not divisible by 2 it then removes
     * one game randomly from the set and adds it to the array for the next round.
     * Then it sets the first and second games in the array as the first and
     * second contenders which displays them in the UI.
     */
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
      this.showStart = false;
      this.showMatchUp = true;
    };

    /**
     * This function is called when the user chooses a winner in each matchup.
     * Whichever contender was chosen is added to the array of winners and then
     * both the first and the second game are removed from the entrantArray.
     * Finally, nextMatchup is called again.
     * There is also a button for choosing randomly which randomly chooses either
     * 1 or 2 and then calls pickWinner recursively.
     * @param  {number} number This will be 1 if firstContender was chosen and 2 if secondContender was chosen.
     */
    this.pickWinner = function pickWinner(number) {
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

    /**
     * This function is called by startTournament.
     * It is given the total number of entrants and it determines how many
     * rounds there will need to be in the tournament. It requires the second
     * argument (roundCount) because it figures out the number of rounds by
     * calling on itself and tracking the current count through its own arguement.
     * In the end it sets this.numberOfRounds to the total number of rounds.
     * @param  {number} entrants   Number of entrants in the tournament
     * @param  {number} roundCount Running total of rounds
     */
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
