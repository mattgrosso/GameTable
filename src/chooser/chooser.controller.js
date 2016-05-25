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
    this.addGamesPopupMessage = "";
    this.firstGameToAdd = null;
    this.secondGameToAdd = null;
    this.thirdGameToAdd = null;

    this.showFilters = true;
    this.showAddGame = false;
    this.showGamesToAdd = false;
    this.freezeScrolling = false;

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });

    this.goToChooser = function (filtered) {
      $state.go(this.chooser, {filteredCollection: filtered});
    };

    this.showAddGameForm = function showAddGameForm() {
      this.showAddGame = true;
      this.freezeScrolling = true;
      this.addGamesPopupMessage = "";
    };

    this.findGameToAdd = function findGameToAdd(title) {
      this.addGamesPopupMessage = "please hold, bgg is working on it.";
      GameFactory.searchForGame(title).then(function (response) {
        console.log('.then is running');
        var mostPopular = GameFactory.findThreeMostPopular(response);
        that.addGamesPopupMessage = "click a game to add";
        that.keepUpdatingMessage = false;
        that.showGamesToAdd = true;
        that.addGameTitle = "";
        that.firstGameToAdd = mostPopular[0];
        that.secondGameToAdd = mostPopular[1];
        that.thirdGameToAdd = mostPopular[2];
      }).catch(function () {
        that.addGamesPopupMessage = "too many results. try something more specific.";
      });
    };

    this.addGameToList = function addGameToList(game) {
      this.collection.unshift(game);
      this.showGamesToAdd = false;
      this.showAddGame = false;
    };

    this.hideAddGame = function hideAddGame() {
      this.showGamesToAdd = false;
      this.showAddGame = false;
    };



  }
})();
