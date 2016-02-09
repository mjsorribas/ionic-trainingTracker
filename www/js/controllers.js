angular.module('starter.controllers', [])

  .controller('DashCtrl', ['$scope', 'storage', '$mixpanel', 'rfc4122', 'eventService', '$interval', '$ionicPopup', function ($scope, storage, $mixpanel, rfc4122, eventService, $interval, $ionicPopup) {

    var self = this;

    self.init = function () {

      $mixpanel.track("Viewing dashboard");

      $scope.storage = storage.load();

      var events = $scope.storage.eventList;
      var activities = $scope.storage.activityList;

      for (var i = 0; i < events.length; i++) {


        var currentEvent = events[i];
        var activity = $scope.storage.activityList[events[i].id];

        if (moment(currentEvent.nextDate).isAfter(new Date())) {
          if (!activity.currentEvent) {
            activity.currentEvent = currentEvent;
            activity.count++;
          } else {
            activity.count++;
          }
        }


        /*
         if (!$scope.storage.activityList[events[i].id].currentEvent) {
         $scope.storage.activityList[[events[i].id]].currentEvent = events[i];
         $scope.storage.activityList[[events[i].id]].count++;
         }else{
         $scope.storage.activityList[[events[i].id]].count++;
         }
         */

      }

    };

    self.init();


    $interval(function () {
      $scope.currentDate = new Date();
      for(var activity in $scope.storage.activityList){
        if($scope.storage.activityList[activity].currentEvent){
          if(moment($scope.storage.activityList[activity].currentEvent.nextDate).isBefore(new Date())){
            delete $scope.storage.activityList[activity].currentEvent;
          }
        }
      }
    }, 1000);




    $scope.$on("$ionicView.beforeEnter", function (event) {
      self.init();
    });


    $scope.runMe = function () {
      alert(1);
    };

    $scope.currentTime = function () {
      return new Date();
    };

    $scope.$on('myStorage', function () {
      self.init();
    });


    $scope.toggleEvent = function (activity) {
      if (activity.currentEvent) {
        $scope.showConfirm(activity);
      } else {
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

    $scope.showConfirm = function(activity) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Reset timer',
        template: 'Are you sure you want to reset the timer?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $scope.deleteEvent(activity.currentEvent.uuid);
        } else {

        }
      });
    };


    $scope.doRefresh = function () {
      self.init();
      $scope.$broadcast('scroll.refreshComplete');
    };

  }])
  .controller('TrackingCtrl', ['$scope', 'storage', 'eventService', '$mixpanel', function ($scope, storage, eventService, $mixpanel) {

    var self = this;

    self.init = function () {
      $scope.activityList = eventService.getActivityList();
    };
    self.init();

    $scope.$on('myStorage', function () {
      self.init();
    });

    $scope.updateEvent = function (updatedList) {
      $mixpanel.track("Updating trackings");
      eventService.saveActivityList(updatedList);
    }

  }])

  .controller('StatCtrl', ['$scope', 'storage', '$mixpanel', function ($scope, storage, $mixpanel) {

    var self = this;

    $scope.events = {};

    self.init = function () {

      $mixpanel.track("Viewing stats");

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
          //theme: "carbon"
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


