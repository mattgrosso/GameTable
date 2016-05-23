(function() {
  'use strict';

  var assert = chai.assert;

  suite('login controller', function () {

    var loginController;
    var $rootScope;
    var $httpBackend;
    var mockGameFactory = {};
    var mockLocalStorage = {
      username: null
    };

    setup(module('game'));

    setup(module (function ($provide) {
      $provide.value('GameFactory', mockGameFactory);
      $provide.value('$localStorage', mockLocalStorage);
    }));

    setup(inject(function ($controller, $q, _$rootScope_, _$httpBackend_) {
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', 'chooser/chooser.template.html')
        .respond('');
      mockGameFactory.amILoggedIn = function () {
        return true;
      };
      mockGameFactory.getUserCollection = function (username) {
        var def = $q.defer();

        if(username === 'matt'){
          console.log('username === matt');
          def.resolve({
            status: 'ok'
          });
        } else if (username === 'queue') {
          console.log('username === queue');
          def.reject({
            status: 'in queue'
          });
        } else {
          console.log('else triggered in mockGameFactory.getUserCollection');
          def.reject({
            status: ''
          });
        }
        return def.promise;
      };
      loginController = $controller('LoginController');
    }));

    test('sanity check', function (){
      assert.strictEqual(loginController.loggedIn, mockGameFactory.amILoggedIn, 'loggedIn function exists');
    });

    test('login function works with username', function (){
      assert.strictEqual(loginController.message, '', 'the message starts off correct.');
      assert.strictEqual(loginController.username, null, 'the username starts off null');
      loginController.username = 'matt';
      loginController.login()
        .then(function () {
          assert.strictEqual(loginController.message, 'You are now logged in.', 'the message was updated');
          assert.strictEqual(loginController.username, '', 'the username was updated correctly');
          assert.strictEqual(mockLocalStorage.username, 'matt', 'local storage is storing username');
        });
      $rootScope.$digest();
      $httpBackend.flush();
    });

    test('login function catches properly', function (){
      console.log('in the login testing catches');
      loginController.username = '';
      loginController.login()
        .then(function () {
          console.log('running .then in catch test');
          assert.strictEqual(loginController.message, 'Log in failed. Please check your username.', 'the message is updating');
        });
      $rootScope.$digest();
      $httpBackend.flush();
    });
  });
})();
