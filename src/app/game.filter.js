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
          if(duration && duration < 5){
            if((duration*60) < ((each.playTime.min + each.playTime.max)/2)){
              include = false;
            }
          }
          if(duration && duration >= 5){
            if(duration < ((each.playTime.min + each.playTime.max)/2)){
              include = false;
            }
          }          
          if(include && genre){
            include = each.genres.indexOf(genre.toLowerCase()) > -1;
          }
          return include;
        });
      };
    });

})();
