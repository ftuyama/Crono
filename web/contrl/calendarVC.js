var calendarApp = angular.module("calendarApp", []);

calendarApp.controller("calendarVC", function($scope, $http) {
    $scope.events = {};
    $http.get('/calendar/list')
        .then(function success(response) {
            $scope.events = response;
            console.log(JSON.stringify(response));
        });

});