(function() {
  'use strict';

  var assert = chai.assert;

  suite('header controller', function () {

    var headerController;
    var $rootScope;
    var mockGameFactory = {};

    setup(module('game'));

    setup(module (function ($provide) {
      $provide.value('GameFactory', mockGameFactory);
    }));

    setup(inject(function ($controller, $q, _$rootScope_) {
      $rootScope = _$rootScope_;
      mockGameFactory.amILoggedIn = function () {
        return true;
      };
      headerController = $controller('HeaderController');
    }));

    test('sanity check', function (){
      assert.strictEqual(headerController.loggedIn, mockGameFactory.amILoggedIn, 'loggedIn function exists');
    });

  });
})();
