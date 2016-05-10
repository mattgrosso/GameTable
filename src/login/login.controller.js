(function() {
  'use strict';

  angular
    .module('game')
    .controller('LoginController', LoginController);

LoginController.$inject = ['GameFactory'];

  function LoginController(GameFactory) {

    var that = this;

    this.username = null;

    this.message = "";

    this.login = function login() {
      GameFactory.getUserCollection(that.username)
        .then(function () {
          that.message = "You are now logged in.";
        })
        .catch(function () {
          console.log('You are not logged in.');
        });

    };
  }

})();
