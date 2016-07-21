/**
 * This is the controller for the main page of the app where users can filter
 * their game collection, add new games to the list and choose which method
 * they want to use for picking a game.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('ChooserController', ChooserController);

  ChooserController.$inject = ['GameFactory', '$localStorage', '$state'];

  function ChooserController(GameFactory, $localStorage, $state) {
    var that = this;

    this.loggedIn = GameFactory.amILoggedIn;
    this.collection = [];
    $localStorage.filterSet = $localStorage.filterSet || {};
    this.players = $localStorage.filterSet.players || "";
    this.duration = $localStorage.filterSet.duration || "";
    this.genre = $localStorage.filterSet.genre || "";
    this.genreArray = $localStorage.genreArray;
    this.currentGenreArray = $localStorage.filterSet.currentGenreArray || this.genreArray;
    this.chooser = "";
    this.addGameTitle = "";
    this.filterSet = {};
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
    this.showGenreOptions = false;

    /**
     * This function is called when the choose page is loaded so that if someone
     * is returning to the app directly they do not need to go through the log in page.
     * It calls on a method from the GameFactory service which retrieves the
     * user's collection.
     */
    GameFactory.getUserCollection()
      .then(function (collection) {
        that.collection = collection;
      });

    /**
     * This function is triggered by the select of game choosers and directs
     * the user to the appropriate state for the chosen chooser.
     * It also passes in the filtered collection array as a state parameter.
     */
    this.goToChooser = function (filtered) {
      this.filterSet.players = this.players || '';
      this.filterSet.duration = this.duration || '';
      this.filterSet.currentGenreArray = this.currentGenreArray || '';
      $localStorage.filterSet = this.filterSet || '';

      $state.go(this.chooser, {filteredCollection: filtered});
    };

    /**
     * This function is called when the user clicks the button to add a new game
     * to the list.
     * It toggles the view for the new game search box and ensures that the
     * message on that box is empty.
     */
    this.showAddGameForm = function showAddGameForm() {
      this.showAddGame = true;
      this.addGamesPopupMessage = "";
    };

    this.showGenreOptionsModal = function showGenreOptionsModal(param) {
      console.log('currentGenreArray: ', this.currentGenreArray);
      if (param === 'main') {
        if (this.showGenreOptions) {
          this.showGenreOptions = false;
        } else {
          this.showGenreOptions = true;
        }
      }
    };

    this.eliminateGenre = function eliminateGenre() {
      var filteredGenreArray = this.genreArray.filter(function filterEliminated(genre) {
        if (genre.eliminated) {
          return false;
        } else {
          return true;
        }
      });
      this.currentGenreArray = filteredGenreArray;
    };

    /**
     * This function is triggered when a user submits the game search form in
     * order to find a game to add to the list.
     * It calls on the searchForGame method on the GameFactory service.
     * When the promise is returned, it runs the findThreeMostPopular method on
     * the results and updates some views in the page.
     * If the results come back as an error is notifies the user.
     * @param  {string} title Game title from the search input field
     */
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

    /**
     * This function is called when the user selects a game from the search
     * results.
     * It adds the selected game to the colelction and hides the add game modal.
     * @param {Object} game The selected game obect
     */
    this.addGameToList = function addGameToList(game) {
      game.addedBySearch = true;
      this.collection.unshift(game);
      $localStorage.collection.unshift(game);
      this.showGamesToAdd = false;
      this.showAddGame = false;
    };

    /**
     * This function is called when a user clicks off of the add game modal.
     * It simply hides the modal and returns the user to the main site.
     */
    this.hideAddGame = function hideAddGame() {
      this.showGamesToAdd = false;
      this.showAddGame = false;
    };

    this.removeAddedGame = function removeAddedGame(game) {
      var indexValue = this.collection.indexOf(game);
      this.collection.splice(indexValue, 1);
      $localStorage.collection.splice(indexValue, 1);
    };


  }
})();
