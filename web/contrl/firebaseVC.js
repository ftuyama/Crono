/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/

calendarApp.controller("firebaseVC", function($scope, $http, $q, $cookies, $compile) {

    $scope.all_event = { link: '/' };
    $scope.user_event = { status: '' };
    $scope.groups = $scope.event = {};
    $("#firebaseVC").show();

    /*
        ===========================================================================
                        Communication between ViewControllers
        ===========================================================================
    */

    /* Ouve CalendarVC para abrir firebaseNav */
    $scope.$on('firebaseNav', function(event, data) {
        $scope.event = data[0];
        $scope.groups = data[1];
        expandSideBar();
    });


    $scope.closefirebaseNav = function() {
        angular.element('#calendarVC').scope()
            .$emit('eventModal', []);
        contractSideBar();
    };

    /*
        ===========================================================================
                                    Auxiliary functions
        ===========================================================================
    */

    function expandSideBar() {
        $("#firebaseNav").addClass("firebase-expand");
        $("#motherTable").addClass("motherTable-expand");
    }

    function contractSideBar() {
        $("#firebaseNav").removeClass("firebase-expand");
        $("#motherTable").removeClass("motherTable-expand");
    }

    /*
        ===========================================================================
                        Managing modal Firebase information
        ===========================================================================
    */

    $scope.saveFirebase = function() {
        $scope.save();
        showSnackBar("Informação salva com sucesso!");
        $scope.closefirebaseNav();
    }

    $scope.deleteFirebase = function() {
        showSnackBar("Informação deletada com sucesso!");
        $scope.closefirebaseNav();
    }

    /*
        ===========================================================================
                        Fetching and Managing Firebase data
        ===========================================================================
    */

    $scope.save = function() {
        var fbUrl =
            '/' + $scope.groups[$scope.event.group_id].id +
            '/' + $scope.event.id;
        var all_post = {
            url: fbUrl + '/all',
            content: $scope.all_event
        };
        var user_post = {
            url: fbUrl + '/' + ,
            content: $scope.user_post
        };
        $http.post('/firebase/set', JSON.stringify(all_post))
            .then(function success(response) {
                // success
            });

        $http.post('/firebase/set', JSON.stringify(user_post))
            .then(function success(response) {
                // success
            });
    }

    $scope.getUser = function() {
        $http.get('/calendarAuth/user')
            .then(function success(response) {
                $scope.user = response.data;
            });
    }

    $scope.fetch = function() {

    }

});