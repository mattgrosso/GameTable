(function() {
  'use strict';

  angular
    .module('game', ['ui.router', 'ngStorage'])
    .config(gameConfig)
    .run(appStart);

  gameConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function gameConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'login/login.template.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .state('list', {
        url: '/list',
        templateUrl: 'lists/game-list.template.html',
        controller: 'ListController',
        secure: true,
        controllerAs: 'list'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'settings/settings.template.html',
        controller: 'SettingsController',
        secure: true,
        controllerAs: 'settings'
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
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        secure: true,
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.value', {
        url: '/nomrank/value',
        templateUrl: 'chooser/nomrank-value.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
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
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
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
