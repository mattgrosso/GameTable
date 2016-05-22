(function() {
  'use strict';

  angular
    .module('game')
    .directive('popUpNote', popUpNote);

  function popUpNote() {
    return {
      restrict: 'A',
      template: '',
      link: function renderPopUp(scope, element, attrs) {
        element.click(function() {
          element.after('<div class="vote-popup"><div>' + attrs.popUpNote + '</div></div>');
          setTimeout(function () {
            $('.vote-popup').remove();
          }, 500);
        });
      }
    };
  }

})();
