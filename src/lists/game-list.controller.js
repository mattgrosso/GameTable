(function() {
  'use strict';

  angular
    .module('game')
    .controller('ListController', ListController);

  ListController.$inject = ['GameFactory', '$localStorage'];

  function ListController(GameFactory, $localStorage) {

    var that = this;

    this.collection = [];

    GameFactory.getUserCollection().then(function (collection) {
      console.log('in getUserCollection ', $localStorage.collection);
      console.log('in getUserCollection ', collection);
      that.collection = collection;
    });

  }

})();
