angular.module('starter.controllers', [])

  .controller('DashCtrl', ['$scope', 'storage', '$mixpanel', 'rfc4122', 'eventService', function ($scope, storage, $mixpanel, rfc4122, eventService) {
    $mixpanel.identify('Magnus');

    var self = this;

    self.init = function () {

      $scope.storage = storage.load();
      for(var i = 0; i < $scope.storage.activityList.length; i++){

        // if activity is inactive skip it
        if($scope.storage.activityList.active == false){
          continue;
        }

        for(var j = 0; j < $scope.storage.eventList.length; j++){
          if($scope.storage.activityList.id == $scope.storage.eventList.id){
            $scope.storage.activityList[i].currentEvent = $scope.storage.eventList[j];
          }
        }

      }

    };

    self.init();

    $scope.currentTime = function () {
      return new Date();
    };

    $scope.$on('myStorage', function () {
      self.init();
    });


    // adds event to event list
    $scope.addEvent = function (eventType) {
      eventService.createEvent(eventType.id, new Date());
    };

    // removes event from event list
    $scope.removeEvent = function (currentEvent) {
      eventService.removeEvent(currentEvent);
    };


    $scope.doRefresh = function () {
      self.init();
      $scope.$broadcast('scroll.refreshComplete');
    };

  }])
  .controller('TrackingCtrl', ['$scope', 'storage', 'eventService', function ($scope, storage, eventService) {

    var self = this;

    self.init = function () {
      $scope.activityList = eventService.getActivityList();
      console.log($scope.activityList);
    };
    self.init();

    $scope.$on('myStorage', function () {
      self.init();
    });

    $scope.updateEvent = function (updatedList) {
      eventService.saveActivityList(updatedList);
    }

  }])

  .controller('StatCtrl', ['$scope', 'storage', function ($scope, storage) {

    var self = this;

    $scope.events = {};

    self.init = function () {
      var load = storage.load();

      $scope.eventHistory = load.eventList;


      for (var i = 0; i < load.activitylist.length; i++) {
        $scope.events[load.activitylist[i].id] = [];
      }

      for (var j = 0; j < load.eventList.length; j++) {
        for (var activityCategory in $scope.events) {
          if (load.eventList[j].id == activityCategory) {
            $scope.events[activityCategory].push(load.eventList[j]);
          }
        }
      }
      console.log($scope.events);


      // prepp data for statsview
      $scope.pileStats = [];
      for (var arry in $scope.events) {

        if (!$scope.events[arry][0]) {
          continue;
        }

        $scope.pileStats.push(
          {
            label: $scope.events[arry][0].name,
            value: $scope.events[arry].length
          }
        );
      }
      console.log($scope.pileStats);


      $scope.myDataSource = {
        chart: {
          caption: "",
          subCaption: "",
          numberPrefix: "",
          theme: "carbon"
        },
        data: $scope.pileStats
      };

    };

    $scope.$on('myStorage', function () {
      self.init();
    });

    self.init();

    $scope.doRefresh = function () {
      self.init();
      $scope.$broadcast('scroll.refreshComplete');
    };


  }]);

