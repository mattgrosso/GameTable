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
      console.log('this.login is running');
      GameFactory.getUserCollection(that.username)
        .then(function () {
          console.log('login successful');
          console.log(GameFactory.userCollection);
          that.message = "You are now logged in.";
        })
        .catch(function () {
          console.log('You are not logged in.');
        });

    };
  }

})();
