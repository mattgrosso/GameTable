/**
 * This is the controller for the vote chooser.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('VoteChooserController', VoteChooserController);

  VoteChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function VoteChooserController($stateParams, $localStorage, GameFactory) {
    $(window).scrollTop();

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.nomineesArray = [];
    this.showCollection = true;
    this.showNominees = false;
    this.winner = null;

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
     * This function is called when the user clicks on a nominate button.
     * It sets the nomineesArray to a filters set of the collection that only
     * includes games that have the property nominated.
     * It also resets the number of votes on all games.
     */
    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          return true;
        } else{
          return false;
        }
      });
      this.nomineesArray.forEach(function clearPreviousVotes(each) {
        each.votes = 0;
      });
    };

    /**
     * This function is called when the user clicks on 'done nominating'.
     * It hides the collection and only shows the list of nominees.
     */
    this.doneNominating = function doneNominating() {
      this.showCollection = false;
      this.showNominees = true;
    };

    /**
     * This function is called when a user votes for a game.
     * It increments the number of votes for the selected game.
     * @param  {object} game Game object selected.
     */
    this.voteForGame = function voteForGame(game) {
      game.votes = game.votes || 0;
      game.votes = game.votes + 1;
    };

    /**
     * This function is called when the user selects the 'show winner' button.
     * It checks over the array of nominees and displays the one with the
     * highest number of votes.
     */
    this.showWinner = function showWinner() {
      var mostVotes = {
        votes: 0,
        name: null,
        games: []
      };
      this.nomineesArray.forEach(function (each) {
        if(each.votes > mostVotes.votes){
          mostVotes.name = each.name;
          mostVotes.votes = each.votes;
          mostVotes.games = [each];
        } else if((each.votes > 0) && (each.votes === mostVotes.votes)){
          mostVotes.name = mostVotes.name + ' and ' + each.name;
          mostVotes.games.push(each);
        }
      });
      this.showNominees = false;
      this.winner = mostVotes;
    };

  }

})();
