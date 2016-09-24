/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/

angular.module("calendarEventsApp", ['ngCookies'])
    .controller("calendarEventsVC", function($scope, $http, $cookies, $compile) {

        // Variáveis de negócio
        $scope.events = {};
        $scope.groups = {};
        $scope.selected = '';

        $scope.select = function(selected) {
            $scope.selected = selected;
            $("#descriptionModal").modal('show');
        }

        $scope.closeModal = function() {
            $("#descriptionModal").modal('hide');
        };

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

        $scope.fetch = function() {
            $scope.events = [];
            for (j = 0; j < $scope.groups.length; j++)
                $scope.events.push([]);
            for (j = 0; j < $scope.groups.length; j++) {
                var group_checked = $scope.groups[j].checked;
                $cookies[$scope.groups[j].id] = group_checked;
                if (group_checked == true) {
                    $http.get('/calendar/list' + j)
                        .then(function success(response) {
                            var group = Number(response.data.group_id);
                            $scope.events[group] = response.data.items;
                        });
                }
            }
        };

        $http.get('/calendar/groups')
            .then(function success(response) {
                $scope.groups = response.data.items;
                for (i = 0; i < $scope.groups.length; i++) {
                    var cookie = $cookies[$scope.groups[i].id];
                    $scope.groups[i].checked =
                        (cookie == undefined || cookie == "true");
                }
                $scope.fetch();
            });

    });