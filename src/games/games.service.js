/**
 * This service handles all of the http requests to the BGG servers.
 * It also tracks login state.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .factory('GameFactory', GameFactory);

  GameFactory.$inject = ['$http', '$q', '$localStorage'];

  function GameFactory($http, $q, $localStorage) {

    return {
      getUserCollection: getUserCollection,
      searchForGame: searchForGame,
      findThreeMostPopular: findThreeMostPopular,
      amILoggedIn: amILoggedIn,
      logOut: logOut
    };

    /**
     * This function takes in a BGG username and performs n http request to
     * the BGG servers to retrieve that user's collection. It follows these steps:
     * 1. First it checks to see if the user's collection is stored in local storage
     * 			If it is, it returns the collection from local storage in a promise.
     * 2. If the local storage collection is empty it makes a request to the
     * 			BGG servers asking to GET the user's collection.
     * 3. BGG responds with very messy data so the transformResponse header
     * 			cleans things up to make them more useable on this end.
     * 4. Sometimes the BGG server will take the request and backlog it for later
     * 			fulfillment. When this happens the user is notified in the message
     * 			of a returned promise.
     * 5. Next this function runs 'buildGenreArray' to create an array of all
     * 			included genres.
     * 6. Finally, the function returns a promise which contains the collection.
     * @param  {String} username Boardgamegeek.com user name
     * @return {Promise}         Collection from localStorage
     * @return {Promise}         Rejected promise with message
     * @return {Promise}         Collection from BGG
     */
    function getUserCollection(username) {
      if ($localStorage.collection){
        var def = $q.defer();
        var collection = angular.copy($localStorage.collection);
        def.resolve(collection);
        buildGenreArray(collection);
        return def.promise;
      } else {
        return $http({
          method: 'GET',
          url: 'http://gametableproxy.herokuapp.com/api/v1/collection?username=' + username + '&stats=1&excludesubtype=boardgameexpansion&own=1',
          transformResponse: function prettifyCollectionArray(response) {
            var parsedResponse = JSON.parse(response);
            if (typeof parsedResponse.message === 'string') {
              return 'in queue';
            }
            var prettyCollectionArray = [];
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

    /**
     * This function is called when the user enters a search for a new game. It
     * performs the following:
     * 1. It takes spaces out of the search string.
     * 2. It makes an http GET request to the BGG servers.
     * 3. If the data that is returned is an error message because too many results
     * 			were returned, it returns a promise and notifies the user with a message.
     * 4. The list of search results is then reduced to a list of item IDs because
     * 			the search results do not include all of the data needed.
     * 5. The array of IDs is then turned into a string and is included in
     * 			another http GET request to BGG. This time the request asks for all
     * 			of items by ID.
     * 6. The response data from this request is also messy so it is prettified
     * 			for our uses.
     * 7. Finally, the search results are returned in a promise.
     * @param  {String} title Search query from input field
     * @return {Promise}      Contains the results or else an error message.
     */
    function searchForGame(title) {
      var cleanTitle = title.replace(/\s/,'+');
      return $http({
        method: 'GET',
        url: 'http://gametableproxy.herokuapp.com/api/v1/search?query=' + cleanTitle,
        transformResponse: function prettifySearchResults(response, headersGetter, status) {
          var parsedResponse;
          try {
            parsedResponse = JSON.parse(response);
            if (!parsedResponse) {
              var e = new Error("invalid data from server");
              e.status = status;
              return e;
            }
          } catch (e) {
            return "invalid data from server";
          }
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
          url: 'http://gametableproxy.herokuapp.com/api/v1/thing?id=' + listOfIds + '&stats=1',
          transformResponse: function prettifyFullSearchResults(response) {
            var parsedResponse = JSON.parse(response);
            var prettyFullSearchArray = [];
            parsedResponse.items.item.forEach(function (each) {
              var prettyFullSearchItem = {};
              prettyFullSearchItem.objectID = each.$.id;
              prettyFullSearchItem.name = (each.name && each.name[0].$.value) || "unnamed";
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
                max: (each.maxplayers && parseInt(each.maxplayers[0].$.value)) || 10,
                min: (each.minplayers && parseInt(each.minplayers[0].$.value)) || 1
              };
              prettyFullSearchItem.playTime = {
                max: (each.maxplaytime && parseInt(each.maxplaytime[0].$.value)) || 60,
                min: (each.minplaytime && parseInt(each.minplaytime[0].$.value)) || 1
              };
              prettyFullSearchItem.rating = {
                myRating: 10,
                userAverage: (each.statistics && parseInt(each.statistics[0].ratings[0].average[0].$.value)) || 0,
                userRatings: (each.statistics && parseInt(each.statistics[0].ratings[0].usersrated[0].$.value)) || 0,
                geekRating: (each.statistics && parseInt(each.statistics[0].ratings[0].bayesaverage[0].$.value)) || 0
              };
              prettyFullSearchItem.numberOwned = (each.statistics && parseInt(each.statistics[0].ratings[0].owned[0].$.value)) || 0;
              prettyFullSearchItem.rank = {};
              prettyFullSearchItem.genres = [];
              if (each.statistics[0].ratings[0].ranks[0].rank.length) {
                each.statistics[0].ratings[0].ranks[0].rank.forEach(function (rank) {
                  prettyFullSearchItem.rank[rank.$.name] = rank.$.value;
                  prettyFullSearchItem.genres.push(rank.$.name);
                });
              }
              prettyFullSearchArray.push(prettyFullSearchItem);
            });
            return prettyFullSearchArray;
          }
        });
      }).then(function (response) {
        return response.data;
      });
    }

    /**
     * This function is called after the search results are returned.
     * It finds the three games in the array that are owned by the most people.
     * @param  {Array} gameArray Array of games
     * @return {Array}           Array of the 3 most popular games from the list.
     */
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

    /**
     * This function is called whenever a controller needs to confirm login status.
     * @return {Boolean} Boolean indicating login status.
     */
    function amILoggedIn() {
      return !!$localStorage.collection;
    }

    /**
     * This function is called in order to log out of the app.
     * It clears the username and the collection from localStorage.
     * // TODO: Should I clear out genreArray too?
     */
    function logOut() {
      $localStorage.username = null;
      $localStorage.collection = null;
      $localStorage.filterSet = null;
    }

    /**
     * This function is called by getUserCollection.
     * It takes in an array of games and finds all of the unique genres so that
     * the list of genres can be used in the select menu.
     * @param  {Array} gameArray Array of games
     */
    function buildGenreArray(gameArray) {
      $localStorage.genreArray = [];
      gameArray.forEach(function (each) {
        each.genres.forEach(function (genre) {
          if($localStorage.genreArray.indexOf(genre) < 0){
            $localStorage.genreArray.push(genre);
          }
        });
      });
      var prettyGenreArray = [];
      $localStorage.genreArray.forEach(function prettifyGenreNames(each) {
        if (each === 'boardgame') {
          var nothing = 'nothing';
          nothing = 'still nothing';
        } else if (each === 'cgs') {
          prettyGenreArray.push({
            prettyName: 'card',
            originalName: each
          });
        } else if (each === 'childrensgames') {
          prettyGenreArray.push({
            prettyName: "children's",
            originalName: each
          });
        } else if(each.indexOf('game') > 0){
          var startOfGame = each.indexOf('game');
          var stringLength = each.length;
          var lettersToKeep = stringLength - (stringLength - startOfGame);
          prettyGenreArray.push({
            prettyName: each.substr(0, lettersToKeep),
            originalName: each
          });
        } else{
          prettyGenreArray.push({
            prettyName: each,
            originalName: each
          });
        }
      });
      $localStorage.genreArray = prettyGenreArray;
    }


  }
})();
