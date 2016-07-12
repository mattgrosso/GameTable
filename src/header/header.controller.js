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
