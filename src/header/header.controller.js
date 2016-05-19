(function() {
  'use strict';

  angular
    .module('game')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$state', '$localStorage', 'GameFactory'];

  function HeaderController($state, $localStorage, GameFactory) {
    console.log('Inside of HeaderController');

    this.loggedIn = GameFactory.amILoggedIn;

    this.username = function getUsername() {
      return $localStorage.username;
    };

    this.logOut = function logOut() {
      console.log('logout function is running');
      GameFactory.logOut();
      $state.go('login');
    };
  }

})();
