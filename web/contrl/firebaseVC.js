/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/

calendarApp.controller("firebaseVC", function($scope, $http, $q, $cookies, $compile) {

    $scope.groups = {};
    $scope.event = {};

    /*
        ===========================================================================
                        Communication between ViewControllers
        ===========================================================================
    */

    /* Ouve CalendarVC para abrir FirebaseModal */
    $scope.$on('firebaseModal', function(event, data) {
        $scope.event = data[0];
        $scope.groups = data[1];
        $("#firebaseModal").modal('show');
    });

    $scope.closeFirebaseModal = function() {
        angular.element('#calendarVC').scope()
            .$emit('eventModal', []);
        // Fecha Firebase modal
        $("#firebaseModal").modal('hide');
    };

    $('#firebaseModal').on('hidden.bs.modal', function() {
        angular.element($('#firebaseVC')).scope().closeFirebaseModal();
    })

    /*
        ===========================================================================
                        Managing modal Firebase information
        ===========================================================================
    */

    $scope.saveFirebase = function() {

    }

    $scope.deleteFirebase = function() {

    }

    /*
        ===========================================================================
                        Fetching and Managing Firebase data
        ===========================================================================
    */

    $scope.fetch = function() {

    }

});