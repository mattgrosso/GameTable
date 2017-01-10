/**
 * This is the main angular module for the app. The bulk of the code here is made
 * up of states for ui-router to use.
 */
(function() {
  'use strict';

  angular
    .module('game', ['ui.router', 'ngStorage'])
    .config(gameConfig)
    .run(appStart);

  gameConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function gameConfig($stateProvider, $urlRouterProvider) {
    $(window).scrollTop();

    $urlRouterProvider.otherwise('/choose');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'login/login.template.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .state('choose', {
        url: '/choose',
        templateUrl: 'chooser/chooser.template.html',
        controller: 'ChooserController',
        secure: true,
        controllerAs: 'choose'
      })
      .state('choose.choose-top', {
        url: '/choose#choose-top',
        templateUrl: 'chooser/chooser.template.html',
        secure: true,
      })
      .state('random', {
        url: '/random',
        templateUrl: 'chooser/random-chooser.template.html',
        controller: 'RandomChooserController',
        controllerAs: 'random',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-random', {
        url: '/nomrand',
        templateUrl: 'chooser/nominate-random-chooser.template.html',
        controller: 'NomRandChooserController',
        controllerAs: 'nomrand',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('eliminate', {
        url: '/eliminate',
        templateUrl: 'chooser/eliminate-chooser.template.html',
        controller: 'EliminateChooserController',
        controllerAs: 'eliminate',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('vote', {
        url: '/vote',
        templateUrl: 'chooser/vote-chooser.template.html',
        controller: 'VoteChooserController',
        controllerAs: 'vote',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank', {
        url: '/nomrank',
        templateUrl: 'chooser/nominate-rank-chooser.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.start', {
        url: '/nomrank/start',
        templateUrl: 'chooser/nomrank-start.template.html',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.nominate', {
        url: '/nomrank/nominate',
        templateUrl: 'chooser/nomrank-nominate.template.html',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.value', {
        url: '/nomrank/value',
        templateUrl: 'chooser/nomrank-value.template.html',
        secure: true,
        params: {
          nominatedCollection: [],
          currentValueOfVotes: 0,
          winner: null,
          showWinner: null
        }
      })
      .state('nominate-rank.results', {
        url: '/nomrank/value-results',
        templateUrl: 'chooser/nomrank-results.template.html',
        secure: true,
        params: {
          nominatedCollection: [],
          currentValueOfVotes: 0,
          winner: null,
          showWinner: null
        }
      })
      .state('bracket', {
        url: '/bracket',
        templateUrl: 'chooser/bracket-chooser.template.html',
        controller: 'BracketChooserController',
        controllerAs: 'bracket',
        secure: true,
        params: {
          filteredCollection: []
        }
      });
  }

  appStart.$inject = ["$rootScope", "$state", "GameFactory"];

  /**
   * Check to see if the user is logged in before loading any page. If they are
   * logged in they can go to any page but if they are not logged in they are
   * directed to the login page.
   */
  function appStart($rootScope, $state, GameFactory) {
    $rootScope.$on('$stateChangeStart', function checkLoggedIn(event, toState) {
      var isLoggedIn = GameFactory.amILoggedIn();
      if (toState.secure && !isLoggedIn) {
        event.preventDefault();
        $state.go('login');
      }
    });
  }

})();

/**
 * This is a filter which checks the full list against teh criteria in the input fields.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .filter('gameFilter', function () {
      return function gameFilter(input, players, duration, genre) {
        players = Number(players) || null;
        // duration = Number(duration) || null;
        return input.filter(function (each) {
          var include = true;
          if(players && (players < each.playerCount.min || players > each.playerCount.max)){
            include = false;
          }
          if(duration && typeof Number(duration) === 'number' && Number(duration) < 5){
            if((Number(duration)*60) < ((each.playTime.min + each.playTime.max)/2)){
              include = false;
            }
          }
          if(duration && typeof Number(duration) === 'number' && Number(duration) >= 5){
            if(Number(duration) < ((each.playTime.min + each.playTime.max)/2)){
              include = false;
            }
          }
          if (duration && isNaN(Number(duration)) && duration.includes('-')) {
            var durationWithoutSpaces = duration.split(' ').join('');
            var durationRangeArray = durationWithoutSpaces.split('-');
            var minDuration = 0;
            var maxDuration = 0;

            durationRangeArray.forEach(function findMinMax(each) {
              if(Number(each) < minDuration || minDuration === 0){
                minDuration = Number(each);
              }
              if (Number(each) > maxDuration || minDuration === 0) {
                maxDuration = Number(each);
              }
            });

            if (minDuration > ((each.playTime.min + each.playTime.max)/2) || maxDuration < ((each.playTime.min + each.playTime.max)/2)) {
              include = false;
            }
          }
          if(include){
            var tempInclude = false;
            each.genres.forEach(function checkGenresAgainstGenre(everyGenre) {
              genre.forEach(function (eachGenre) {
                if (eachGenre.originalName === everyGenre) {
                  tempInclude = true;
                }
              });
            });
            if (each.genres.length === 1 && each.genres[0] === 'boardgame') {
              tempInclude = true;
            }
            include = tempInclude;
          }
          return include;
        });
      };
    });

})();

/**
 * This directive creates a modal popup window for messages to the user.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .directive('modal', Modal);

  function Modal() {

    return {
      restrict: 'E',
      templateUrl: '/app/modal.template.html',
      link: setup,
      transclude: true,
      scope: {
        show: '=show',
        close: '&close'
      }
    };

    function setup(scope) {
      scope.$watch(function () {
        return scope.show;
      }, function (value) {
        if (value) {
          $(window).scrollTop(0);
          angular.element('body').addClass('freeze-scrolling');
        } else {
          angular.element('body').removeClass('freeze-scrolling');
        }
      });
    }
  }



})();

/**
 * This is a tiny bit of functionality that flashes a visual cue to the user
 * when they push the vote button in the vote chooser.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .directive('popUpNote', popUpNote);

  function popUpNote() {
    return {
      restrict: 'A',
      template: '',
      link: function renderPopUp(scope, element) {
        element.click(function() {
          element.after('<div class="vote-popup"></div>');
          setTimeout(function () {
            $('.vote-popup').remove();
          }, 500);
        });
      }
    };
  }

})();

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
      console.log('this.players: ', this.players);
      this.filterSet.players = this.players || '';
      console.log('this.filterSet.players: ', this.filterSet.players);
      console.log('this.duration: ', this.duration);
      this.filterSet.duration = this.duration || '';
      console.log('this.filterSet.duration: ', this.filterSet.duration);
      console.log('this.currentGenreArray: ', this.currentGenreArray);
      this.filterSet.currentGenreArray = this.currentGenreArray || '';
      console.log('this.filterSet.currentGenreArray: ', this.filterSet.currentGenreArray);
      $localStorage.filterSet = this.filterSet || '';
      console.log('this.filterSet: ', this.filterSet);
      console.log('this.$localStorage.filterSet: ', $localStorage.filterSet);
      $localStorage.genreArray = this.genreArray;

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
      if (param === 'main') {
        if (this.showGenreOptions) {
          this.showGenreOptions = false;
        } else {
          this.showGenreOptions = true;
        }
      }
    };

    this.eliminateGenre = function eliminateGenre(genre) {
      if (genre.eliminated) {
        genre.eliminated = false;
      } else {
        genre.eliminated = true;
      }
      var filteredGenreArray = this.genreArray.filter(function filterEliminated(each) {
        if (each.eliminated) {
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

    /**
     * This section is here to manage the star-rating filter.
     */
    this.starRating = 2;
    this.isStarRatingAbove = function isStarRatingAbove(number) {
      if (number > this.starRating) {
        return true;
      } else{
        return false;
      }
    };
  }
})();

