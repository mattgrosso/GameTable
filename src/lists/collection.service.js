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
      console.log('attempting to retrieve data');
      return $http({
        method: 'GET',
        url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username,
      }).then(function successGetUserCollection(response) {
        console.log('success ', response);
        return response;
      }).catch(function errorGetUserCollection(response) {
        console.log('error ', response);
      });
    }
  }


})();
