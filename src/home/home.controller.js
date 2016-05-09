(function() {
  'use strict';

  angular
    .module('game')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['CollectionFactory'];

  function HomeController(CollectionFactory) {


    var that = this;

    this.username = null;

    this.collection = [];

    this.getUserCollection = function getUserCollection() {
      CollectionFactory.getUserCollection(that.username)
        .then(function (response) {
          that.collection = response;
          return that.collection;
        });
    };

  }

})();
