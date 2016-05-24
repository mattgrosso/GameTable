(function() {
  'use strict';

  angular
    .module('game')
    .factory('GameFactory', GameFactory);

  GameFactory.$inject = ['$http', '$q', '$localStorage'];

  function GameFactory($http, $q, $localStorage) {

    var genreArray = [];

    return {
      getUserCollection: getUserCollection,
      searchForGame: searchForGame,
      findThreeMostPopular: findThreeMostPopular,
      amILoggedIn: amILoggedIn,
      logOut: logOut
    };

    function getUserCollection(username) {
      if ($localStorage.collection){
        var def = $q.defer();
        var collection = angular.copy($localStorage.collection);
        def.resolve(collection);
        buildGenreArray(collection);
        console.log(collection);
        return def.promise;
      } else {
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username + '&stats=1&excludesubtype=boardgameexpansion&own=1',
          transformResponse: function prettifyCollectionArray(response) {
            var parsedResponse = JSON.parse(response);
            console.log(parsedResponse);
            if (typeof parsedResponse.message === 'string') {
              return 'in queue';
            }
            var prettyCollectionArray = [];
            console.log(parsedResponse.items.item);
            parsedResponse.items.item.forEach(function (each) {
              var gameObject = {};
              gameObject.objectID = each.$.objectid;
              gameObject.name = (each.name && each.name[0]._) || "unnamed";
              gameObject.type = each.$.subtype;
              gameObject.image = {
                imageURL: (each.image && each.image[0]) || "",
                thumbnailURL: (each.thumbnail && each.thumbnail[0]) || ""
              };
              if (each.status && each.status[0]) {
                gameObject.status = {
                  forTrade: each.status[0].$.fortrade,
                  own: each.status[0].$.own,
                  previouslyOwn: each.status[0].$.prevowned,
                  wantInTrade: each.status[0].$.want
                };
              } else {
                gameObject.status = {
                  forTrade: "0",
                  own: "1",
                  previouslyOwn: "0",
                  wantInTrade: "0"
                };
              }
              gameObject.year = (each.yearpublished && parseInt(each.yearpublished[0])) || 0;
              gameObject.playerCount = {
                max: (each.stats && parseInt(each.stats[0].$.maxplayers)) || 10,
                min: (each.stats && parseInt(each.stats[0].$.minplayers)) || 1
              };
              gameObject.playTime = {
                max: (each.stats && parseInt(each.stats[0].$.maxplaytime)) || 60,
                min: (each.stats && parseInt(each.stats[0].$.minplaytime)) || 1
              };
              gameObject.rating = {
                myRating: (each.stats[0].rating && parseInt(each.stats[0].rating[0].$.value)) || 0,
                userAverage: (each.stats[0].rating && parseInt(each.stats[0].rating[0].average[0].$.value)) || 0,
                userRatings: (each.stats[0].rating && parseInt(each.stats[0].rating[0].usersrated[0].$.value)) || 0,
                geekRating: (each.stats[0].rating && parseInt(each.stats[0].rating[0].bayesaverage[0].$.value)) || 0
              };
              gameObject.rank = {};
              gameObject.genres = [];
              if (each.stats[0].rating[0].ranks[0].rank.length) {
                each.stats[0].rating[0].ranks[0].rank.forEach(function (rank) {
                  gameObject.rank[rank.$.name] = rank.$.value;
                  gameObject.genres.push(rank.$.name);
                });
              }
              prettyCollectionArray.push(gameObject);
            });
            return prettyCollectionArray;
          }
        }).then(function successGetUserCollection(response) {
          if (response.data === 'in queue') {
            console.log('in in queue');
            var def = $q.defer();
            var status = {
              status: "in queue",
              message: "BGG is working on it"
            };
            def.reject(status);
            return def.promise;
          }
          buildGenreArray(response.data);
          $localStorage.collection = response.data;
          return response.data;
        });
      }
    }

    function searchForGame(title) {
      var cleanTitle = title.replace(/\s/,'+');
      return $http({
        method: 'GET',
        url: 'http://mattgrosso.herokuapp.com/api/v1/search?query=' + cleanTitle,
        transformResponse: function prettifySearchResults(response) {
          var parsedResponse = JSON.parse(response);
          var prettySearchArray = [];
          parsedResponse.items.item.forEach(function (each) {
            var prettySearchItem = {};
            if(each.$.type === 'boardgame'){
              prettySearchItem.id = each.$.id;
              prettySearchArray.push(prettySearchItem);
            }
          });
          return prettySearchArray;
        }
      }).then(function (response) {
        var listOfIds = "";
        response.data.forEach(function createCommaSeperatedListOfIds(each) {
          if (!listOfIds) {
            listOfIds = each.id;
          } else {
            listOfIds = listOfIds + "," + each.id;
          }
        });
        return $http({
          method: 'GET',
          url: 'http://mattgrosso.herokuapp.com/api/v1/thing?id=' + listOfIds + '&stats=1',
          transformResponse: function prettifyFullSearchResults(response) {
            var parsedResponse = JSON.parse(response);
            var prettyFullSearchArray = [];
            parsedResponse.items.item.forEach(function (each) {
              var prettyFullSearchItem = {};
              prettyFullSearchItem.objectID = each.$.id;
              prettyFullSearchItem.name = each.name[0].$.value;
              prettyFullSearchItem.type = each.$.type;
              prettyFullSearchItem.image = {};
              if (each.image) {
                prettyFullSearchItem.image.imageURL = each.image[0];
              }
              if (each.thumbnail) {
                prettyFullSearchItem.image.thumbnailURL = each.thumbnail[0];
              }
              prettyFullSearchItem.status = {
                forTrade: 0,
                own: 1,
                previouslyOwn: 0,
                wantInTrade: 0
              };
              prettyFullSearchItem.year = parseInt(each.yearpublished[0].$.value);
              prettyFullSearchItem.playerCount = {
                max: parseInt(each.maxplayers[0].$.value),
                min: parseInt(each.minplayers[0].$.value)
              };
              prettyFullSearchItem.playTime = {
                max: parseInt(each.maxplaytime[0].$.value),
                min: parseInt(each.minplaytime[0].$.value)
              };
              prettyFullSearchItem.rating = {
                myRating: 10,
                userAverage: parseInt(each.statistics[0].ratings[0].average[0].$.value),
                userRatings: parseInt(each.statistics[0].ratings[0].usersrated[0].$.value),
                geekRating: parseInt(each.statistics[0].ratings[0].bayesaverage[0].$.value)
              };
              prettyFullSearchItem.numberOwned = parseInt(each.statistics[0].ratings[0].owned[0].$.value);
              prettyFullSearchItem.rank = {};
              prettyFullSearchItem.genres = [];
              each.statistics[0].ratings[0].ranks[0].rank.forEach(function (rank) {
                prettyFullSearchItem.rank[rank.$.name] = rank.$.value;
                prettyFullSearchItem.genres.push(rank.$.name);
              });
              prettyFullSearchArray.push(prettyFullSearchItem);
            });
            return prettyFullSearchArray;
          }
        });
      }).then(function (response) {
        return response.data;
      });
    }

    function findThreeMostPopular(gameArray) {
      var mostPopular = [
        {numberOwned: 0},
        {numberOwned: 0},
        {numberOwned: 0}
      ];
      var trimmedMostPopular = [];
      gameArray.forEach(function (each) {
        if (each.type === 'boardgame') {
          if(each.numberOwned > mostPopular[0].numberOwned){
            mostPopular[2] = mostPopular[1];
            mostPopular[1] = mostPopular[0];
            mostPopular[0] = each;
          } else if (each.numberOwned > mostPopular[1].numberOwned) {
            mostPopular[2] = mostPopular[1];
            mostPopular[1] = each;
          } else if (each.numberOwned > mostPopular[2].numberOwned) {
            mostPopular[2] = each;
          }
        }
      });
      mostPopular.forEach(function (each) {
        if (each.numberOwned > 0) {
          trimmedMostPopular.push(each);
        }
      });
      return trimmedMostPopular;
    }


    function buildGenreArray(gameArray) {
      $localStorage.genreArray = [];
      gameArray.forEach(function (each) {
        each.genres.forEach(function (genre) {
          if($localStorage.genreArray.indexOf(genre) < 0){
            $localStorage.genreArray.push(genre);
          }
        });
      });
      return genreArray;
    }

    function amILoggedIn() {
      return !!$localStorage.collection;
    }

    function logOut() {
      $localStorage.username = null;
      $localStorage.collection = null;
    }

  }
})();
