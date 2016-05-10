(function() {
  'use strict';

  angular
    .module('game')
    .factory('GameFactory', GameFactory);

  GameFactory.$inject = ['$http'];

  function GameFactory($http) {

    var collection = [];

    return {
      getUserCollection: getUserCollection,
      userCollection: collection
    };

    function getUserCollection(username) {
      return $http({
        method: 'GET',
        url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username,
      }).then(function successGetUserCollection(response) {
        collection = response.data.items.item;
      }).catch(function errorGetUserCollection(response) {
        console.log('error ', response);
      });
    }
  }


})();
