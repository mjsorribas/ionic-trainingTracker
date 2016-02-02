miscModule.factory('localStorageService', ['$rootScope', function ($rootScope) {

    var localStorageService = {
        /**
         *
         * @param {String} storageName
         * @param {Object} data
         * @param {boolean} broadcast
         * @returns {*}
         */
        save: function (storageName, data, broadcast) {
            //console.log(JSON.stringify(data));
            localStorage[storageName] = JSON.stringify(data);
            //console.log(localStorage[storageName]);
            if(broadcast && broadcast == true){
                $rootScope.$broadcast(storageName, data);
            }

            return data;
        },
        /**
         *
         * @param {String} storageName
         * @returns {undefined}
         */
        load: function (storageName) {

            if(typeof localStorage[storageName] == "undefined"){
                return undefined;
            }

            var storedData = localStorage[storageName];


            if (typeof storedData !== "undefined") {
                return JSON.parse(storedData);
            } else {
                return undefined;
            }
        },
        /**
         *
         * @param {String} storageName
         * @param {Boolean} broadcast
         * @returns {undefined}
         */
        delete: function (storageName, broadcast) {

            var storedData = localStorage[storageName];
            if (typeof storedData == 'undefined'){
                return;
            }

            delete localStorage[storageName];

            if(broadcast && broadcast == true){
                $rootScope.$broadcast(storageName);
            }


            return undefined;
        },
        clearAllStoragesSlots: function () {
            localStorage.clear();
            return 'localStorage is cleared!';
        },
        status: function () {

        }
    };
    return localStorageService;
}]);
