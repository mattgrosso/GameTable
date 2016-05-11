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
    .filter('gameFilter', function () {
      return function gameFilter(input, players, duration, genre) {
        players = Number(players) || null;
        duration = Number(duration) || null;
        return input.filter(function (each) {
          var include = true;
          if(players && (players < each.playerCount.min || players > each.playerCount.max)){
            include = false;
          }
          if(duration && duration > each.playTime){
            include = false;
          }
          if(genre){
            include = each.genres.indexOf(genre) > -1;
          }
          return include;
        });
      };
    });

})();

(function() {
  'use strict';

  angular
    .module('game')
    .controller('ChooserController', ChooserController);

  ChooserController.$inject = ['GameFactory'];

  function ChooserController(GameFactory) {
    var that = this;
    this.collection = [];
    this.players = "";
    this.duration = "";
    this.genre = "";

    GameFactory.getUserCollection().then(function (collection) {
      that.collection = collection;
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
      console.log('Im in games.service.js');
      if ($localStorage.collection){
        var def = $q.defer();
        def.resolve($localStorage.collection);
        return def.promise;
      } else {
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username + '&stats=1',
          transformResponse: function prettifyCollectionArray(response) {
            var parsedResponse = JSON.parse(response);
            var prettyCollectionArray = [];
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
              gameObject.playerCount = {
                max: each.stats[0].$.maxplayers,
                min: each.stats[0].$.minplayers
              };
              gameObject.playTime = each.stats[0].$.playingtime;
              gameObject.rating = {
                myRating: each.stats[0].rating[0].$.value,
                userAverage: each.stats[0].rating[0].average[0].$.value,
                userRatings: each.stats[0].rating[0].usersrated[0].$.value,
                geekRating: each.stats[0].rating[0].bayesaverage[0].$.value,
              };
              gameObject.rank = {};
              gameObject.genres = [];
              each.stats[0].rating[0].ranks[0].rank.forEach(function (rank) {
                gameObject.rank[rank.$.name] = rank.$.value;
                gameObject.genres.push(rank.$.name);
              });
              prettyCollectionArray.push(gameObject);
            });
            return prettyCollectionArray;
          }
        }).then(function successGetUserCollection(response) {
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
      $localStorage.collection = null;
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