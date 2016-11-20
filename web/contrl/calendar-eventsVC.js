/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/
var ATHENA_URL = 'http://athena-t17.herokuapp.com';

angular.module("calendarEventsApp", ['ngCookies'])
    .controller("calendarEventsVC", function($scope, $http, $cookies, $compile) {

        // Variáveis de negócio
        $scope.events = $scope.groups = {};
        $scope.selected = $scope.athena_json = '';

        // Varíavel de semáforo
        $scope.loader = true;

        $scope.select = function(selected) {
            $scope.selected = selected;
            $("#descriptionModal").modal('show');
        }

        $scope.athena = function(selected) {
            if ($scope.athenaId == undefined)
                $scope.fetchAthena();
            else $scope.eventsAthena();
            $("#athenaModal").modal('show');
        }

        $scope.closeModal = function() { $("#descriptionModal").modal('hide'); };

        $scope.closeAthenaModal = function() { $("#athenaModal").modal('hide'); };

        $scope.deleteEvent = function(event, group_index) {
            var param = {
                group_id: $scope.groups[group_index].id,
                event_id: event.id
            };
            showSnackBar("Deletando o evento...");
            $http.get('/calendar/delete', { "params": param })
                .then(function success(response) {
                    showSnackBar("Evento deletado com sucesso!");
                    $scope.fetch();
                });
        };

        /*
        ===========================================================================
                                    Athena Events
        ===========================================================================
        */

        $scope.fetchAthena = function() {
            $http.get('/calendar/athena')
                .then(function success(response) {
                    var athenaHTML = response.data;
                    athenaHTML = athenaHTML.replace("/cadastro/", ATHENA_URL + "/cadastro/");
                    athenaHTML = athenaHTML.replace("type=\"submit\">Login", "type=\"button\" ng-click='loginAthena()'>Login");
                    $("#athena").html($compile(athenaHTML)($scope));
                });
        };

        $scope.loginAthena = function() {
            var params = { 'username': $("#username").val(), 'password': $("#password").val() };
            $http.get('/calendar/login-athena', { params: params })
                .then(function success(response) {
                    if (response.data.valido == true) {
                        $scope.athenaId = response.data.id;
                        $scope.eventsAthena();
                    }
                });
        };

        $scope.eventsAthena = function() {
            $http.get('/calendar/events-athena', { params: { 'id': $scope.athenaId } })
                .then(function success(response) {
                    $scope.athena_json = response.data;
                    $("#athenaEvents").show();
                    $("#athena").html("");
                });
        };

        /*
        ===========================================================================
                        Fetching Data from the Server
        ===========================================================================
        */

        $scope.fetch = function() {
            $scope.events = [];
            for (j = 0; j < $scope.groups.length; j++)
                $scope.events.push({});
            for (j = 0; j < $scope.groups.length; j++) {
                var group_checked = $scope.groups[j].checked;
                createCookie([$scope.groups[j].id], group_checked, 365);
                if (group_checked == true) {
                    $http.get('/calendar/list' + j)
                        .then(function success(response) {
                            var group = Number(response.data.group_id);
                            response.data.items.forEach(function(event) {
                                var dateProp = getDateProperty(event.start);
                                var key = monthNames[dateProp.getMonth()] + '-' + dateProp.getFullYear();
                                $scope.events[group][key] = $scope.events[group][key] || [];
                                $scope.events[group][key].push(event);
                            });
                        });
                }
            }
            $scope.loader = false;
        };

        $http.get('/calendar/groups')
            .then(function success(response) {
                $scope.groups = response.data.items;
                for (i = 0; i < $scope.groups.length; i++) {
                    var cookie = readCookie([$scope.groups[i].id]);
                    $scope.groups[i].checked =
                        (cookie == undefined || cookie == "true");
                }
                $scope.fetch();
            });

        /*
            ===========================================================================
                            Auxialiary functions in javascript
            ===========================================================================
        */

        $scope.startComparator = function(d1, d2) {
            return getDateProperty(d1.value).compare(getDateProperty(d2.value));
        };

        function getDateProperty(eventDate) {
            if (eventDate.date != undefined)
                return new Date(eventDate.date);
            else if (eventDate.dateTime != undefined)
                return new Date(eventDate.dateTime);
            return new Date();
        }

    });