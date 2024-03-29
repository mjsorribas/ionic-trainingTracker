eventModule.factory('storage', ['localStorageService', '$mixpanel', function (localStorageService, $mixpanel) {

  var self = this;

  var storage = {
    load: function () {
      var myStorage = localStorageService.load('myStorage');
      if (typeof myStorage == 'undefined') {
        myStorage = {
          eventList: []
        }
      }
      return myStorage;
    },
    update: function (storage) {
      localStorageService.save('myStorage', storage, true);
    }
  };
  return storage;

}]).factory('eventService', ['rfc4122', 'storage', 'localStorageService', '$mixpanel', function (rfc4122, storage, localStorageService, $mixpanel) {

  var self = this;
  self.presetActivies = {
    'eatingday': {
      id: 'eatingday',
      name: 'Eating what ever, day!',
      description: 'Fördelen jag ser av att ha en ätardag är att jag blir mer motiverad av att äta bra under 6 dagar innan jag får äta något gott på dag 7. Då har jag alltid något att se fram emot och när jag väl äter den onyttiga maten eller godiset kommer jag med största sannolikhet att äta betydligt mindre av det än om jag hade ätit det oftare.',
      active: false,
      count: 0,
      timeLimit: 691200,
      currentEvent: undefined
    },
    'back': {
      id: 'back',
      name: 'Back breaker!',
      description: 'Starka ryggmuskler och god rörlighet i ryggraden förebygger ryggont och förbättrar din hållning. Det är viktigt att träna både styrka och rörlighet för ryggen.',
      active: false,
      count: 0,
      timeLimit: 172800,
      currentEvent: undefined
    },
    'chest': {
      id: 'chest',
      name: 'Chest pump!',
      description: ' Det är bättre att köra med lite lättare vikter och ha kontroll genom övningen, än att köra för tungt. Träna igenom hela bröstet, var otroligt noga med tekniken och höj successivt vikterna. Då kommer också resultaten.',
      active: false,
      count: 0,
      timeLimit: 172800,
      currentEvent: undefined
    },
    'shoulders': {
      id: 'shoulders',
      name: 'Burning shoulders!',
      description: 'Att värma upp axlarna är oerhört viktigt men framförallt är det rotatorcuffen vi vill ska bli ordentligt uppvärmd. I din axel sitter en kulled som hålls på plats i en sockel av 4 små muskler.',
      active: false,
      count: 0,
      timeLimit: 172800,
      currentEvent: undefined
    },
    'arms': {
      id: 'arms',
      name: 'Iron arms!',
      description: 'Börja med att göra övningarna två gånger i veckan och ha som mål att öka till tre. Du kan välja att göra tre av övningarna, en för varje muskel, ena gången och de andra tre nästa gång. Gör så många repetitioner du orkar och sedan några till. Set och siffror är inte så viktigt, det viktiga är att du gör det. På bara tre veckor ser du skillnad.',
      active: false,
      count: 0,
      timeLimit: 172800,
      currentEvent: undefined
    },
    'legs': {
      id: 'legs',
      name: 'Power legs!',
      description: 'När du tränar dina ben så kommer produktionen av tillväxthormon och testosteron öka markant. Detta bidrar till ökad tillväxt på övriga delar av kroppen också. Därför är det viktigt att du regelbundet styrketränar dina ben. Även om det inte gillas så kommer din kropp belöna dig med en snabb viktuppgång.',
      active: false,
      count: 0,
      timeLimit: 172800,
      currentEvent: undefined
    },
    'cardio': {
      id: 'cardio',
      name: 'Sweaty cardio!',
      description: 'Basket uppfanns 1891 av den kanadensiske KFUM-tränaren James Naismith. Idag hör den till de mest utövade sporterna över hela världen och i USA är den av särskilt stor betydelse. Vart fjärde år spelas ett världsmästerskap i basket, arrangerat av internationella basketfederationen, Fédération Internationale de Basketball.',
      active: false,
      count: 0,
      timeLimit: 172800,
      currentEvent: undefined
    }

  };
  function Event(id, uuid, name, description, date, timeLimit) {
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.date = date;
    this.timeLimit = timeLimit;
  }

  var eventService = {
    getActivityList: function () {
      var myStorage = storage.load();

      if (!myStorage.activityList) {
        myStorage.activityList = self.presetActivies;
        storage.update(myStorage);
      }

      if (Object.keys(myStorage.activityList).length != Object.keys(self.presetActivies).length) {
        myStorage.activityList = self.presetActivies;
        for (var i in myStorage.activityList) {
          myStorage.activityList[i].active = true;
        }
        storage.update(myStorage);
      }

      return myStorage.activityList;

    },
    saveActivityList: function (updatedList) {
      var myStorage = storage.load();
      myStorage.activityList = updatedList;
      storage.update(myStorage);
    },
    createEvent: function (activity) {

      var myStorage = localStorageService.load('myStorage');

      var event = new Event(
        myStorage.activityList[activity.id].id,
        rfc4122.v4(),
        myStorage.activityList[activity.id].name,
        myStorage.activityList[activity.id].description,
        new Date(),
        myStorage.activityList[activity.id].timeLimit
      );
      event.nextDate = moment(event.date).add(event.timeLimit, 'seconds').startOf('day');
      myStorage.eventList.push(event);
      storage.update(myStorage);
      $mixpanel.track("Event created", {
        "Activity": activity.id,
        uuid: event.uuid
      });

      return event;
    },
    removeEvent: function (eventUUID) {
      var myStorage = storage.load();
      console.log('before remove', myStorage.eventList);
      for (var i = 0; i < myStorage.eventList.length; i++) {

        if (myStorage.eventList[i]['uuid'] == eventUUID) {

          $mixpanel.track("Event aborted", {
            "Activity": myStorage.eventList[i]['id'],
            uuid : myStorage.eventList[i]['uuid']
          });

          console.log('object to track', myStorage.eventList[i]['id'], myStorage.eventList[i]['uuid'])

          myStorage.eventList.splice(i, 1);

        }
      }

      storage.update(myStorage);
    }
  };
  return eventService;

}]);
