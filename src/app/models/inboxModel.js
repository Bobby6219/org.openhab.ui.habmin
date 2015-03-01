/**
 * HABmin - Home Automation User and Administration Interface
 * Designed for openHAB (www.openhab.com)
 *
 * This software is copyright of Chris Jackson under the GPL license.
 * Note that this licence may be changed at a later date.
 *
 * (c) 2014 Chris Jackson (chris@cd-jackson.com)
 */
angular.module('HABmin.inboxModel', [
    'HABmin.userModel',
    'HABmin.restModel'
])

    .service('InboxModel', function ($http, $q, UserService, RestService) {
        var inboxContents = [];
        var svcName = "inbox";

        this.getInbox = function () {
            return inboxContents;
        };

        this.refreshInbox = function () {
            var tStart = new Date().getTime();
            var deferred = $q.defer();

            if (!RestService.isServiceSupported(svcName)) {
                deferred.resolve(null);
                return deferred.promise;
            }

            RestService.getService(svcName).then(
                function (url) {
                    $http.get(url)
                        .success(function (data) {
                            console.log("Fetch completed in", new Date().getTime() - tStart);

                            // Keep a local copy.
                            // This allows us to update the data later and keeps the GUI in sync.
                            inboxContents = [].concat(data);
                            console.log("Processing completed in", new Date().getTime() - tStart);

                            deferred.resolve(inboxContents);
                        })
                        .error(function (data, status) {
                            deferred.reject(data);
                        });
                },
                function () {
                    deferred.reject(null);
                }
            );

            return deferred.promise;
        };
    })
;