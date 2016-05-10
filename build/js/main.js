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
      console.log('in getUserCollection, this is localStorage collection:', $localStorage.collection, '(It should be null)');
      if ($localStorage.collection){
        console.log('Somehow we got into the first if statement. We shouldnt have.');
        var def = $q.defer();
        def.resolve($localStorage.collection);
        return def.promise;
      } else {
        console.log('Now were in the else statement of getUserCollection');
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username,
          transformResponse: function prettifyCollectionArray(response) {
            console.log('Inside of transformResponse the data looks like this: ', response);
            var parsedResponse = JSON.parse(response);
            console.log('After I run JSON.parse on it the data looks like this: ', parsedResponse);
            var prettyCollectionArray = [];
            console.log('Right before I run the forEach parsedResponse.items.item looks like this: ', parsedResponse.items.item);
            parsedResponse.items.item.forEach(function (each) {
              var gameObject = {};
              gameObject.objectID = each.$.objectid;
              gameObject.name = each.name[0]._;
              gameObject.type = each.$.subtype;
              gameObject.image = {
                imageURL: each.image[0],
                thumbnailURL: each.thumbnail[0]
              };
              gameObject.status = {
                forTrade: each.status[0].$.fortrade,
                own: each.status[0].$.own,
                previouslyOwn: each.status[0].$.prevowned,
                wantInTrade: each.status[0].$.want
              };
              gameObject.year = each.yearpublished[0];
              prettyCollectionArray.push(gameObject);
            });
            console.log('right after I run the forEach prettyCollectionArray looks like this: ',prettyCollectionArray);
            return prettyCollectionArray;
          }
        }).then(function successGetUserCollection(response) {
          console.log('This is the response that is sent to the .then statement after getUserCollection: ',response);
          $localStorage.collection = response.data;
          return response.data;
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
      console.log(that.collection);
    });

  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('LoginController', LoginController);

LoginController.$inject = ['GameFactory', '$localStorage'];

  function LoginController(GameFactory, $localStorage) {

    var that = this;

    this.username = null;
    this.storedUsername = $localStorage.username;
    this.message = "";

    this.login = function login() {
      console.log('in login.login before clearing localStorage collection',$localStorage.collection);
      $localStorage.collection = null;
      console.log('in login.login after clearing localStorage collection',$localStorage.collection);
      GameFactory.getUserCollection(that.username)
        .then(function () {
          $localStorage.username = that.username;
          that.message = "You are now logged in.";
        })
        .catch(function () {
          that.message = "Log in failed. Please check your username.";
        });

    };
  }

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$localStorage'];

  function SettingsController($localStorage) {
    this.logout = function logout() {
      $localStorage.username = null;
      $localStorage.collection = null;
    };
  }
})();

//# sourceMappingURL=main.js.map