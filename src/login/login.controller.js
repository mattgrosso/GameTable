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

    this.loggedIn = false;

    if (GameFactory.amILoggedIn()) {
      this.loggedIn = true;
    }

    this.login = function login() {
      $localStorage.collection = null;
      GameFactory.getUserCollection(that.username)
        .then(function () {
          $localStorage.username = that.username;
          that.loggedIn = true;
          that.message = "You are now logged in.";
          that.username = "";
          that.storedUsername = $localStorage.username;
          $state.go('choose');
        })
        .catch(function () {
          that.message = "Log in failed. Please check your username.";
        });
        that.message = "Please hold, BGG is slow.";
    };

    this.logOut = function logOut() {
      console.log('logout function is running');
      GameFactory.logOut();
      this.loggedIn = true;
      $state.go('login');
    };
  }

})();
