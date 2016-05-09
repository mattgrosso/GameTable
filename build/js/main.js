(function() {
  'use strict';

  angular
    .module('game', ['ui.router', 'ngStorage'])
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

  HomeController.$inject = ['CollectionFactory', '$localStorage'];

  function HomeController(CollectionFactory, $localStorage) {

    var that = this;

    this.$storage = $localStorage;

    this.username = null;

    this.collection = [];

    this.getUserCollection = function getUserCollection() {
      CollectionFactory.getUserCollection(that.username)
        .then(function (response) {
          that.collection = response;
          console.log('collection in storage before: ', that.$storage.collection);
          that.$storage.collection = that.collection;
          console.log('collection in storage after: ', that.$storage.collection);
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
      return $http({
        method: 'GET',
        url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username,
      }).then(function successGetUserCollection(response) {
        return response.data.items.item;
      }).catch(function errorGetUserCollection(response) {
        console.log('error ', response);
      });
    }
  }


})();

//# sourceMappingURL=main.js.map