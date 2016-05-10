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

  function ListController(GameFactory, $localStorage) {

    this.$storage = $localStorage;

    this.collection = GameFactory.userCollection;

  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('LoginController', LoginController);

LoginController.$inject = ['GameFactory'];

  function LoginController(GameFactory) {

    var that = this;

    this.username = null;

    this.message = "";

    this.login = function login() {
      console.log('this.login is running');
      GameFactory.getUserCollection(that.username)
        .then(function () {
          console.log('login successful');
          console.log(GameFactory.userCollection);
          that.message = "You are now logged in.";
        })
        .catch(function () {
          console.log('You are not logged in.');
        });

    };
  }

})();


//# sourceMappingURL=main.js.map