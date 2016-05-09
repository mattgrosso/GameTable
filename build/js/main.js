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

    console.log('in the controller');

    var that = this;

    this.username = null;

    this.getUserCollection = function getUserCollection() {
      console.log(that.username);
      return CollectionFactory.getUserCollection(that.username);
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
        console.log('success ', response);
        return response;
      }).catch(function errorGetUserCollection(response) {
        console.log('error ', response);
      });
    }
  }


})();

//# sourceMappingURL=main.js.map