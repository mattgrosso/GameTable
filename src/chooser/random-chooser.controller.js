(function() {
  'use strict';

  angular
    .module('game')
    .controller('RandomChooserController', RandomChooserController);

  RandomChooserController.$inject = ['$stateProvider'];

  function RandomChooserController($stateProvider) {
    this.collection = $stateProvider.filteredCollection;
  }

})();
