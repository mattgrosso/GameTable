(function() {
  'use strict';

  var assert = chai.assert;

  suite('header controller', function () {

    var headerController;
    var $rootScope;
    var mockGameFactory = {};
    var localStorage = {
      username: 'this is a username',
      collection: 'this is a collection'
    };

    setup(module('game'));

    setup(module (function ($provide) {
      $provide.value('GameFactory', mockGameFactory);
    }));

    setup(inject(function ($controller, $q, _$rootScope_) {
      $rootScope = _$rootScope_;
      mockGameFactory.amILoggedIn = function () {
        return true;
      };
      mockGameFactory.logOut = function () {
        localStorage.username = null;
        localStorage.collection = null;
      };
      headerController = $controller('HeaderController');
    }));

    test('sanity check', function (){
      assert.strictEqual(headerController.loggedIn, mockGameFactory.amILoggedIn, 'loggedIn function exists');
    });

    test('logOut function logs out', function () {
      assert.strictEqual(localStorage.username, 'this is a username', 'the variable is set');
      assert.strictEqual(localStorage.collection, 'this is a collection', 'the variable is set');

      headerController.logOut();

      assert.isNull(localStorage.username, 'logOut function sets username to null');
      assert.isNull(localStorage.collection, 'logOut function sets collection to null');

    });

  });
})();
