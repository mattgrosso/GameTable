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
      })
      .state('login', {
        url: '/login',
        templateUrl: 'login/login.template.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .state('choose', {
        url: '/choose',
        templateUrl: 'chooser/chooser.template.html',
        controller: 'ChooserController',
        controllerAs: 'choose'
      })
      .state('list', {
        url: '/list',
        templateUrl: 'lists/game-list.template.html',
        controller: 'ListController',
        controllerAs: 'list'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'settings/settings.template.html',
        controller: 'SettingsController',
        controllerAs: 'settings'
      });
  }

})();


(function() {
  'use strict';

  angular
    .module('game')
    .factory('GameFactory', GameFactory);

  GameFactory.$inject = ['$http', '$q', '$localStorage'];

  function GameFactory($http, $q, $localStorage) {

    return {
      getUserCollection: getUserCollection,
    };

    function getUserCollection(username) {
      if ($localStorage.collection){
        var def = $q.defer();
        def.resolve($localStorage.collection);
        return def.promise;
      } else {
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username,
        }).then(function successGetUserCollection(response) {
          $localStorage.collection = response.data.items.item;
          return $localStorage.collection;
        });
      }
    }

  }


})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['GameFactory', '$localStorage'];

  function HomeController() {

  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('ListController', ListController);

  ListController.$inject = ['GameFactory', '$localStorage'];

  function ListController(GameFactory) {

    var that = this;

    this.collection = [];

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
    });

    console.log('this.collection in ListController', this.collection);

  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('LoginController', LoginController);

LoginController.$inject = ['GameFactory'];

  function LoginController(GameFactory) {

    console.log('I am starting the login controller');

    var that = this;

    this.username = null;

    this.message = "";

    this.login = function login() {
      console.log('this.login is running');
      GameFactory.getUserCollection(that.username)
        .then(function () {
          console.log('login successful');
          that.message = "You are now logged in.";
        })
        .catch(function () {
          console.log('You are not logged in.');
        });

    };
  }

})();


//# sourceMappingURL=main.js.map