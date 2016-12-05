/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/

calendarApp.controller("firebaseVC", function($scope, $http, $q, $cookies, $compile, $translate) {

    /* Variáveis de negócio */
    $scope.new_all_event = $scope.all_event = { link: '', img: '', file: '', fileName: '', people: 0, location: { lat: 0, lng: 0 }, address: '' };
    $scope.new_user_event = $scope.user_event = { priority: '3', status: 'NEW', comment: '', presence: false };
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

    /* Ouve CalendarVC e salva dados do facebook */
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
                                    Google Maps Components
        ===========================================================================
    */

    /* Google Maps API */

    $scope.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: { lat: -23.21, lng: -45.87 }
    });
    google.maps.event.addListener($scope.map, 'click', function(event) {
        $scope.all_event.location = event.latLng;
        $scope.address_locate();
    });

    $scope.geocoder = new google.maps.Geocoder();

    $scope.marker = new google.maps.Marker({
        position: $scope.all_event.location,
        map: $scope.map,
        draggable: true,
        icon: {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            fillColor: "red",
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 1,
        }
    });

    /*
        ===========================================================================
                                  Google Maps API Data
        ===========================================================================
    */

    /* Fetching default IP and Address */
    $http.get("https://ipinfo.io").then(function(response) {
        var location = response.data.loc;
        $scope.new_all_event.address = response.data.city;
        $scope.new_all_event.location = {
            lat: parseFloat(location.split(",")[0]),
            lng: parseFloat(location.split(",")[1])
        }
    });

    /* Converte endereço para posição */
    $scope.locate_address = function() {
        $scope.geocoder.geocode({ 'address': $scope.all_event.address }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                $scope.all_event.location = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                }
                $scope.locateEvent();
                $scope.save();
            }
        });
    }

    /* Converte posição para endereço */
    $scope.address_locate = function() {
        $scope.geocoder.geocode({ 'location': $scope.all_event.location }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[1]) {
                $scope.all_event.address = results[1].formatted_address;
                $scope.locateEvent();
                $scope.save();
            }
        });
    }

    $scope.locateEvent = function() {
        var offsetLoc = $scope.all_event.location;
        if (isFunction($scope.all_event.location.lat))
            offsetLoc = { lat: $scope.all_event.location.lat(), lng: $scope.all_event.location.lng() + 0.035 }
        else offsetLoc = { lat: $scope.all_event.location.lat, lng: $scope.all_event.location.lng + 0.035 }
            //$scope.map.setCenter(offsetLoc);
        $scope.map.panTo($scope.all_event.location);
        $scope.marker.setPosition($scope.all_event.location);
    }

    $scope.fullscreenMap = function() {
        if (!screenfull.isFullscreen) {
            $("#map").css({ "height": "100%", "width": "100%" });
            $("#mapVC").css({ "height": "100%", "width": "100%" });
        } else {
            $("#map").css({ "height": "200px", "width": "400px" });
            $("#mapVC").css({ "height": "", "width": "" });
        }
        screenfull.toggle($("#mapVC")[0]);
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

    /* Muda status do evento */
    $scope.change_status = function(status) {
        $scope.user_event.status = (status != "") ?
            status : $scope.nextKey($scope.user_event.status);
        $scope.save();
        $scope.statusColor();
    }

    /* Marca presença no evento */
    $scope.presence = function() {
        $scope.all_event.people += ($scope.user_event.presence) ? 1 : -1;
        $scope.save();
    }

    /*
        ===========================================================================
                            Managing modal Firebase Events
        ===========================================================================
    */
    $scope.saveFirebase = function() {
        $scope.save();
        showSnackBar($translate.instant('label.snackbar.firebase.save'));
        $scope.closefirebaseNav();
    }

    $scope.deleteFirebase = function() {
        $scope.delet();
        showSnackBar($translate.instant('label.snackbar.firebase.delete'));
        $scope.closefirebaseNav();
    }


    /*
        ===========================================================================
                        Connection with NodeJS and Firebase database
        ===========================================================================
    */

    /* Get Firebase Url for event */
    $scope.fbUrl = function() {
        var group = $scope.groups[$scope.event.group_id] || { id: 'facebook' };
        return '/' + cleanGroup(group.id) + '/' + $scope.event.id;
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
                    if ($scope.fbUrl().indexOf('facebook') != -1 && $scope.event.location != undefined)
                        $.extend($scope.all_event, $scope.all_event, {
                            'location': $scope.event.location,
                            'address': $scope.event.address
                        });
                    if (response.data != undefined && response.data != "") {
                        $scope.all_event = $.extend({}, $scope.all_event, response.data['all']);
                        $scope.user_event = $.extend({}, $scope.new_user_event, response.data[$scope.user.id]);
                    }
                    $scope.locateEvent();
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
        // Só realiza upload de imagens com menos de 2MB
        var files = $("#imgUpload")[0].files;
        if (files[0].size / 1024 / 1024 < 2)
            uploadImage(files[0], $("#imgUpload").val());
        else alert($translate.instant('label.snackbar.firebase.imgtoobig'));
    });

    function uploadImage(file, name) {
        var filePath = 'images/' + $scope.fbUrl() + removePath(name);
        var uploadTask = storageRef.child(filePath).put(file);

        uploadTask.on('state_changed', function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            $scope.all_event.img = (progress).toFixed(2) + " %";
            $scope.$apply();
        }, function(error) {
            $("#imgUploadMsg").html($translate.instant('label.snackbar.firebase.upload.wrong'));
        }, function() {
            $("#imgUploadMsg").html($translate.instant('label.snackbar.firebase.upload.right'));
            storageRef.child(filePath).getDownloadURL().then(function(url) {
                $scope.all_event.img = url;
                $scope.save();
                $scope.$apply();
            });
        });
    }

    $("#fileUpload").on('change', function(evt) {
        // Só realiza upload de arquivos com menos de 2MB
        var files = $("#fileUpload")[0].files;
        if (files[0].size / 1024 / 1024 < 2)
            uploadFile(files[0], $("#fileUpload").val());
        else alert($translate.instant('label.snackbar.firebase.filetoobig'));
    });

    function uploadFile(file, name) {
        var fileName = removePath(name);
        var filePath = 'files/' + $scope.fbUrl() + fileName;
        var uploadTask = storageRef.child(filePath).put(file);

        uploadTask.on('state_changed', function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            $scope.all_event.file = (progress).toFixed(2) + " %";
            $scope.$apply();
        }, function(error) {
            $("#fileUploadMsg").html($translate.instant('label.snackbar.firebase.upload.wrong'));
        }, function() {
            $("#fileUploadMsg").html($translate.instant('label.snackbar.firebase.upload.right'));
            storageRef.child(filePath).getDownloadURL().then(function(url) {
                $scope.all_event.file = url;
                $scope.all_event.fileName = fileName;
                $scope.save();
                $scope.$apply();
            });
        });
    }

});

/* Detecta Esc para sair de FullScreen*/
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        $("#map").css({ "height": "200px", "width": "400px" });
        $("#mapVC").css({ "height": "", "width": "" });
        google.maps.event.trigger(map, 'resize');
        screenfull.exit($("#mapVC")[0]);
    }
});