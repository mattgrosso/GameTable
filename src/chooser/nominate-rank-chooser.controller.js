/**
 * This is the controller for the NomRank chooser.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('NomRankChooserController', NomRankChooserController);

  NomRankChooserController.$inject = ['$stateParams', '$state', '$localStorage', 'GameFactory'];

  function NomRankChooserController($stateParams, $state, $localStorage, GameFactory) {
    $(window).scrollTop();

    console.log('refreshing NomRankChooserController');

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.showStartScreen = true;
    this.nomineesArray = $stateParams.nominatedCollection || [];
    this.currentValueOfVotes = $stateParams.currentValueOfVotes || 0;
    this.winner = $stateParams.winner || null;
    this.showWinner = $stateParams.showWinner || false;

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
     * This function is called when a user clicks on the 'start process' button.
     * It hides the start screen and sends the user to the nominate-rank.nominate
     * state.
     */
    this.startProcess = function startProcess() {
      this.showStartScreen = false;
      $state.go('nominate-rank.nominate');
    };

    /**
     * This function is called when the user clicks on a nominate button.
     * It sets the nomineesArray to a filters set of the collection that only
     * includes games that have the property nominated.
     */
    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          game.value = 0;
          return true;
        } else{
          return false;
        }
      });
    };

    /**
     * This function is called at the start of each voting round after the user
     * clicks the button to take them to the next round.
     * It checks to see what the corrent value of votes is (this is also the
     * number of the current round) and then, if the currentValueOfVotes is
     * less than 3, it sends the user to the nominate-rank.value state.
     * If the currentValueOfVotes is 3 it sends the user to the
     * nominate-rank.results state.
     */
    this.goToValueVoting = function goToValueVoting() {
      this.showStartScreen = false;
      if(this.currentValueOfVotes < 3){
        this.currentValueOfVotes++;
        $state.go('nominate-rank.value', {
          nominatedCollection: this.nomineesArray,
          currentValueOfVotes: this.currentValueOfVotes,
          winner: this.winner,
          showWinner: this.showWinner
        });
      } else {
        $state.go('nominate-rank.results', {
          nominatedCollection: this.nomineesArray,
          currentValueOfVotes: this.currentValueOfVotes,
          winner: this.winner,
          showWinner: this.showWinner
        });
      }
    };

    /**
     * This function is called whenever a user votes for a game.
     * It adds the currentValueOfVotes to the value for the selected game.
     * @param {Object} game Game object for the selected game.
     */
    this.addValue = function addValue(game) {
      game.value = game.value || 0;
      game.value = game.value + this.currentValueOfVotes;
    };

    /**
     * This function is called whenever the user clicks the 'done adding value'
     * button.
     * If the currentValueOfVotes is less than 3 then it sends the user to the
     * nominate-rank.results state.
     * Otherwise, it searches the array of nominees for the game with the
     * highest total value and assigns that game to the winner variable.
     * Finally, it displays the winner.
     */
    this.goToResults = function goToResults() {
      if(this.currentValueOfVotes < 3){
        $state.go('nominate-rank.results', {
          nominatedCollection: this.nomineesArray,
          currentValueOfVotes: this.currentValueOfVotes,
          winner: this.winner,
          showWinner: this.showWinner
        });
      } else {
        var mostValue = {
          value: 0,
          name: null,
          games: []
        };
        this.nomineesArray.forEach(function (each) {
          if(each.value > mostValue.value){
            mostValue.name = each.name;
            mostValue.value = each.value;
            mostValue.games = [each];
          } else if((each.value > 0) && (each.value === mostValue.value)){
            mostValue.name = mostValue.name + ' and ' + each.name;
            mostValue.games.push(each);
          }
        });
        this.winner = mostValue;
        this.showWinner = true;
        $state.go('nominate-rank.results', {
          nominatedCollection: this.nomineesArray,
          currentValueOfVotes: this.currentValueOfVotes,
          winner: this.winner,
          showWinner: this.showWinner
        });
      }
    };

  }

})();
