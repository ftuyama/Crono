/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/

calendarApp.controller("firebaseVC", function($scope, $http, $q, $cookies, $compile) {

    $scope.groups = {};
    $scope.event = {};
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

    $scope.fetch = function() {

    }

});