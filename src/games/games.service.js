(function() {
  'use strict';

  angular
    .module('game')
    .factory('GameFactory', GameFactory);

  GameFactory.$inject = ['$http', '$q'];

  function GameFactory($http, $q) {
    console.log('I am starting the factory');

    var collection;

    return {
      getUserCollection: getUserCollection,
    };

    function getUserCollection(username) {
      if (collection){
        var def = $q.defer();
        def.resolve(collection);
        return def.promise;
      } else {
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username,
        }).then(function successGetUserCollection(response) {
          collection = response.data.items.item;
          return collection;
        });
      }
    }

  }


})();
