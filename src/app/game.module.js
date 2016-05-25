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
        url: '/login#login-top',
        templateUrl: 'login/login.template.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .state('choose', {
        url: '/choose#choose-top',
        templateUrl: 'chooser/chooser.template.html',
        controller: 'ChooserController',
        secure: true,
        controllerAs: 'choose'
      })
      .state('random', {
        url: '/random#random-top',
        templateUrl: 'chooser/random-chooser.template.html',
        controller: 'RandomChooserController',
        controllerAs: 'random',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-random', {
        url: '/nomrand#nomrand-top',
        templateUrl: 'chooser/nominate-random-chooser.template.html',
        controller: 'NomRandChooserController',
        controllerAs: 'nomrand',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('eliminate', {
        url: '/eliminate#eliminate-top',
        templateUrl: 'chooser/eliminate-chooser.template.html',
        controller: 'EliminateChooserController',
        controllerAs: 'eliminate',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('vote', {
        url: '/vote#vote-top',
        templateUrl: 'chooser/vote-chooser.template.html',
        controller: 'VoteChooserController',
        controllerAs: 'vote',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank', {
        url: '/nomrank#nomrank-top',
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
        url: '/bracket#bracket-top',
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
