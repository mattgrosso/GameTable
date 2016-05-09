(function() {
  'use strict';

  angular
    .module('game')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['CollectionFactory'];

  function HomeController(CollectionFactory) {

    console.log('in the controller');

    var that = this;

    this.username = null;

    this.getUserCollection = function getUserCollection() {
      console.log(that.username);
      return CollectionFactory.getUserCollection(that.username);
    };

  }

})();
