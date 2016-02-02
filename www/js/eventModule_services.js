eventModule.factory('eventModule_service', ['localStorageService', 'eventModel', function (localStorageService, eventModel) {

  var self = this;

  var eventModule_service = {
    /*
    initEventList: function () {
      var activeList = eventModel.getActivities();
      self.myStorage.activeList = activeList.activities;
      this.initStored();
      return self.myStorage;
    },
    storeEvent: function (eventType) {

      eventType.date = new Date();
      self.myStorage.storedEvents.push(eventType);
      localStorageService.save('storedEvents', self.myStorage, false);
    },
    initStored: function () {
      var storage = localStorageService.load('storedEvents');
      if (typeof storage != 'undefined' && typeof storage.storedEvents != 'undefined') {
        self.myStorage.storedEvents = storage.storedEvents;
        isExersiceActiveAndHasCout(self.myStorage.activeList, self.myStorage.storedEvents);
      }
    }
    */

  };

  return eventModule_service;

}]);
/*

function isExersiceActiveAndHasCout(activityList, eventList) {
  for (var i = 0; i < activityList.length; i++) {
    for (var j = 0; j < activities.length; j++) {
      if(activityList[i].id == activities[j].id){
        console.log(activityList[i]);
        activityList[i].count++;
        activityList[i].date = activities[j].date;
      }
    }
  }
}


*/
