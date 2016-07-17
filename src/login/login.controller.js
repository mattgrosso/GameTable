/**
 * This is the controller for the login state
 */
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

    /**
     * This checks to see if the user is already logged in in which case they
     * are sent directly to the choose state.
     */
    if (this.loggedIn) {
      $state.go('choose');
    }

    /**
     * This function is called when a user clicks the login button.
     * It calls GameFactory.getUserCollection with the username from the input
     * field and then directs the user to the choose state.
     * Because BGG sometimes backlogs requests for collections this function will
     * attempt to retrieve the data once every second until the data returns.
     * If an error is returned it displays a message for the user.
     */
    this.login = function login() {
      $localStorage.collection = null;
      that.message = "please hold, bgg is slow.";
      return GameFactory.getUserCollection(that.username)
        .then(function () {
          $localStorage.username = that.username;
          that.message = "you are now logged in";
          that.username = "";
          that.storedUsername = $localStorage.username;
          $state.go('choose');
        })
        .catch(function (response) {
          console.log('in the catch in the ctrl');
          if (response.status === 'in queue') {
            console.log('in the in queue if');
            setTimeout(that.login, 1000);
          } else {
            console.log('in the else in the catch');
            that.message = "log in failed. please check your username.";
          }
        });
    };
  }

})();
