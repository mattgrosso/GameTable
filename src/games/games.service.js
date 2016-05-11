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
          url: 'http://mattgrosso.herokuapp.com/api/v1/collection?username=' + username + '&stats=1',
          transformResponse: function prettifyCollectionArray(response) {
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
              each.stats[0].rating[0].ranks[0].rank.forEach(function (rank) {
                gameObject.rank[rank.$.name] = rank.$.value;
              });
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
