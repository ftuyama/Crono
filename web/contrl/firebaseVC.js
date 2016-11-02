/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/

calendarApp.controller("firebaseVC", function($scope, $http, $q, $cookies, $compile) {

    /* Variáveis de negócio */
    $scope.new_all_event = { link: '', img: '', people: 0 };
    $scope.new_user_event = { priority: '3', status: 'NEW', comment: '', presence: false };
    $scope.user = $scope.groups = $scope.event = {};

    /* Interface gráfica */
    $scope.fetching = true;
    $("#firebaseVC").show();

    /*
        ===========================================================================
                        Communication between ViewControllers
        ===========================================================================
    */

    /* Ouve CalendarVC para abrir firebaseNav */
    $scope.$on('firebaseNav', function(event, data) {
        [$scope.event, $scope.groups, $scope.event.id] = data;
        $scope.fetch();
        expandSideBar();
    });

    /* Ouve CalendarVC para fechar firebaseNav */
    $scope.$on('firebaseNavClose', function(event, data) {
        $scope.closefirebaseNav();
    });

    /* Ouve CalendarVC para deletar evento */
    $scope.$on('firebaseDelete', function(event, data) {
        [$scope.event, $scope.groups, $scope.event.id] = data;
        $scope.deleteFirebase();
    });

    /* Ouve CalendarVC para atualizar evento */
    $scope.$on('firebaseUpdateStatus', function(event, data) {
        [status, $scope.groups, $scope.event] = data;
        $scope.fetch().then(function() {
            $scope.change_status(status);
            $scope.updateStatus();
        });
    });

    /* Ouve CalendarVC e comunica para enviar informações */
    $scope.$on('firebaseFetch', function(event, data) {
        $scope.getUser();
        $scope.fetchHard().then(function(response) {
            angular.element('#calendarVC').scope()
                .$emit('firebaseFetched', [response.data, $scope.user, statusMap]);
        });
    });

    /* Comunica com CalendarVC para fechar sideBar */
    $scope.closefirebaseNav = function() {
        angular.element('#calendarVC').scope().$emit('eventModal', []);
        contractSideBar();
    };

    /* Comunica com CalendarVC para atualizar os status */
    $scope.updateStatus = function() {
        angular.element('#calendarVC').scope().$emit('updateStatus', []);
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

    function copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    var statusMap = {
        "NEW": "red",
        "TODO": "#dac586",
        "DEV": "#160c76",
        "TEST": "#702898",
        "DONE": "#197403"
    }

    $scope.statusColor = function() {
        if ($scope.user_event != undefined) {
            if (statusMap[$scope.user_event.status] != undefined)
                $scope.user_event.statusColor = statusMap[$scope.user_event.status];
            else $scope.user_event.statusColor = "#b8a88a";
        }
    }

    $scope.nextKey = function(current) {
        var keys = []
        for (var key in statusMap) keys.push(key);
        var index = (keys.indexOf(current) + 1) % keys.length;
        return keys[index];
    }

    /*
        ===========================================================================
                        Managing modal Firebase information
        ===========================================================================
    */

    $scope.change_status = function(status) {
        $scope.user_event.status = (status != "") ?
            status : $scope.nextKey($scope.user_event.status);
        $scope.save();
        $scope.statusColor();
    }

    $scope.saveFirebase = function() {
        $scope.save();
        showSnackBar("Informação salva com sucesso!");
        $scope.closefirebaseNav();
    }

    $scope.deleteFirebase = function() {
        $scope.delet();
        showSnackBar("Informação deletada com sucesso!");
        $scope.closefirebaseNav();
    }

    /*
        ===========================================================================
                        Connection with NodeJS and Firebase database
        ===========================================================================
    */

    /* Get Firebase Url for event */
    $scope.fbUrl = function() {
        return '/' + cleanGroup($scope.groups[$scope.event.group_id].id) +
            '/' + $scope.event.id;
    }

    /* Marca presença no evento */
    $scope.presence = function() {
        $scope.all_event.people += ($scope.user_event.presence) ? 1 : -1;
        $scope.save();
    }

    /* Post save */
    $scope.save = function() {
        var post = { url: $scope.fbUrl(), content: {} };
        post.content['all'] = $scope.all_event;
        post.content[$scope.user.id] = $scope.user_event;
        $http.post('/firebase/set', JSON.stringify(post))
            .then(function success(response) {});
    }

    /* Post delete */
    $scope.delet = function() {
        $http.post('/firebase/del', JSON.stringify({ url: $scope.fbUrl() }));
    }

    /* Carrega informações do usuário */
    $scope.getUser = function() {
        $http.get('/calendarAuth/user')
            .then(function success(response) {
                $scope.user = response.data;
            });
    }

    /* Carrega todas as informações */
    $scope.fetchHard = function() {
        return new Promise(function(resolve, reject) {
            $http.get('/firebase/fetch')
                .then(function success(response) {
                    resolve(response);
                });
        });
    }

    /* Carrega informações do evento */
    $scope.fetch = function() {
        return new Promise(function(resolve, reject) {
            $scope.fetching = true;
            $scope.getUser();
            $http.post('/firebase/get', JSON.stringify({ 'url': $scope.fbUrl() }))
                .then(function success(response) {
                    $scope.all_event = copy($scope.new_all_event);
                    $scope.user_event = copy($scope.new_user_event);
                    if (response.data != undefined && response.data != "") {
                        $scope.all_event = $.extend({}, $scope.all_event, response.data['all']);
                        $scope.user_event = $.extend({}, $scope.new_user_event, response.data[$scope.user.id]);
                    }
                    $scope.statusColor();
                    $scope.fetching = false;
                    resolve();
                });
        });
    }

    /*
        ===========================================================================
                            Upload de arquivos para Storage
        ===========================================================================
    */

    $("#imgUpload").on('change', function(evt) {
        // Só realiza uploa de imagens com menos de 2MB
        var files = $("#imgUpload")[0].files;
        if (files[0].size / 1024 / 1024 < 2)
            uploadImage(files[0], $("#imgUpload").val());
    });

    function uploadImage(file, name) {
        var uploadTask = storageRef.child('images/' + $scope.fbUrl() + removePath(name)).put(file);

        uploadTask.on('state_changed', function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            $scope.all_event.img = (progress).toFixed(2) + " %";
            $scope.$apply();
        }, function(error) {
            $("#imgUploadMsg").html("O Upload deu errado.");
        }, function() {
            $("#imgUploadMsg").html("O Upload deu certo.");
            $scope.all_event.img = decodeURIComponent(uploadTask.snapshot.downloadURL);
            $scope.save();
            $scope.$apply();
        });
    }

});