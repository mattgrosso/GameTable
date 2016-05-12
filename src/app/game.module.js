(function() {
  'use strict';

  angular
    .module('game', ['ui.router', 'ngStorage'])
    .config(gameConfig);

  gameConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function gameConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.template.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'login/login.template.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .state('list', {
        url: '/list',
        templateUrl: 'lists/game-list.template.html',
        controller: 'ListController',
        controllerAs: 'list'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'settings/settings.template.html',
        controller: 'SettingsController',
        controllerAs: 'settings'
      })
      .state('choose', {
        url: '/choose',
        templateUrl: 'chooser/chooser.template.html',
        controller: 'ChooserController',
        controllerAs: 'choose'
      })
      .state('random', {
        url: '/random',
        templateUrl: 'chooser/random-chooser.template.html',
        controller: 'RandomChooserController',
        controllerAs: 'random',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-random', {
        url: '/nomrand',
        templateUrl: 'chooser/nominate-random-chooser.template.html',
        controller: 'NomRandChooserController',
        controllerAs: 'nomrand',
        params: {
          filteredCollection: []
        }
      })
      .state('eliminate', {
        url: '/eliminate',
        templateUrl: 'chooser/eliminate-chooser.template.html',
        controller: 'EliminateChooserController',
        controllerAs: 'eliminate',
        params: {
          filteredCollection: []
        }
      })
      .state('vote', {
        url: '/vote',
        templateUrl: 'chooser/vote-chooser.template.html',
        controller: 'VoteChooserController',
        controllerAs: 'vote',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank', {
        url: '/nomrank',
        templateUrl: 'chooser/nominate-rank-chooser.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.nominate', {
        url: '/nomrank/nominate',
        templateUrl: 'chooser/nomrank-nominate.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.value1', {
        url: '/nomrank/value1',
        templateUrl: 'chooser/nomrank-value1.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.value2', {
        url: '/nomrank/value2',
        templateUrl: 'chooser/nomrank-value2.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.value3', {
        url: '/nomrank/value3',
        templateUrl: 'chooser/nomrank-value3.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.value1-results', {
        url: '/nomrank/value1-results',
        templateUrl: 'chooser/nomrank-value1-results.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.value2-results', {
        url: '/nomrank/value2-results',
        templateUrl: 'chooser/nomrank-value2-results.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        params: {
          filteredCollection: []
        }
      })
      .state('nominate-rank.final-results', {
        url: '/nomrank/final-results',
        templateUrl: 'chooser/nomrank-final-results.template.html',
        controller: 'NomRankChooserController',
        controllerAs: 'nomrank',
        params: {
          filteredCollection: []
        }
      });

  }

})();
