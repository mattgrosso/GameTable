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

    this.login = function login() {
      console.log('in login.login before clearing localStorage collection',$localStorage.collection);
      $localStorage.collection = null;
      console.log('in login.login after clearing localStorage collection',$localStorage.collection);
      GameFactory.getUserCollection(that.username)
        .then(function () {
          $localStorage.username = that.username;
          that.message = "You are now logged in.";
        })
        .catch(function () {
          that.message = "Log in failed. Please check your username.";
        });

    };
  }

})();
