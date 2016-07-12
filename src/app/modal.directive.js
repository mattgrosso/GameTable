/**
 * This directive creates a modal popup window for messages to the user.
 */
(function() {
  'use strict';

  angular
    .module('game')
    .directive('modal', Modal);

  function Modal() {

    return {
      restrict: 'E',
      templateUrl: '/app/modal.template.html',
      link: setup,
      transclude: true,
      scope: {
        show: '=show',
        close: '&close'
      }
    };

    function setup(scope) {
      scope.$watch(function () {
        return scope.show;
      }, function (value) {
        if (value) {
          $(window).scrollTop(0);
          angular.element('body').addClass('freeze-scrolling');
        } else {
          angular.element('body').removeClass('freeze-scrolling');
        }
      });
    }
  }



})();
