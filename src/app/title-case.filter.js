(function() {
  'use strict';

  angular
    .module('game')
    // This filter was lifted from http://ng.malsup.com/#!/titlecase-filter.
    .filter('titleCase', function () {
      return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
      };
    });

})();
