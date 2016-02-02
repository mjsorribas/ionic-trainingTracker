angular.module('starter.controllers', [])

  .controller('DashCtrl', ['$scope', 'storage', '$mixpanel', 'rfc4122', function ($scope, storage, $mixpanel, rfc4122) {
    $mixpanel.identify('Magnus');

    var self = this;

    self.init = function () {

      $scope.myStorage = storage.load();

      // sort eventList by date, latest date first

      // loop throug activityList and for each activity:
      for (var i = 0; i < $scope.myStorage.activitylist.length; i++) {
        for (var j = 0; j < $scope.myStorage.eventList.length; j++) {

          // find latest event
          // add that even to the activity as .currentEvent.
          if ($scope.myStorage.activitylist[i].id == $scope.myStorage.eventList[j].id) {

            var event = $scope.myStorage.eventList[j];

            // if the event timeLimit is over, remove the nextTime parameter.
            if (moment(event.nextDate).isBefore(new Date())) {
              delete event.nextDate;
            }
            $scope.myStorage.activitylist[i].currentEvent = event;
            break;
          }
        }
      }

    };


    $scope.currentTime = function () {
      return new Date();
    };


    $scope.$on('myStorage', function () {
      self.init();
    });
    self.init();


    // adds event to event list
    $scope.addEvent = function (eventType) {

      var newEvent = angular.copy(eventType);

      newEvent.uuid = rfc4122.v4();
      newEvent.date = new Date();
      newEvent.nextDate = moment(eventType.date).add(newEvent.timeLimit, 'hours');
      $scope.myStorage.eventList.push(newEvent);
      storage.update($scope.myStorage);
    };

    // removes event from event list
    $scope.removeEvent = function (activity) {
      $scope.myStorage = storage.load();

      for (var i = 0; i < $scope.myStorage.eventList.length; i++) {
        if (activity.currentEvent.uuid == $scope.myStorage.eventList[i].uuid) {
          $scope.myStorage.eventList.splice(i, 1);
        }
      }
      for (var i = 0; i < $scope.myStorage.activitylist.length; i++) {
        if (activity.id == $scope.myStorage.activitylist.id) {
          delete $scope.myStorage.activitylist.currentEvent;
        }
      }
      storage.update($scope.myStorage);
    };


    $scope.doRefresh = function () {
      self.init();
      $scope.$broadcast('scroll.refreshComplete');
    };

  }])
  .controller('TrackingCtrl', ['$scope', 'storage', 'eventModel', function ($scope, storage, eventModel) {

    var self = this;

    self.init = function () {
      $scope.myStorage = storage.load();
    };
    $scope.$on('myStorage', function () {
      self.init();
    });
    self.init();

    $scope.updateEvent = function () {
      storage.update($scope.myStorage);
    }

  }]).controller('StatCtrl', ['$scope', 'storage', 'eventModel', function ($scope, storage, eventModel) {

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

