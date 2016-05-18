(function() {
  'use strict';

  angular
    .module('game', ['ui.router', 'ngStorage'])
    .config(gameConfig)
    .run(appStart);

  gameConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function gameConfig($stateProvider, $urlRouterProvider) {

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

(function() {
  'use strict';

  angular
    .module('game')
    .filter('gameFilter', function () {
      return function gameFilter(input, players, duration, genre) {
        players = Number(players) || null;
        duration = Number(duration) || null;
        return input.filter(function (each) {
          var include = true;
          if(players && (players < each.playerCount.min || players > each.playerCount.max)){
            include = false;
          }
          if(duration && duration < each.playTime.min){
            include = false;
          }
          if(include && genre){
            include = each.genres.indexOf(genre.toLowerCase()) > -1;
          }
          return include;
        });
      };
    });

})();

(function() {
  'use strict';

  angular
    .module('game')
    .directive('popUpNote', popUpNote);

  function popUpNote() {
    return {
      restrict: 'A',
      template: '',
      link: function renderPopUp(scope, element, attrs) {
        element.click(function() {
          element.after('<aside class="vote-popup">' + attrs + '</aside>');
          setTimeout(function () {
            $('.vote-popup').remove();
          }, 500);
        });
      }
    };
  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    // This filter was lifted from http://ng.malsup.com/#!/titlecase-filter.
    .filter('titleCase', function () {
      return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
      };
    });

})();

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
      console.log(roundCounter);
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
    this.chooserArray = ['random', 'nominate-random', 'eliminate', 'vote', 'nominate-rank', 'bracket'];

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
  }
})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('EliminateChooserController', EliminateChooserController);

  EliminateChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function EliminateChooserController($stateParams, $localStorage, GameFactory) {

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.downToOne = false;

    if (!this.collection || !this.collection.length) {
      GameFactory.getUserCollection()
        .then(function () {
          that.collection = $localStorage.collection;
        });
    }

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

(function() {
  'use strict';

  angular
    .module('game')
    .controller('NomRandChooserController', NomRandChooserController);

  NomRandChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function NomRandChooserController($stateParams, $localStorage, GameFactory) {

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.nomineesArray = [];
    this.randomGame = null;

    if (!this.collection || !this.collection.length) {
      GameFactory.getUserCollection()
        .then(function () {
          that.collection = $localStorage.collection;
        });
    }

    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          return true;
        } else{
          return false;
        }
      });
    };

    this.doneNominating = function doneNominating() {
      console.log(this.collection);
      var randomNumber = Math.floor(Math.random() * this.nomineesArray.length);
      this.randomGame = this.nomineesArray[randomNumber];
    };
  }

})();

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

