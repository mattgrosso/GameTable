(function() {
  'use strict';

  angular
    .module('game')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['CollectionFactory', '$localStorage'];

  function HomeController(CollectionFactory, $localStorage) {

    var that = this;

    this.$storage = $localStorage;

    this.username = null;

    this.collection = [];

    this.getUserCollection = function getUserCollection() {
      CollectionFactory.getUserCollection(that.username)
        .then(function (response) {
          that.collection = response;
          console.log('collection in storage before: ', that.$storage.collection);
          that.$storage.collection = that.collection;
          console.log('collection in storage after: ', that.$storage.collection);
          return that.collection;
        });
    };

  }

})();
