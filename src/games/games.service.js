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
      console.log('getUserCollection is running');
      console.log('username is ', username);
      return $http({
        method: 'GET',
        url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username,
      }).then(function successGetUserCollection(response) {
        console.log('.then in getUserCollection is running');
        collection = response.data.items.item;
        console.log(response);
        console.log(collection);
      }).catch(function errorGetUserCollection(response) {
        console.log('error ', response);
      });
    }
  }


})();
