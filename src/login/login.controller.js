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
      that.message = "Please hold, BGG is slow.";
      return GameFactory.getUserCollection(that.username)
        .then(function () {
          console.log('in .then for ctrl');
          $localStorage.username = that.username;
          that.message = "You are now logged in.";
          that.username = "";
          that.storedUsername = $localStorage.username;
          $state.go('choose');
        })
        .catch(function (response) {
          console.log('in the catch in the ctrl');
          if (response.status === 'in queue') {
            console.log('in the in queue if');
            // that.message = "BGG is working on getting your collection but they are very slow about it. Sit tight, we'll keep bugging them until they do it.";
            setTimeout(that.login, 1000);
          } else {
            console.log('in the else in the catch');
            that.message = "Log in failed. Please check your username.";
          }
        });
    };
  }

})();
