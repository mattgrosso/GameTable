(function() {
  'use strict';

  angular
    .module('game')
    .controller('ChooserController', ChooserController);

  ChooserController.$inject = ['GameFactory', '$localStorage', '$state'];

  function ChooserController(GameFactory, $localStorage, $state) {
    var that = this;

    this.collection = [];
    this.players = "";
    this.duration = "";
    this.genre = "";
    this.genreArray = $localStorage.genreArray;
    this.chooser = "";
    this.addGameTitle = "";
    this.chooserArray = [
      {
        menuName: 'Random',
        stateName: 'random'
      },
      {
        menuName: 'Nominate-Random',
        stateName: 'nominate-random'
      },
      {
        menuName: 'Eliminate',
        stateName: 'eliminate'
      },
      {
        menuName: 'Vote',
        stateName: 'vote'
      },
      {
        menuName: 'Nominate-Rank',
        stateName: 'nominate-rank.start'
      },
      {
        menuName: 'Bracket',
        stateName: 'bracket'
      }
    ];

    this.firstGameToAdd = null;
    this.secondGameToAdd = null;
    this.thirdGameToAdd = null;

    this.showFilters = true;
    this.showAddGame = false;
    this.showGamesToAdd = false;

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });

    this.goToChooser = function (filtered) {
      $state.go(this.chooser, {filteredCollection: filtered});
    };

    this.showAddGameForm = function showAddGameForm() {
      this.showAddGame = true;
    };

    this.findGameToAdd = function findGameToAdd(title) {
      GameFactory.searchForGame(title).then(function (response) {
        var mostPopular = GameFactory.findThreeMostPopular(response);
        console.log(mostPopular);
        that.showGamesToAdd = true;
        that.addGameTitle = "";
        that.firstGameToAdd = mostPopular[0];
        that.secondGameToAdd = mostPopular[1];
        that.thirdGameToAdd = mostPopular[2];
      });
    };

    this.addGameToList = function addGameToList(game) {
      this.collection.push(game);
      this.showGamesToAdd = false;
      this.showAddGame = false;
    };

    this.methodDescriptions = "Random: Choose a game randomly.<br>Nominate-Random: Choose a game randomly from a list of games you nominate.<br>Eliminate: Choose a game by taking turns eliminating games from a list.<br>Vote: Choose a game by voting on games in a list of games you nominate.<br>Nominate-Rank: Choose a game through a series of votes of increasing value.<br>Bracket: Choose a game by going though a tournament of head-to-head matchups";
  }
})();