/**
 * This is the controller for the elimination method of choosing.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('EliminateChooserController', EliminateChooserController);

  EliminateChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function EliminateChooserController($stateParams, $localStorage, GameFactory) {

    $(window).scrollTop();

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.downToOne = false;

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
     * This function is called when a user eliminates a game from the list.
     * It sets the eliminated property of the game to true and then refilters
     * the current list of games to take out any that have been eliminated.
     * Finally, it checks to see if the list of games has been reduced to one
     * and, if so, it displays the winning game.
     * @param  {Object} game Game object that was selected.
     */
    this.eliminateGame = function eliminateGame(game) {
      game.eliminated = true;
      console.log(game.eliminated);
      this.collection = this.collection.filter(function (game) {
        if(game.eliminated){
          return false;
        } else{
          return true;
        }
      });
      console.log(this.collection.length);
      if(this.collection.length === 1){
        this.downToOne = true;
      }
    };

  }


})();

/**
 * This is the controller for the Nomrand chooser.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('NomRandChooserController', NomRandChooserController);

  NomRandChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function NomRandChooserController($stateParams, $localStorage, GameFactory) {

    $(window).scrollTop();

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.nomineesArray = [];
    this.randomGame = null;

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
     * It sets the nomineesArray to a filtered set of the collection that only
     * includes games that have the property 'nominated'.
     */
    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          return true;
        } else{
          return false;
        }
      });
    };

    /**
     * This function is called when a user clicks on the 'done nominating'
     * button.
     * It chooses a random game from the array of nominees and displays it.
     */
    this.doneNominating = function doneNominating() {
      console.log(this.collection);
      var randomNumber = Math.floor(Math.random() * this.nomineesArray.length);
      this.randomGame = this.nomineesArray[randomNumber];
    };
  }

})();

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
    console.log('nomineesArray:', this.nomineesArray);

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

