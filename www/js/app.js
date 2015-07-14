// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function($cordovaLocalNotification, $scope, $ionicPlatform) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    $cordovaLocalNotification.add({ message: 'added lol'});

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.front', {
    url: "/front",
    views: {
      'menuContent': {
        templateUrl: "templates/front.html",
        controller: 'FrontCtrl'
      }
    }
  })

  .state('app.faq', {
    url: "/faq",
    views: {
      'menuContent': {
        templateUrl: "templates/faq.html"
      }
    }
  })

  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html"
      }
    }
  })

  // Declare new abstract using tabs
  .state('sel', {
    url: "/sel",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: 'selFrontCtrl'
  })

  .state('sel.selFront', {
    url: "/selFront",
    views: {
      'selFront': {
        templateUrl: "templates/selFront.html",
        controller: 'selFrontCtrl'
      }
    }
  })

  .state('sel.cStatus', {
    url: "/cStatus",
    views: {
      'cStatus': {
        templateUrl: "templates/cStatus.html",
        controller: 'cStatusCtrl'
      }
    }
  })

  .state('sel.svcStatus', {
    url: "/svcStatus",
    views: {
      'svcStatus': {
        templateUrl: "templates/svcStatus.html",
        controller: 'svcStatusCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/front');
});
