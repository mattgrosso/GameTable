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
    .controller('HomeController', homeController);

  function homeController() {
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
        url: 'http://www.boardgamegeek.com/xmlapi2/collection?username=' + username
      }).then(function successGetUserCollection(response) {
        return response;
      });
    }
  }


})();

//# sourceMappingURL=main.js.map