(function() {
  'use strict';

  angular
    .module('game')
    .controller('RandomChooserController', RandomChooserController);

  RandomChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function RandomChooserController($stateParams, $localStorage, GameFactory) {

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.randomGame = null;

    if (!this.collection || !this.collection.length) {
      GameFactory.getUserCollection()
        .then(function () {
          that.collection = $localStorage.collection;
        });
    }

    this.chooseRandomGame = function chooseRandomGame() {
      var randomNumber = Math.floor(Math.random() * this.collection.length);
      this.randomGame = this.collection[randomNumber];
    };
  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('VoteChooserController', VoteChooserController);

  VoteChooserController.$inject = ['$stateParams', '$localStorage', 'GameFactory'];

  function VoteChooserController($stateParams, $localStorage, GameFactory) {

    var that = this;

    this.collection = $stateParams.filteredCollection;
    this.nomineesArray = [];
    this.showCollection = true;
    this.showNominees = false;
    this.winner = null;

    if (!this.collection || !this.collection.length) {
      GameFactory.getUserCollection()
        .then(function () {
          that.collection = $localStorage.collection;
        });
    }

    this.addNominee = function addNominee() {
      this.nomineesArray = this.collection.filter(function (game) {
        if(game.nominated){
          return true;
        } else{
          return false;
        }
      });
    };

    this.doneNominating = function doneNominating() {
      this.showCollection = false;
      this.showNominees = true;
    };

    this.voteForGame = function voteForGame(game) {
      game.votes = game.votes || 0;
      game.votes = game.votes + 1;
      // game.verify = true;
      // setTimeout(function () {
      //   console.log('running!');
      //   game.verify = false;
      // }, 500);
    };

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

(function() {
  'use strict';

  angular
    .module('game')
    .factory('GameFactory', GameFactory);

  GameFactory.$inject = ['$http', '$q', '$localStorage'];

  function GameFactory($http, $q, $localStorage) {

    var genreArray = [];

    return {
      getUserCollection: getUserCollection,
      searchForGame: searchForGame,
      findThreeMostPopular: findThreeMostPopular,
      amILoggedIn: amILoggedIn,
      logOut: logOut
    };

    function getUserCollection(username) {
      if ($localStorage.collection){
        var def = $q.defer();
        var collection = angular.copy($localStorage.collection);
        def.resolve(collection);
        buildGenreArray(collection);
        console.log(collection);
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
              gameObject.name = each.name[0]._;
              gameObject.type = each.$.subtype;
              gameObject.image = {
                imageURL: each.image[0],
                thumbnailURL: each.thumbnail[0]
              };
              gameObject.status = {
                forTrade: each.status[0].$.fortrade,
                own: each.status[0].$.own,
                previouslyOwn: each.status[0].$.prevowned,
                wantInTrade: each.status[0].$.want
              };
              gameObject.year = parseInt(each.yearpublished[0]);
              gameObject.playerCount = {
                max: parseInt(each.stats[0].$.maxplayers),
                min: parseInt(each.stats[0].$.minplayers)
              };
              gameObject.playTime = {
                max: parseInt(each.stats[0].$.maxplaytime),
                min: parseInt(each.stats[0].$.minplaytime)
              };
              gameObject.rating = {
                myRating: parseInt(each.stats[0].rating[0].$.value),
                userAverage: parseInt(each.stats[0].rating[0].average[0].$.value),
                userRatings: parseInt(each.stats[0].rating[0].usersrated[0].$.value),
                geekRating: parseInt(each.stats[0].rating[0].bayesaverage[0].$.value)
              };
              gameObject.rank = {};
              gameObject.genres = [];
              each.stats[0].rating[0].ranks[0].rank.forEach(function (rank) {
                gameObject.rank[rank.$.name] = rank.$.value;
                gameObject.genres.push(rank.$.name);
              });
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

    function searchForGame(title) {
      var cleanTitle = title.replace(/\s/,'+');
      return $http({
        method: 'GET',
        url: 'http://mattgrosso.herokuapp.com/api/v1/search?query=' + cleanTitle,
        transformResponse: function prettifySearchResults(response) {
          var parsedResponse = JSON.parse(response);
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
              prettyFullSearchItem.name = each.name[0].$.value;
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
                max: parseInt(each.maxplayers[0].$.value),
                min: parseInt(each.minplayers[0].$.value)
              };
              prettyFullSearchItem.playTime = {
                max: parseInt(each.maxplaytime[0].$.value),
                min: parseInt(each.minplaytime[0].$.value)
              };
              prettyFullSearchItem.rating = {
                myRating: 10,
                userAverage: parseInt(each.statistics[0].ratings[0].average[0].$.value),
                userRatings: parseInt(each.statistics[0].ratings[0].usersrated[0].$.value),
                geekRating: parseInt(each.statistics[0].ratings[0].bayesaverage[0].$.value)
              };
              prettyFullSearchItem.numberOwned = parseInt(each.statistics[0].ratings[0].owned[0].$.value);
              prettyFullSearchItem.rank = {};
              prettyFullSearchItem.genres = [];
              each.statistics[0].ratings[0].ranks[0].rank.forEach(function (rank) {
                prettyFullSearchItem.rank[rank.$.name] = rank.$.value;
                prettyFullSearchItem.genres.push(rank.$.name);
              });
              prettyFullSearchArray.push(prettyFullSearchItem);
            });
            return prettyFullSearchArray;
          }
        });
      }).then(function (response) {
        return response.data;
      });
    }

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


    function buildGenreArray(gameArray) {
      $localStorage.genreArray = [];
      gameArray.forEach(function (each) {
        each.genres.forEach(function (genre) {
          if($localStorage.genreArray.indexOf(genre) < 0){
            $localStorage.genreArray.push(genre);
          }
        });
      });
      return genreArray;
    }

    function amILoggedIn() {
      return !!$localStorage.collection;
    }

    function logOut() {
      $localStorage.username = null;
      $localStorage.collection = null;
    }

  }
})();

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

    this.login = function login() {
      $localStorage.collection = null;
      GameFactory.getUserCollection(that.username)
        .then(function () {
          $localStorage.username = that.username;
          that.message = "You are now logged in.";
          that.username = "";
          that.storedUsername = $localStorage.username;
          $state.go('choose');
        })
        .catch(function (response) {
          if (response.status === 'in queue') {
            // that.message = "BGG is working on getting your collection but they are very slow about it. Sit tight, we'll keep bugging them until they do it.";
            setTimeout(that.login, 1000);
          } else {
            console.log('response in the catch function: ',response);
            that.message = "Log in failed. Please check your username.";
          }
        });
        that.message = "Please hold, BGG is slow.";
    };

    this.logOut = function logOut() {
      console.log('logout function is running');
      GameFactory.logOut();
      $state.go('login');
    };
  }

})();

//# sourceMappingURL=main.js.map