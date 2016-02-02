eventModule.factory('storage', ['localStorageService', '$mixpanel', function (localStorageService, $mixpanel) {

  var self = this;

  var storage = {
    load: function () {
      var myStorage = localStorageService.load('myStorage');
      if(typeof myStorage == 'undefined'){
        myStorage = {
          activityList : [],
          eventList : []
        }
      }
      return myStorage;
    },
    update: function (storage) {
      localStorageService.save('myStorage', storage, true);
    }
  };
  return storage;

}]).factory('eventService', ['rfc4122', 'storage', function (rfc4122, storage) {

  var self = this;
  self.presetActivies = [
    {
      id: 'eatingday',
      name: 'Ätardag',
      description: 'Fördelen jag ser av att ha en ätardag är att jag blir mer motiverad av att äta bra under 6 dagar innan jag får äta något gott på dag 7. Då har jag alltid något att se fram emot och när jag väl äter den onyttiga maten eller godiset kommer jag med största sannolikhet att äta betydligt mindre av det än om jag hade ätit det oftare.',
      active: false,
      count: 0,
      timeLimit: 192
    },
    {
      id: 'snus',
      name: 'Snus',
      description: 'Ta en snus',
      active: false,
      count: 0,
      timeLimit: 1
    },
    {
      id: 'back',
      name: 'Rygg',
      description: 'Starka ryggmuskler och god rörlighet i ryggraden förebygger ryggont och förbättrar din hållning. Det är viktigt att träna både styrka och rörlighet för ryggen.',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'chest',
      name: 'Bröst',
      description: ' Det är bättre att köra med lite lättare vikter och ha kontroll genom övningen, än att köra för tungt. Träna igenom hela bröstet, var otroligt noga med tekniken och höj successivt vikterna. Då kommer också resultaten.',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'shoulders',
      name: 'Axlar',
      description: 'Att värma upp axlarna är oerhört viktigt men framförallt är det rotatorcuffen vi vill ska bli ordentligt uppvärmd. I din axel sitter en kulled som hålls på plats i en sockel av 4 små muskler.',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'arms',
      name: 'Armar',
      description: 'Börja med att göra övningarna två gånger i veckan och ha som mål att öka till tre. Du kan välja att göra tre av övningarna, en för varje muskel, ena gången och de andra tre nästa gång. Gör så många repetitioner du orkar och sedan några till. Set och siffror är inte så viktigt, det viktiga är att du gör det. På bara tre veckor ser du skillnad.',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'legs',
      name: 'Ben',
      description: 'När du tränar dina ben så kommer produktionen av tillväxthormon och testosteron öka markant. Detta bidrar till ökad tillväxt på övriga delar av kroppen också. Därför är det viktigt att du regelbundet styrketränar dina ben. Även om det inte gillas så kommer din kropp belöna dig med en snabb viktuppgång.',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'basket',
      name: 'Baskett',
      description: 'Basket uppfanns 1891 av den kanadensiske KFUM-tränaren James Naismith. Idag hör den till de mest utövade sporterna över hela världen och i USA är den av särskilt stor betydelse. Vart fjärde år spelas ett världsmästerskap i basket, arrangerat av internationella basketfederationen, Fédération Internationale de Basketball.',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'monday',
      name: 'Måndag',
      description: 'Träna Pingis',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'tuesday',
      name: 'Tisdag',
      description: 'Träna Pingis',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'wednesday',
      name: 'Onsdag',
      description: 'Träna Pingis',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'thursday',
      name: 'Torsdag',
      description: 'Träna Pingis',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'friday',
      name: 'Fredag',
      description: 'Träna Pingis',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'saturday',
      name: 'Lördag',
      description: 'Träna Pingis',
      active: false,
      count: 0,
      timeLimit: 48
    },
    {
      id: 'sunday',
      name: 'Söndag',
      description: 'Träna Pingis',
      active: false,
      count: 0,
      timeLimit: 48
    }
  ];

  function Event(id, uuid, name, description, date, timeLimit) {
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.date = date;
    this.timeLimit = timeLimit
  }

  var eventService = {
    getActivityList : function(){
      var myStorage = storage.load();
      if(myStorage.activityList.length == 0){
        myStorage.activityList = self.presetActivies;
        storage.update(myStorage);
      }
      return myStorage['activityList'];
    },
    saveActivityList : function(updatedList){
      var myStorage = storage.load();
      myStorage.activityList = updatedList;
      storage.update(myStorage);
      console.log(myStorage);
    },
    createEvent: function (id, date) {
      for (var i = 0; i < self.presetActivies.length; i++) {
        if (self.presetActivies[i].id = id) {
          var activity = self.presetActivies[i];
          var event = new Event(
            activity.id,
            rfc4122.v4(),
            activity.name,
            activity.description,
            date,
            activity.timeLimit
          );
          event.nextDate = moment(event.date).add(event.timeLimit, 'hours');
          var myStorage = storage.load();
          myStorage.eventList.push(event);
          storage.update(myStorage);
          return event;
        }
      }
    },
    removeEvent : function(currentEvent){
      var myStorage = storage.load();
      if(myStorage.eventList && myStorage.eventList.length > 0){
        for(var i = 0; myStorage.eventList.length; i++){
          if(myStorage.eventList.uuid == currentEvent.uuid){
            myStorage.eventList.splice(i, 1);
          }
        }
      }
      storage.update(myStorage);
    }
  };
  return eventService;

}]);

