(function() {
  'use strict';

  angular
    .module('game')
    .controller('NomRankChooserController', NomRankChooserController);

  NomRankChooserController.$inject = ['$stateParams', '$state', '$localStorage', 'GameFactory'];

  function NomRankChooserController($stateParams, $state, $localStorage, GameFactory) {

    console.log('refreshing NomRankChooserController');

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.showStartScreen = true;
    this.nomineesArray = $stateParams.nominatedCollection || [];
    this.currentValueOfVotes = $stateParams.currentValueOfVotes || 0;
    this.winner = $stateParams.winner || null;
    this.showWinner = $stateParams.showWinner || false;


    if (!this.collection || !this.collection.length) {
      GameFactory.getUserCollection()
        .then(function () {
          that.collection = $localStorage.collection;
        });
    }

    this.startProcess = function startProcess() {
      this.showStartScreen = false;
      $state.go('nominate-rank.nominate');
    };

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

    this.addValue = function addValue(game) {
      console.log(game);
      console.log(game.value);
      game.value = game.value || 0;
      game.value = game.value + this.currentValueOfVotes;
    };

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
        console.log('this.showWinner: ', this.showWinner);
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
