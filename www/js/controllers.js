angular.module('starter.controllers', [])

  .controller('DashCtrl', ['$scope', 'storage', '$mixpanel', 'rfc4122', 'eventService', function ($scope, storage, $mixpanel, rfc4122, eventService) {
    $mixpanel.identify('Magnus');

    var self = this;

    self.init = function () {

      $scope.storage = storage.load();

      var events = $scope.storage.eventList;
      var activities = $scope.storage.activityList;

      for (var i = 0; i < events.length; i++) {
        if (!$scope.storage.activityList[events[i].id].currentEvent) {
          $scope.storage.activityList[[events[i].id]].currentEvent = events[i];
          $scope.storage.activityList[[events[i].id]].count++;
        }else{
          $scope.storage.activityList[[events[i].id]].count++;
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


    $scope.toggleEvent = function(activity){
      if(activity.currentEvent){
        $scope.deleteEvent(activity.currentEvent.uuid);
      }else{
        $scope.addEvent(activity);
      }
    };

    // adds event to event list
    $scope.addEvent = function (activity) {
      eventService.createEvent(activity);
    };

    // removes event from event list
    $scope.deleteEvent = function (eventUUID) {
      eventService.removeEvent(eventUUID);
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

      $scope.myStorage = storage.load();

      // add data for history events
      $scope.eventHistory = $scope.myStorage.eventList;

      // create object for stats
      $scope.pileStats = [];
      for (var activity in $scope.myStorage.activityList) {
        if ($scope.myStorage.activityList[activity].active == true) {

          var count = 0;
          for (var a = 0; a < $scope.eventHistory.length; a++) {
            if ($scope.myStorage.activityList[activity].id == $scope.eventHistory[a].id) {
              count++;
            }
          }
          // add plied data to stat obejct
          $scope.pileStats.push({
            label: $scope.myStorage.activityList[activity].name,
            value: count
          });
        }
      }

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


