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
          buildGenreArray(response.data);
          $localStorage.collection = response.data;
          console.log(response.data);
          console.log($localStorage.genreArray);
          return response.data;
        });
      }
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

  }


})();
