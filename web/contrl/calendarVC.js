/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/
var calendarApp = angular.module("calendarApp", ['ngCookies']);

calendarApp.controller("calendarVC", function($scope, $http, $q, $cookies, $compile, $timeout) {
    // Variável do form
    $scope.event_form = { summary: '', description: '', group_id: '', startDate: '', startHour: '', endDate: '', endHour: '' };
    $scope.event_id = "";
    $scope.event_group = "";

    // Variável de calendário
    $scope.monthYear = new Date();

    // Variáveis de negócio
    $scope.events = {};
    $scope.groups = {};

    // Variáveis de semáforo
    $scope.busy = true;
    $scope.request = false;
    $scope.loaded = false;
    $scope.loader = true;
    $scope.fbActive = false;
    $scope.fbOver = false;

    // Varíaveis para definir Modal Form
    $scope.dateTime = false;
    $scope.create = false;
    $scope.edit = false;

    /*
        ===========================================================================
                        Communication between ViewControllers
        ===========================================================================
    */

    /* Comunica com o FirebaseVC */
    $scope.invokeFirebase = function() {
        $("#formModal").css({ "margin-left": "500px", "opacity": "0.5" });
        angular.element('#firebaseVC').scope()
            .$emit('firebaseModal', [$scope.event_form, $scope.groups]);
    };

    $scope.$on('eventModal', function(event, data) {
        $("#formModal").css({ "margin-left": "0px", "opacity": "1.0" });
    });

    $scope.flashFirebase = function(info, selected_date) {
        if ($scope.fbActive) {
            $scope.fbOver = true;
            $scope.newEvent(info, selected_date);
            $scope.fbOver = false;
            $scope.invokeFirebase();
        }
    }

    $scope.firebaseActive = function() {
        $scope.fbActive = !$scope.fbActive;
    }

    /*
        ===========================================================================
                        Manage user's decisions using Modal
        ===========================================================================
    */

    $scope.newEvent = function(info, selected_date) {
        /*  
         *   Id == 0 -> Event Creation
         *   Id != 0 -> Event Edition
         */
        var group_and_id = info.replace("task", "").split('-');
        $scope.create = $scope.edit = false;
        $scope.event_group = Number(group_and_id[0]);
        $scope.event_id = Number(group_and_id[1]);
        if ($scope.event_id == 666) {
            $scope.create = true;
            $scope.event_form = {
                summary: "",
                description: "",
                startDate: toDateBR(selected_date),
                startHour: "",
                endDate: toDateBR(selected_date),
                endHour: "",
                group_id: $scope.event_group
            };
        } else {
            $scope.edit = true;
            evento = $scope.events[$scope.event_group][$scope.event_id];
            $scope.event_form = {
                summary: evento.summary,
                description: evento.description,
                startDate: toDateBR(getDateProperty(evento.start)),
                startHour: getHourProperty(evento.start),
                endDate: toDateBR(getDateProperty(evento.end)),
                endHour: getHourProperty(evento.end),
                group_id: $scope.event_group
            };
        }
        if (!$scope.fbOver)
            $("#formModal").modal('show');
    };

    $scope.closeModal = function() {
        // Procura bug de data
        if ($scope.checkDate() == false)
            return false;
        // Fecha modal com dados validados
        $("#formModal").modal('hide');
        return true;
    };

    $scope.move = function(origin, destine) {
        var group_and_id = origin.replace("task", "").split('-');
        $scope.event_group = Number(group_and_id[0]);
        $scope.event_id = Number(group_and_id[1]);
        var date = destine.replace("day-", "");
        evento = $scope.events[$scope.event_group][$scope.event_id];
        $scope.event_form = {
            summary: evento.summary,
            description: evento.description,
            startDate: date,
            startHour: "",
            endDate: date,
            endHour: "",
            group_id: $scope.event_group
        };
        $scope.postMoveEvent();
        $scope.dateTime = false;
    };

    /*
        ===========================================================================
                      Generate the POST body for API communication
        ===========================================================================
    */

    $scope.generatePost = function() {
        var post = {
            group_id: $scope.groups[$scope.event_form.group_id].id,
            event: {
                summary: $scope.event_form.summary,
                description: $scope.event_form.description
            }
        };
        return $scope.appendDatePost(post);
    };

    $scope.appendDatePost = function(post) {
        if ($scope.dateTime == true) {
            post.event["start"] = {
                dateTime: toDateISO(
                    $scope.event_form.startDate,
                    $scope.event_form.startHour
                )
            };
            post.event["end"] = {
                dateTime: toDateISO(
                    $scope.event_form.endDate,
                    $scope.event_form.endHour
                )
            };
        } else {
            post.event["start"] = { date: toDateISO($scope.event_form.startDate, "") };
            post.event["end"] = { date: toDateISO($scope.event_form.endDate, "") };

        }
        return post;
    };

    /*
        ===========================================================================
                        Communicating with Nodejs API
        ===========================================================================
    */

    $scope.postCreateEvent = function() {
        if (!$scope.closeModal()) return;
        var post = $scope.generatePost();
        showSnackBar("Criando novo evento...");
        $http.post('/calendar/create', JSON.stringify(post))
            .then(function success(response) {
                showSnackBar("Evento criado com sucesso!");
                $scope.fetch();
            });
    }

    $scope.postEditEvent = function() {
        if (!$scope.closeModal()) return;
        var post = $scope.generatePost();
        post["group_id"] = $scope.groups[$scope.event_group].id;
        post["event_id"] = $scope.events[$scope.event_group][$scope.event_id].id;
        showSnackBar("Editando o evento...");
        $http.post('/calendar/edit', JSON.stringify(post))
            .then(function success(response) {
                showSnackBar("Evento editado com sucesso!");
                $scope.fetch();
            });
    }

    $scope.postDeleteEvent = function() {
        if (!$scope.closeModal()) return;
        var param = {
            group_id: $scope.groups[$scope.event_group].id,
            event_id: $scope.events[$scope.event_group][$scope.event_id].id
        };
        showSnackBar("Deletando o evento...");
        $http.get('/calendar/delete', { "params": param })
            .then(function success(response) {
                showSnackBar("Evento deletado com sucesso!");
                $scope.fetch();
            });
    };

    $scope.postMoveEvent = function() {
        var post = $scope.generatePost();
        post["group_id"] = $scope.groups[$scope.event_group].id;
        post["event_id"] = $scope.events[$scope.event_group][$scope.event_id].id;
        showSnackBar("Movendo o evento...");
        $http.post('/calendar/edit', JSON.stringify(post))
            .then(function success(response) {
                showSnackBar("Evento movido com sucesso!");
                $scope.fetch();
            });
    }

    /*
        ===========================================================================
                        Fetching Data from the Server
        ===========================================================================
    */

    $scope.requestFetch = function() {
        if ($scope.busy == false)
            $scope.fetch();
        else $scope.request = true;
    }

    $scope.fetch = function() {
        $scope.busy = true;
        $scope.refresh_calendar();
        $scope.events = [];
        http_requests = [];
        for (j = 0; j < $scope.groups.length; j++) {
            var group_checked = $scope.groups[j].checked;
            createCookie([$scope.groups[j].id], group_checked, 365);
            $scope.events.push([]);
            if (group_checked == true) {
                http_requests.push($http.get('/calendar/list' + j)
                    .then(function success(response) {
                        var group = Number(response.data.group_id);
                        $scope.events[group] = response.data.items;
                    }));
            }
        }
        $q.all(http_requests).then(function() {
            for (group = 0; group < $scope.groups.length; group++) {
                var events = $scope.events[group];
                for (i = 0; i < events.length; i++) {
                    if (isValidEvent(events[i])) {
                        var date = getDateProperty(events[i].start);
                        var clazz = getTextSize(events[i].summary);
                        var event_ref = group + '-' + i;
                        var event_item =
                            '<a href="#" class="list-group-item' + clazz + '" id="task' +
                            event_ref + '" ng-mouseover="flashFirebase(\'' +
                            event_ref + '\', \'' + date + '\');" ng-click="newEvent(\'' +
                            event_ref + '\', \'' + date + '\'); $event.stopPropagation();"' +
                            ' draggable="true" ondragstart="drag(event)">' +
                            events[i].summary + '</a>';
                        $("#" + date).append($compile(event_item)($scope));
                        $("#task" + event_ref).css('color', getRandomColor());
                    }
                }
            }
            if ($scope.request == true) {
                $scope.request = false;
                $scope.fetch();
            } else $scope.busy = false;
        });
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

    $scope.$watch("busy", function() {
        // Mostra animação bodosa na primeira vez
        if ($scope.loaded == false && $scope.busy == false) {
            $scope.loaded = true;
            $('body').addClass('loaded');

            // Nas demais, só mostra o loader
            $timeout(function() {
                $scope.loader = false;
                $('body').removeClass('loaded');
                $(".loader-section").css("opacity", 0.3);
            }, 1500);

        } else {
            $scope.loader = $scope.busy;
        }
    });

    /*
        ===========================================================================
                        Auxialiary functions in javascript
        ===========================================================================
    */

    $scope.monthPicker = function() {
        $("#monthPicker").focus();
    };

    /* Resolve bug irritante do AngularJS. Valida também as datas e seu formato */
    $scope.checkDate = function() {
        $scope.event_form.startDate = $("#startDate").val();
        $scope.event_form.endDate = $("#endDate").val();
        if ($("#startHour").val() != "") {
            digits = $("#startHour").val().split(":");
            $scope.event_form.startHour = ("0" + digits[0]).slice(-2) + ":" + digits[1].slice(0, 2);
        }
        if ($("#endHour").val() != "") {
            digits = $("#endHour").val().split(":");
            $scope.event_form.endHour = ("0" + digits[0]).slice(-2) + ":" + digits[1].slice(0, 2);
        }
        date1 = new Date(toDateISO($scope.event_form.startDate, $scope.event_form.startHour));
        date2 = new Date(toDateISO($scope.event_form.endDate, $scope.event_form.endHour));
        if (date1 > date2) {
            $scope.event_form.startDate = $scope.event_form.startHour = "";
            $scope.event_form.endDate = $scope.event_form.endHour = "";
            $scope.dateTime = false;
            return false;
        }
        if ($scope.event_form.startHour != "" || $scope.event_form.endHour != "")
            $scope.dateTime = true;
        else $scope.dateTime = false;
        return true;
    };

    function isValidEvent(event) {
        return event != undefined &&
            event.summary != undefined &&
            event.start != undefined;
    }

    function toDateISO(date, hour) {
        if (hour == "")
            return date + 'T00:00:00-03:00'
        if (date[4] == '-' && date[7] == '-')
            return date;
        var dateISO = date.slice(6, 10) + '-' + date.slice(3, 5) + '-' + date.slice(0, 2);
        if (hour.length < 5)
            return dateISO;
        return dateISO + 'T' + hour.slice(0, 5) + ":00-03:00";
    }

    function toDateBR(date) {
        return date.slice(8, 10) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4);
    }

    function getTextSize(text) {
        if (text == undefined)
            return "";
        length = text.length;
        if (length > 40)
            return "-micro";
        else if (length > 18)
            return "-tiny";
        else return "";
    }

    function getDateProperty(eventDate) {
        if (eventDate.date != undefined)
            return eventDate.date.split('T')[0];
        else if (eventDate.dateTime != undefined)
            return eventDate.dateTime.split('T')[0];
        return (new Date()).toISOString().split('T')[0];
    }

    function getHourProperty(eventDate) {
        if (eventDate.dateTime != undefined)
            return eventDate.dateTime.slice(11, 16);
        return "00:00";
    }

    /*
        ===========================================================================
                        Generating basic calendar structure
        ===========================================================================
    */
    $scope.stopPropagation = function() {
        $event.stopPropagation();
    };

    $scope.fullscreen = function() {
        if (!screenfull.isFullscreen) {
            $("#motherTable").css("background-color", "#111");
            $("#motherTable").css("height", "100%");
            $("#motherTable").css("width", "100%");
        } else {
            $("#motherTable").css("background-color", "#111");
            $("#motherTable").css("height", "");
            $("#motherTable").css("width", "");
        }
        screenfull.toggle($("#motherTable")[0]);
    };

    $scope.select_month = function() {
        [month, year] = $("#monthPicker").val().split(' ');
        $scope.monthYear = new Date(year, returnMonth(month), 1);
        $scope.create_calendar();
        $scope.requestFetch();
    };

    $scope.refresh_calendar = function() {
        if ($scope.calendarHTML == undefined)
            $scope.create_calendar();
        else $("#motherTable").html($compile($scope.calendarHTML)($scope));
    }

    $scope.create_calendar = function() {
        // Hoje
        var date = $scope.monthYear;
        // Data do dia do calendário
        var dayDate;
        // Primeiro dia do mês
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
        // Último dia do mês
        var lastDay = new Date(date.getFullYear(), (date.getMonth() + 1) % 12, 0).getDate();
        // Dia da semana do primeiro dia
        var firstWeekDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        // Quantos dias teve último mês
        var lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

        var progress = Math.round(1000 * date.getDate() / lastDay) / 10;
        var progressHTML =
            '<div class="progress progress-striped"><div class="progress-bar" ' +
            'role="progressbar" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100"' +
            ' style="width:' + progress + '%">Month ' + progress + ' % Complete</div></div>';

        var table = progressHTML + '<table class="table table-bordered">';
        table += '<tr><td COLSPAN=7 ng-click="monthPicker()">' +
            '<button class="btn btn-success" style="float:left;" ng-click="newEvent(\'0-666\', \'' +
            date.toISOString().slice(0, 10) + '\'); $event.stopPropagation()">Add event</button>' +
            monthNames[date.getMonth()] + " " + date.getFullYear() +
            '<button class="btn btn-danger" style="float:right;">Change month</button>' +
            '<i class="fa fa-refresh fa-2x farefresh"' +
            ' ng-click="requestFetch();  $event.stopPropagation()"></i>' +
            '<i class="fa fa-eye fa-2x farefresh eyefarefresh" ng-hide="fbActive"' +
            ' ng-click="firebaseActive();  $event.stopPropagation()"></i>' +
            '<i class="fa fa-eye-slash fa-2x farefresh eyeslashfarefresh" ng-show="fbActive"' +
            ' ng-click="firebaseActive();  $event.stopPropagation()"></i>' +
            "</td></tr>";
        table += "<tr>";
        daysNames.forEach(function(dayName) {
            table += "<td>" + dayName + "</td>";
        });
        table += "</tr>";
        for (i = 0; i <= 5; i++) {
            var row = "<tr>";
            for (j = 0; j <= 6; j++) {
                var dayNumber = ((i * 7 + j - firstWeekDay) % lastDay + 1);
                var dayOut = true;
                if ((i * 7 + j - firstWeekDay) >= lastDay) {
                    // Dia pertence ao próximo mês
                    dayDate = new Date(date.getFullYear(), date.getMonth() + 1, dayNumber);
                } else if (dayNumber <= 0) {
                    // Dia pertence ao mês passado
                    dayNumber += lastDayOfLastMonth;
                    dayDate = new Date(date.getFullYear(), date.getMonth() - 1, dayNumber);
                } else {
                    // Dia pertence ao mês atual
                    dayOut = false;
                    dayDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
                }
                var dayString = dayNumber.toString();
                var dateString = dayDate.toISOString().split('T')[0];
                row += '<td id="day-' + dateString + '" class="day';
                if (dayDate.sameDay(date))
                    row += " today";
                else if (dayDate < date || dayOut == true)
                    row += " day-gone";
                row += '" ng-click="newEvent(\'0-666\', \'' + dateString +
                    '\')" ondrop="drop(event)" ondragover="allowDrop(event)">' +
                    '<div id="' + dateString + '" class="list-group">' +
                    '<a href="#" class="list-group-item-esp">' + dayString + '</a>';

                row += '<button class="btn btn-success spc-btn" ng-click="createEvent(\'' +
                    dateString + '\')">Add  <span class="glyphicon glyphicon-plus-sign"></span>' +
                    '</button>';

                row += '<button class="btn btn-danger spc-btn" ng-click="deleteAllEvents(\'' +
                    dateString + '\')">Del  <span class="glyphicon glyphicon-minus-sign"></span>' +
                    '</button>';

                row += '</div></td>';
            }
            table += row + "</tr>";
        }
        table += "</table>";
        $scope.calendarHTML = table;
        $("#motherTable").html($compile(table)($scope));
    }
});

/*
===========================================================================
                View Events triggering controller behaviors
===========================================================================
*/

/* Comportamento drag and drop */

var origin;
var destine;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    origin = ev.target.id;
}

function drop(ev) {
    ev.preventDefault();
    destine = ev.target.id;
    angular.element(document.getElementById('calendarVC')).scope().move(origin, destine);
}