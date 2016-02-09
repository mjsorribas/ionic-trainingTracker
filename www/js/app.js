var eventModule = angular.module('eventModule', []);
var miscModule = angular.module('miscModule', []);


angular.module('starter', [
    'ionic',
    'starter.controllers',
    'starter.services',
    'ng-fusioncharts',
    'angularMoment',
    'eventModule',
    'miscModule',
    'analytics.mixpanel',
    'uuid',
    'angular-svg-round-progress'

  ])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(['$mixpanelProvider', function ($mixpanelProvider) {


    $mixpanelProvider.apiKey('f0d63d355d19be29863a7de93aff8bbb'); // your token is different than your API key

    /*
     $mixpanelProvider.superProperties({
     someProp: true,
     anotherOne: [1,2,3]
     });
     */
  }])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.stats', {
        url: '/stats',
        views: {
          'tab-stats': {
            templateUrl: 'templates/tab-stats.html',
            controller: 'StatCtrl'
          }
        }
      })
      .state('tab.trackings', {
        url: '/trackings',
        views: {
          'tab-trackings': {
            templateUrl: 'templates/tab-trackings.html',
            controller: 'TrackingCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

  })
  .run(function (amMoment, rfc4122, localStorageService, $mixpanel) {

    if (!localStorageService.load('userUUID')) {
      localStorageService.save('userUUID', rfc4122.v4());
    } else {
      $mixpanel.identify(localStorageService.load('userUUID'));
    }
    amMoment.changeLocale('sv');
  });
