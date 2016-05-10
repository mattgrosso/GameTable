(function() {
  'use strict';

  angular
    .module('game')
    .controller('ListController', ListController);

  ListController.$inject = ['GameFactory', '$localStorage'];

  function ListController(GameFactory, $localStorage) {

    var that = this;

    this.$storage = $localStorage;

    this.collection = [];

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });

    console.log('this.collection in ListController', this.collection);

  }

})();
