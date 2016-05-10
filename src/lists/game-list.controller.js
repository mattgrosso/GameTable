(function() {
  'use strict';

  angular
    .module('game')
    .controller('ListController', ListController);

  ListController.$inject = ['GameFactory', '$localStorage'];

  function ListController(GameFactory, $localStorage) {

    this.$storage = $localStorage;

    this.collection = GameFactory.userCollection;

  }

})();