/**
 * This is the controller for the random chooser.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('RandomChooserController', RandomChooserController);

  RandomChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function RandomChooserController($stateParams, $localStorage, GameFactory) {
    $(window).scrollTop();

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.randomGame = null;

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
     * This function is called when the user clicks on the 'choose random game'
     * button.
     * It selects a random game from the list and displays it.
     */
    this.chooseRandomGame = function chooseRandomGame() {
      var randomNumber = Math.floor(Math.random() * this.collection.length);
      this.randomGame = this.collection[randomNumber];
    };
  }

})();

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

/**
 * This service handles all of the http requests to the BGG servers.
 * It also tracks login state.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .factory('GameFactory', GameFactory);

  GameFactory.$inject = ['$http', '$q', '$localStorage'];

  function GameFactory($http, $q, $localStorage) {

    return {
      getUserCollection: getUserCollection,
      searchForGame: searchForGame,
      findThreeMostPopular: findThreeMostPopular,
      amILoggedIn: amILoggedIn,
      logOut: logOut
    };

    /**
     * This function takes in a BGG username and performs n http request to
     * the BGG servers to retrieve that user's collection. It follows these steps:
     * 1. First it checks to see if the user's collection is stored in local storage
     * 			If it is, it returns the collection from local storage in a promise.
     * 2. If the local storage collection is empty it makes a request to the
     * 			BGG servers asking to GET the user's collection.
     * 3. BGG responds with very messy data so the transformResponse header
     * 			cleans things up to make them more useable on this end.
     * 4. Sometimes the BGG server will take the request and backlog it for later
     * 			fulfillment. When this happens the user is notified in the message
     * 			of a returned promise.
     * 5. Next this function runs 'buildGenreArray' to create an array of all
     * 			included genres.
     * 6. Finally, the function returns a promise which contains the collection.
     * @param  {String} username Boardgamegeek.com user name
     * @return {Promise}         Collection from localStorage
     * @return {Promise}         Rejected promise with message
     * @return {Promise}         Collection from BGG
     */
    function getUserCollection(username) {
      if ($localStorage.collection){
        var def = $q.defer();
        var collection = angular.copy($localStorage.collection);
        def.resolve(collection);
        buildGenreArray(collection);
        return def.promise;
      } else {
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username + '&stats=1&excludesubtype=boardgameexpansion&own=1',
          transformResponse: function prettifyCollectionArray(response) {
            var parsedResponse = JSON.parse(response);
            if (typeof parsedResponse.message === 'string') {
              return 'in queue';
            }
            var prettyCollectionArray = [];
            parsedResponse.items.item.forEach(function (each) {
              var gameObject = {};
              gameObject.objectID = each.$.objectid;
              gameObject.name = (each.name && each.name[0]._) || "unnamed";
              gameObject.type = each.$.subtype;
              gameObject.image = {
                imageURL: (each.image && each.image[0]) || "",
                thumbnailURL: (each.thumbnail && each.thumbnail[0]) || ""
              };
              if (each.status && each.status[0]) {
                gameObject.status = {
                  forTrade: each.status[0].$.fortrade,
                  own: each.status[0].$.own,
                  previouslyOwn: each.status[0].$.prevowned,
                  wantInTrade: each.status[0].$.want
                };
              } else {
                gameObject.status = {
                  forTrade: "0",
                  own: "1",
                  previouslyOwn: "0",
                  wantInTrade: "0"
                };
              }
              gameObject.year = (each.yearpublished && parseInt(each.yearpublished[0])) || 0;
              gameObject.playerCount = {
                max: (each.stats && parseInt(each.stats[0].$.maxplayers)) || 10,
                min: (each.stats && parseInt(each.stats[0].$.minplayers)) || 1
              };
              gameObject.playTime = {
                max: (each.stats && parseInt(each.stats[0].$.maxplaytime)) || 60,
                min: (each.stats && parseInt(each.stats[0].$.minplaytime)) || 1
              };
              gameObject.rating = {
                myRating: (each.stats[0].rating && parseInt(each.stats[0].rating[0].$.value)) || 0,
                userAverage: (each.stats[0].rating && parseInt(each.stats[0].rating[0].average[0].$.value)) || 0,
                userRatings: (each.stats[0].rating && parseInt(each.stats[0].rating[0].usersrated[0].$.value)) || 0,
                geekRating: (each.stats[0].rating && parseInt(each.stats[0].rating[0].bayesaverage[0].$.value)) || 0
              };
              gameObject.rank = {};
              gameObject.genres = [];
              if (each.stats[0].rating[0].ranks[0].rank.length) {
                each.stats[0].rating[0].ranks[0].rank.forEach(function (rank) {
                  gameObject.rank[rank.$.name] = rank.$.value;
                  gameObject.genres.push(rank.$.name);
                });
              }
              prettyCollectionArray.push(gameObject);
            });
            return prettyCollectionArray;
          }
        }).then(function successGetUserCollection(response) {
          if (response.data === 'in queue') {
            var def = $q.defer();
            var status = {
              status: "in queue",
              message: "BGG is working on it"
            };
            def.reject(status);
            return def.promise;
          }
          buildGenreArray(response.data);
          $localStorage.collection = response.data;
          return response.data;
        });
      }
    }

    /**
     * This function is called when the user enters a search for a new game. It
     * performs the following:
     * 1. It takes spaces out of the search string.
     * 2. It makes an http GET request to the BGG servers.
     * 3. If the data that is returned is an error message because too many results
     * 			were returned, it returns a promise and notifies the user with a message.
     * 4. The list of search results is then reduced to a list of item IDs because
     * 			the search results do not include all of the data needed.
     * 5. The array of IDs is then turned into a string and is included in
     * 			another http GET request to BGG. This time the request asks for all
     * 			of items by ID.
     * 6. The response data from this request is also messy so it is prettified
     * 			for our uses.
     * 7. Finally, the search results are returned in a promise.
     * @param  {String} title Search query from input field
     * @return {Promise}      Contains the results or else an error message.
     */
    function searchForGame(title) {
      var cleanTitle = title.replace(/\s/,'+');
      return $http({
        method: 'GET',
        url: 'http://mattgrosso.herokuapp.com/api/v1/search?query=' + cleanTitle,
        transformResponse: function prettifySearchResults(response, headersGetter, status) {
          var parsedResponse;
          try {
            parsedResponse = JSON.parse(response);
            if (!parsedResponse) {
              var e = new Error("invalid data from server");
              e.status = status;
              return e;
            }
          } catch (e) {
            return "invalid data from server";
          }
          var prettySearchArray = [];
          parsedResponse.items.item.forEach(function (each) {
            var prettySearchItem = {};
            if(each.$.type === 'boardgame'){
              prettySearchItem.id = each.$.id;
              prettySearchArray.push(prettySearchItem);
            }
          });
          return prettySearchArray;
        }
      }).then(function (response) {
        var listOfIds = "";
        response.data.forEach(function createCommaSeperatedListOfIds(each) {
          if (!listOfIds) {
            listOfIds = each.id;
          } else {
            listOfIds = listOfIds + "," + each.id;
          }
        });
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/thing?id=' + listOfIds + '&stats=1',
          transformResponse: function prettifyFullSearchResults(response) {
            var parsedResponse = JSON.parse(response);
            var prettyFullSearchArray = [];
            parsedResponse.items.item.forEach(function (each) {
              var prettyFullSearchItem = {};
              prettyFullSearchItem.objectID = each.$.id;
              prettyFullSearchItem.name = (each.name && each.name[0].$.value) || "unnamed";
              prettyFullSearchItem.type = each.$.type;
              prettyFullSearchItem.image = {};
              if (each.image) {
                prettyFullSearchItem.image.imageURL = each.image[0];
              }
              if (each.thumbnail) {
                prettyFullSearchItem.image.thumbnailURL = each.thumbnail[0];
              }
              prettyFullSearchItem.status = {
                forTrade: 0,
                own: 1,
                previouslyOwn: 0,
                wantInTrade: 0
              };
              prettyFullSearchItem.year = parseInt(each.yearpublished[0].$.value);
              prettyFullSearchItem.playerCount = {
                max: (each.maxplayers && parseInt(each.maxplayers[0].$.value)) || 10,
                min: (each.minplayers && parseInt(each.minplayers[0].$.value)) || 1
              };
              prettyFullSearchItem.playTime = {
                max: (each.maxplaytime && parseInt(each.maxplaytime[0].$.value)) || 60,
                min: (each.minplaytime && parseInt(each.minplaytime[0].$.value)) || 1
              };
              prettyFullSearchItem.rating = {
                myRating: 10,
                userAverage: (each.statistics && parseInt(each.statistics[0].ratings[0].average[0].$.value)) || 0,
                userRatings: (each.statistics && parseInt(each.statistics[0].ratings[0].usersrated[0].$.value)) || 0,
                geekRating: (each.statistics && parseInt(each.statistics[0].ratings[0].bayesaverage[0].$.value)) || 0
              };
              prettyFullSearchItem.numberOwned = (each.statistics && parseInt(each.statistics[0].ratings[0].owned[0].$.value)) || 0;
              prettyFullSearchItem.rank = {};
              prettyFullSearchItem.genres = [];
              if (each.statistics[0].ratings[0].ranks[0].rank.length) {
                each.statistics[0].ratings[0].ranks[0].rank.forEach(function (rank) {
                  prettyFullSearchItem.rank[rank.$.name] = rank.$.value;
                  prettyFullSearchItem.genres.push(rank.$.name);
                });
              }
              prettyFullSearchArray.push(prettyFullSearchItem);
            });
            return prettyFullSearchArray;
          }
        });
      }).then(function (response) {
        return response.data;
      });
    }

    /**
     * This function is called after the search results are returned.
     * It finds the three games in the array that are owned by the most people.
     * @param  {Array} gameArray Array of games
     * @return {Array}           Array of the 3 most popular games from the list.
     */
    function findThreeMostPopular(gameArray) {
      var mostPopular = [
        {numberOwned: 0},
        {numberOwned: 0},
        {numberOwned: 0}
      ];
      var trimmedMostPopular = [];
      gameArray.forEach(function (each) {
        if (each.type === 'boardgame') {
          if(each.numberOwned > mostPopular[0].numberOwned){
            mostPopular[2] = mostPopular[1];
            mostPopular[1] = mostPopular[0];
            mostPopular[0] = each;
          } else if (each.numberOwned > mostPopular[1].numberOwned) {
            mostPopular[2] = mostPopular[1];
            mostPopular[1] = each;
          } else if (each.numberOwned > mostPopular[2].numberOwned) {
            mostPopular[2] = each;
          }
        }
      });
      mostPopular.forEach(function (each) {
        if (each.numberOwned > 0) {
          trimmedMostPopular.push(each);
        }
      });
      return trimmedMostPopular;
    }

    /**
     * This function is called whenever a controller needs to confirm login status.
     * @return {Boolean} Boolean indicating login status.
     */
    function amILoggedIn() {
      return !!$localStorage.collection;
    }

    /**
     * This function is called in order to log out of the app.
     * It clears the username and the collection from localStorage.
     * // TODO: Should I clear out genreArray too?
     */
    function logOut() {
      $localStorage.username = null;
      $localStorage.collection = null;
      $localStorage.filterSet = null;
    }

    /**
     * This function is called by getUserCollection.
     * It takes in an array of games and finds all of the unique genres so that
     * the list of genres can be used in the select menu.
     * @param  {Array} gameArray Array of games
     */
    function buildGenreArray(gameArray) {
      $localStorage.genreArray = [];
      gameArray.forEach(function (each) {
        each.genres.forEach(function (genre) {
          if($localStorage.genreArray.indexOf(genre) < 0){
            $localStorage.genreArray.push(genre);
          }
        });
      });
      var prettyGenreArray = [];
      $localStorage.genreArray.forEach(function prettifyGenreNames(each) {
        if (each === 'boardgame') {
          var nothing = 'nothing';
          nothing = 'still nothing';
        } else if (each === 'cgs') {
          prettyGenreArray.push({
            prettyName: 'card',
            originalName: each
          });
        } else if (each === 'childrensgames') {
          prettyGenreArray.push({
            prettyName: "children's",
            originalName: each
          });
        } else if(each.indexOf('game') > 0){
          var startOfGame = each.indexOf('game');
          var stringLength = each.length;
          var lettersToKeep = stringLength - (stringLength - startOfGame);
          prettyGenreArray.push({
            prettyName: each.substr(0, lettersToKeep),
            originalName: each
          });
        } else{
          prettyGenreArray.push({
            prettyName: each,
            originalName: each
          });
        }
      });
      $localStorage.genreArray = prettyGenreArray;
    }


  }
})();

