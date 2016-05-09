(function() {
  'use strict';

  angular
    .module('game', ['ui.router'])
    .config(gameConfig);

  gameConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function gameConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.template.html',
        controller: 'HomeController',
        controllerAs: 'home'
      });
  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['CollectionFactory'];

  function HomeController(CollectionFactory) {


    var that = this;

    this.username = null;

    this.collection = [];

    this.getUserCollection = function getUserCollection() {
      CollectionFactory.getUserCollection(that.username)
        .then(function (response) {
          that.collection = response;
          return that.collection;
        });
    };

  }

})();

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
        console.log(response.data.items.item);
        return response.data.items.item;
      }).catch(function errorGetUserCollection(response) {
        console.log('error ', response);
      });
    }
  }


})();

//# sourceMappingURL=main.js.map