(function() {
  'use strict';

  angular
    .module('game')
    .controller('LoginController', LoginController);

LoginController.$inject = ['GameFactory', '$localStorage'];

  function LoginController(GameFactory, $localStorage) {

    var that = this;

    this.username = null;
    this.storedUsername = $localStorage.username;
    this.message = "";

    this.loggedIn = false;

    console.log('This is $localStorage.username: ',$localStorage.username);
    if ($localStorage.username) {
      console.log('Were inside of the if statement');
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
        })
        .catch(function () {
          that.message = "Log in failed. Please check your username.";
        });
        that.message = "Please hold, BGG is slow.";

    };
  }

})();