/**
 * This is the controller for the header.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$state', '$localStorage', 'GameFactory'];

  function HeaderController($state, $localStorage, GameFactory) {

    this.loggedIn = GameFactory.amILoggedIn;
    this.collection = $localStorage.collection;

    /**
     * This function returns the username from localStorage.
     * @return {String} Username from localStorage
     */
    this.username = function getUsername() {
      return $localStorage.username;
    };

    /**
     * This function is called in order to log out.
     * It calls GameFactory.logOut and then sends the user to the login state.
     */
    this.logOut = function logOut() {
      GameFactory.logOut();
      $state.go('login');
    };
  }

})();

/**
 * This is the controller for the login state
 */
(function() {
  'use strict';

  angular
    .module('game')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$localStorage', '$state', 'GameFactory'];

  function LoginController($localStorage, $state, GameFactory) {

    var that = this;

    this.username = null;
    this.storedUsername = $localStorage.username;
    this.message = "";
    this.loggedIn = GameFactory.amILoggedIn;

    /**
     * This checks to see if the user is already logged in in which case they
     * are sent directly to the choose state.
     */
    if (this.loggedIn) {
      $state.go('choose');
    }

    /**
     * This function is called when a user clicks the login button.
     * It calls GameFactory.getUserCollection with the username from the input
     * field and then directs the user to the choose state.
     * Because BGG sometimes backlogs requests for collections this function will
     * attempt to retrieve the data once every second until the data returns.
     * If an error is returned it displays a message for the user.
     */
    this.login = function login() {
      $localStorage.collection = null;
      if (that.username) {
        that.message = "please hold, bgg is slow.";
        return GameFactory.getUserCollection(that.username)
          .then(function () {
            $localStorage.username = that.username;
            that.message = "you are now logged in";
            that.username = "";
            that.storedUsername = $localStorage.username;
            $state.go('choose');
          })
          .catch(function (response) {
            if (response.status === 'in queue') {
              setTimeout(that.login, 1000);
            } else {
              that.message = "log in failed. please check your username.";
            }
          });
      } else {
        $localStorage.username = "no username";
        that.username = "";
        that.storedUsername = $localStorage.username;
        $localStorage.collection = [];
        $state.go('choose');
      }
    };
  }

})();

//# sourceMappingURL=main.js.map