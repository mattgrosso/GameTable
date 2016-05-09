(function() {
  'use strict';

  angular
    .module('game')
    .factory('CollectionFactory', CollectionFactory);

  CollectionFactory.$inject = ['$http'];

  function CollectionFactory($http) {

    return {
      getUserCollection: getUserCollection
    };

    function getUserCollection(username) {
      return $http({
        method: 'GET',
        url: 'http://www.boardgamegeek.com/xmlapi2/collection?username=' + username
      }).then(function successGetUserCollection(response) {
        return response;
      });
    }
  }


})();
