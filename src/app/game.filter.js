/**
 * This is a filter which checks the full list against the criteria in the input fields.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .filter('gameFilter', function () {
      return function gameFilter(input, players, duration, genre, rating) {
        players = Number(players) || null;
        // duration = Number(duration) || null;
        return input.filter(function (each) {
          var include = true;
          if(players && (players < each.playerCount.min || players > each.playerCount.max)){
            include = false;
          }
          if(duration && typeof Number(duration) === 'number' && Number(duration) < 5){
            if((Number(duration)*60) < ((each.playTime.min + each.playTime.max)/2)){
              include = false;
            }
          }
          if(duration && typeof Number(duration) === 'number' && Number(duration) >= 5){
            if(Number(duration) < ((each.playTime.min + each.playTime.max)/2)){
              include = false;
            }
          }
          if(duration && isNaN(Number(duration)) && duration.includes('-')) {
            var durationWithoutSpaces = duration.split(' ').join('');
            var durationRangeArray = durationWithoutSpaces.split('-');
            var minDuration = 0;
            var maxDuration = 0;

            durationRangeArray.forEach(function findMinMax(each) {
              if(Number(each) < minDuration || minDuration === 0){
                minDuration = Number(each);
              }
              if (Number(each) > maxDuration || minDuration === 0) {
                maxDuration = Number(each);
              }
            });

            if (minDuration > ((each.playTime.min + each.playTime.max)/2) || maxDuration < ((each.playTime.min + each.playTime.max)/2)) {
              include = false;
            }
          }
          if(include){
            var tempInclude = false;
            each.genres.forEach(function checkGenresAgainstGenre(everyGenre) {
              genre.forEach(function (eachGenre) {
                if (eachGenre.originalName === everyGenre) {
                  tempInclude = true;
                }
              });
            });
            if (each.genres.length === 1 && each.genres[0] === 'boardgame') {
              tempInclude = true;
            }
            include = tempInclude;
          }
          if (rating && ((each.rating.myRating > 0 && rating > each.rating.myRating) || (each.rating.myRating === 0 && rating > each.rating.geekRating))) {
            include = false;
          }
          return include;
        });
      };
    });

})();
