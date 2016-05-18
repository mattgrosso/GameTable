(function() {
  'use strict';

  angular
    .module('game')
    .directive('popUpNote', popUpNote);

  function popUpNote() {
    return {
      restrict: 'A',
      template: '',
      link: function renderPopUp(scope, element) {
        element.click(function() {
          element.after('<aside class="vote-popup">voted!</aside>');
          setTimeout(function () {
            $('.vote-popup').remove();
          }, 500);
        });
      }
    };
  }

})();
