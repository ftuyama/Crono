/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/
var calendarApp = angular.module("calendarApp", ['ngCookies']);

calendarApp.controller("calendarVC", function($scope, $http, $q, $cookies, $compile, $timeout) {
    // Variável do form
    $scope.event_form = { summary: '', description: '', group_id: -1, startDate: '', startHour: '', endDate: '', endHour: '' };
    $scope.event_id = $scope.event_group = "";

    // Variável de Calendário e Kanban
    $scope.monthYear = new Date();
    $scope.filter_week = (new Date()).getWeek();
    $scope.filter = "month";

    // Variáveis de negócio
    $scope.evento = $scope.events = $scope.fb_events = $scope.groups = {};

    // Variáveis de semáforo
    $scope.busy = $scope.loader = true;
    $scope.request = $scope.loaded = $scope.fbActive =
        $scope.fbCheck = $scope.kanbanActive = false;

    // Varíaveis para definir Modal Form
    $scope.dateTime = $scope.create = $scope.edit = false;

    /*
        ===========================================================================
                        Communication between ViewControllers
        ===========================================================================
    */

    /* Comunica com FirebaseVC - abre sideBar */
    $scope.invokeFirebase = function() {
        $("#formModal").css({ "margin-left": "20%" });
        angular.element('#firebaseVC').scope()
            .$emit('firebaseNav', [$scope.event_form, $scope.groups, $scope.evento.id]);
    };

    /* Comunica com FirebaseVC - fecha sideBar */
    $scope.closeFirebase = function() {
        $("#formModal").css({ "margin-left": "0%" });
        angular.element('#firebaseVC').scope().$emit('firebaseNavClose', []);
    };

    /* Comunica com FirebaseVC - deletar evento */
    $scope.deleteFirebase = function() {
        angular.element('#firebaseVC').scope()
            .$emit('firebaseDelete', [$scope.event_form, $scope.groups, $scope.evento.id]);
    };

    /* Comunica com FirebaseVC - requisita informações */
    $scope.firebaseFetch = function() {
        angular.element('#firebaseVC').scope().$emit('firebaseFetch', []);
    }

    /* Ouve FirebaseVC - recebe informações */
    $scope.$on('firebaseFetched', function(event, data) {
        $scope.translate(data[0], data[1], data[2]);
    });

    /* Ouve FirebaseVC - fecha sideBar */
    $scope.$on('eventModal', function(event, data) {
        $("#formModal").css({ "margin-left": "0%" });
    });

    /* Ouve FirebaseVC - atualiza status */
    $scope.$on('updateStatus', function(event, data) {
        $scope.firebaseFetch();
    });

    $scope.translate = function(firebase, user, statusMap) {
        $.each($scope.events, function(group_id, events) {
            $.each(events, function(event_id, event) {
                try {
                    var group_key = cleanGroup($scope.groups[group_id].id);
                    var event_key = event.id;
                    var user_key = user.id;
                    var status_key = "status";
                    var status = firebase[group_key][event_key][user_key][status_key];
                    $scope.events[group_id][event_id].status = status;
                    $scope.events[group_id][event_id].statusColor = statusMap[status];
                } catch (err) {
                    $scope.events[group_id][event_id].status = "NEW";
                    $scope.events[group_id][event_id].statusColor = "red";
                }
            });
        });
        if ($scope.busy) $scope.resolveFetch();
        else if ($scope.kanbanActive) {
            $scope.create_kanban();
            $scope.displayKanbanEvents();
        }
        $scope.$apply();
    }

    /*
        ===========================================================================
                                Modal Display Management
        ===========================================================================
    */

    $scope.flashFirebase = function(info, selected_date) {
        if ($scope.fbActive) {
            $scope.newEvent(info, selected_date);
            $scope.invokeFirebase();
        }
    }

    $scope.openModals = function(info, selected_date) {
        $scope.fbActive = false;
        $scope.newEvent(info, selected_date);
        $scope.invokeFirebase();
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
            $scope.evento = evento = $scope.events[$scope.event_group][$scope.event_id];
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
        if (!$scope.fbActive)
            $("#formModal").modal('show');
    };

    $scope.closeModal = function() {
        // Procura bug de data
        if ($scope.checkDate() == false)
            return false;
        // Fecha modal com dados validados
        $scope.closeFirebase();
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
        return $scope.appendDatePost({
            group_id: $scope.groups[$scope.event_form.group_id].id,
            event: {
                summary: $scope.event_form.summary,
                description: $scope.event_form.description
            }
        });
    };

    $scope.appendDatePost = function(post) {
        if ($scope.dateTime == true) {
            post.event["start"] = { dateTime: toDateISO($scope.event_form.startDate, $scope.event_form.startHour) };
            post.event["end"] = { dateTime: toDateISO($scope.event_form.endDate, $scope.event_form.endHour) };
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
        $scope.deleteFirebase();
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

    /* Gerencia fila de eventos */
    $scope.requestFetch = function() {
        if (!$scope.busy)
            $scope.fetch();
        else $scope.request = true;
    }

    /* Requisita fetch de facebook */
    $scope.fbRequestFecth = function() {
        if (!$scope.fbCheck) return;
        $scope.busy = true;
        $scope.fbFetch().then(function success(response) {
            $scope.busy = false;
            $scope.$apply();
        }, function error(error) {
            showSnackBar("First login on Facebook");
            $scope.fbCheck = $scope.busy = false;
            $scope.$apply();
        });
    }

    /* Carrega todos os eventos */
    $scope.fetch = function() {
        return new Promise(function(resolve, reject) {
            $scope.busy = true;
            $scope.events = http_requests = [];
            for (j = 0; j < $scope.groups.length; j++) {
                var group_checked = $scope.groups[j].checked;
                createCookie([$scope.groups[j].id], group_checked, 365);
                $scope.events.push([]);
                if (group_checked == true) {
                    http_requests.push($http.get('/calendar/list' + j)
                        .then(function success(response) {
                            $scope.events[Number(
                                response.data.group_id)] = response.data.items;
                        }));
                }
            }
            $q.all(http_requests).then(function() {
                $scope.fbFetch().then(function() {
                    $scope.firebaseFetch();
                    resolve();
                })
            });
        });
    };

    /* Termina a carga de todos os eventos */
    $scope.resolveFetch = function() {
        if ($scope.request) {
            $scope.request = false;
            $scope.fetch();
        } else $scope.busy = false;
        $scope.display_events();
    }

    /* Carrega os eventos do facebook */
    $scope.fbFetch = function() {
        return new Promise(function(resolve, reject) {
            if (!$scope.fbCheck) resolve();
            else {
                $http.get('/calendar/facebook')
                    .then(function success(response) {
                        $scope.fb_events = response.data;
                        $scope.displayFbEvents();
                        resolve();
                    }, function error(error) {
                        reject();
                    });
            }
        });
    }

    /* Inicialmente carrega lista de grupos */
    $http.get('/calendar/groups')
        .then(function success(response) {
            $scope.groups = response.data.items;
            for (i = 0; i < $scope.groups.length; i++) {
                var cookie = readCookie([$scope.groups[i].id]);
                $scope.groups[i].checked =
                    (cookie == undefined || cookie == "true");
            }
            $scope.busy = false;
            $scope.display_calendar();
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

        } else $scope.loader = $scope.busy;
    });

    /*
        ===========================================================================
                                Display events on Calendar
        ===========================================================================
    */

    $scope.display_events = function() {
        if ($scope.kanbanActive)
            $scope.displayKanbanEvents();
        else $scope.displayEvents();
    }

    $scope.displayFbEvents = function() {
        var events = $scope.fb_events;
        for (i = 0; i < events.length; i++) {
            // $scope.events[i].status = 'NEW';
            // $scope.events[i].statusColor = 'red';
            // if (isValidEvent(events[i])) {
            //     var date = getDateProperty(events[i].start);
            //     var clazz = getTextSize(events[i].summary);
            //     var group = "facebook";
            //     var event_ref = group + '-' + i;
            //     var event_item =
            //         '<div class="row rowitens">' +
            //         '<a href="#" class="list-group-item' + clazz + '" id="task' +
            //         event_ref + '" ng-mouseover="flashFirebase(\'' +
            //         event_ref + '\', \'' + date + '\')" ng-click="openModals(\'' +
            //         event_ref + '\', \'' + date + '\'); $event.stopPropagation();"' +
            //         ' draggable="true" ondragstart="drag(event)">' +
            //         events[i].summary +
            //         '<span class="label label-info status Cstatus"' +
            //         ' style="background-color:{{events[' + group + '][' + i + '].statusColor}}"' +
            //         ' ng-bind="events[' + group + '][' + i + '].status"></span>' +
            //         '</a></div>';
            //     $("#" + date).append($compile(event_item)($scope));
            //     $("#task" + event_ref).css('color', getRandomColor());
            // }
        }
    }

    $scope.displayEvents = function() {
        for (group = 0; group < $scope.groups.length; group++) {
            var events = $scope.events[group];
            for (i = 0; i < events.length; i++) {
                if (isValidEvent(events[i])) {
                    var date = getDateProperty(events[i].start);
                    var clazz = getTextSize(events[i].summary);
                    var event_ref = group + '-' + i;
                    var event_item =
                        '<div class="row rowitens">' +
                        '<a href="#" class="list-group-item' + clazz + '" id="task' +
                        event_ref + '" ng-mouseover="flashFirebase(\'' +
                        event_ref + '\', \'' + date + '\')" ng-click="openModals(\'' +
                        event_ref + '\', \'' + date + '\'); $event.stopPropagation();"' +
                        ' draggable="true" ondragstart="drag(event)">' +
                        events[i].summary +
                        '<span class="label label-info status Cstatus"' +
                        ' style="background-color:{{events[' + group + '][' + i + '].statusColor}}"' +
                        ' ng-bind="events[' + group + '][' + i + '].status"></span>' +
                        '</a></div>';
                    $("#" + date).append($compile(event_item)($scope));
                    $("#task" + event_ref).css('color', getRandomColor());
                }
            }
        }
    }

    /*
        ===========================================================================
                                Display events on Kanban
        ===========================================================================
    */
    $scope.displayKanbanEvents = function() {
        for (group = 0; group < $scope.groups.length; group++) {
            var events = $scope.events[group];
            for (i = 0; i < events.length; i++) {
                if (isValidEvent(events[i])) {
                    var date = getDate(events[i].start);
                    var dateProp = toDateBR(getDateProperty(events[i].start));
                    if ($scope.filter == "" ||
                        $scope.filter == "month" && date.sameMonthYear($scope.monthYear) ||
                        $scope.filter == "week" && date.sameWeekYear($scope.monthYear, $scope.filter_week)) {
                        var clazz = getTextSize(events[i].summary);
                        var event_ref = group + '-' + i;
                        var event_item =
                            '<div class="row rowitens">' +
                            '<a href="#" class="list-group-item' + clazz + '" id="task' +
                            event_ref + '" ng-mouseover="flashFirebase(\'' +
                            event_ref + '\', \'' + dateProp + '\')" ng-click="openModals(\'' +
                            event_ref + '\', \'' + dateProp + '\'); $event.stopPropagation();"' +
                            ' draggable="true" ondragstart="drag(event)">' + events[i].summary +
                            '<span class="label label-info status Cstatus"' +
                            ' style="background-color:{{events[' + group + '][' + i + '].statusColor}}">' +
                            dateProp + '</span></a></div><hr>';
                        if ($("#" + events[i].status).length)
                            $("#" + events[i].status).append($compile(event_item)($scope));
                        else $("#NEW").append($compile(event_item)($scope));
                        $("#task" + event_ref).css('color', getRandomColor());
                    }
                }
            }
        }
    }

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
        if (text.length > 40) return " item-micro";
        else if (text.length > 18) return " item-tiny";
        else if (text.length > 10) return " item-small";
        else return "";
    }

    function getDate(eventDate) {
        if (eventDate.date != undefined)
            return new Date(eventDate.date);
        else if (eventDate.dateTime != undefined)
            return new Date(eventDate.dateTime);
        return new Date();
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
                                Menu Button Functionalities
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
            $("#motherTable").css("overflow", "auto");
        } else {
            $("#motherTable").css("background-color", "#111");
            $("#motherTable").css("height", "");
            $("#motherTable").css("width", "");
            $("#motherTable").css("overflow", "auto");
        }
        screenfull.toggle($("#motherTable")[0]);
    };

    $scope.select_month = function() {
        [month, year] = $("#monthPicker").val().split(' ');
        $scope.monthYear = new Date(year, returnMonth(month), 1);
        if ($scope.kanbanActive)
            $scope.display_kanban();
        else $scope.display_calendar();
    };

    /*
         ===========================================================================
                           Display Structures Functions
        ===========================================================================
    */

    $scope.display_calendar = function() {
        $scope.kanbanActive = false;
        $scope.create_calendar();
        $scope.requestFetch();
    }

    $scope.display_kanban = function() {
        $scope.kanbanActive = true;
        $scope.create_kanban();
        $scope.requestFetch();
    }

    /*
        ===========================================================================
                        Generating basic calendar structure
        ===========================================================================
    */

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

        var table = progressHTML(date, lastDay);
        table += '<table class="table table-bordered">' + menuHTML(date, "calendar");
        table += "<tr>";
        daysNames.forEach(function(dayName) { table += "<td>" + dayName + "</td>"; });
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

    /*
        ===========================================================================
                        Generating basic kanban structure
        ===========================================================================
    */

    $scope.create_kanban = function() {
        // Hoje
        var date = $scope.monthYear;
        // Último dia do mês
        var lastDay = new Date(date.getFullYear(), (date.getMonth() + 1) % 12, 0).getDate();

        // Lista de Status do Kanban
        var status_list = ["NEW", "TODO", "DEV", "TEST", "DONE"];

        var kanban = progressHTML(date, lastDay) +
            '<table id="kanban" class="table table-bordered">' +
            menuHTML(date, "kanban");

        status_list.forEach(function(status) { kanban += '<td>' + status + '</td>'; });
        kanban += '</tr><tr>';
        status_list.forEach(function(status) { kanban += '<td id="' + status + '"></td>'; });
        kanban += '</tr></table>';

        $scope.kanbanHTML = kanban;
        $("#motherTable").html($compile(kanban)($scope));
    }

    /*
         ===========================================================================
                                Auxialliary Structures
        ===========================================================================
    */

    function menuHTML(date, type) {
        var kanbanFilter = "";
        if (type == "kanban")
            kanbanFilter = '<span style="float:right;"><label>Filter: </label>' +
            '<select ng-model="filter" ng-change="display_kanban()" ng-click="$event.stopPropagation()">' +
            '<option value="month">Month</option><option value="week">Week</option><option value="">All</option></select>' +
            '<span ng-show="filter==\'week\'" style="display:block"><label>Week: </label><input type="number"' +
            ' ng-model="filter_week" ng-change="display_kanban()" ng-click="$event.stopPropagation()"/></span></span>';

        return '<tr><td COLSPAN=7 ng-click="monthPicker()">' +
            '<button class="btn btn-info" style="float:left;" ng-click="fullscreen();' +
            ' $event.stopPropagation()">FullScreen</button>' +
            '<i class="fa fa-calendar fa-2x farefresh"  style="float:left;"' +
            ' ng-click="display_calendar();  $event.stopPropagation()"></i>' +
            '<i class="fa fa-trello fa-2x farefresh trellofarefresh" style="float:left;"' +
            ' ng-click="display_kanban();  $event.stopPropagation()"></i>' +
            monthNames[date.getMonth()] + " " + date.getFullYear() +
            '<button class="btn btn-danger" style="float:right;">Change month</button>' +
            '<i class="fa fa-eye fa-2x farefresh eyefarefresh" ng-show="fbActive"' +
            ' ng-click="firebaseActive();  $event.stopPropagation()"></i>' +
            '<i class="fa fa-eye-slash fa-2x farefresh eyeslashfarefresh" ng-hide="fbActive"' +
            ' ng-click="firebaseActive();  $event.stopPropagation()"></i>' + kanbanFilter +
            '</td></tr>';
    }

    function progressHTML(date, lastDay) {
        var progress = Math.round(1000 * date.getDate() / lastDay) / 10;
        return '<div class="progress progress-striped"><div class="progress-bar" ' +
            'role="progressbar" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100"' +
            ' style="width:' + progress + '%">Month ' + progress + ' % Complete</div></div>';
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

/* Esc pressed */
$(document).keyup(function(e) {
    if (e.keyCode == 27)
        angular.element(document.getElementById('calendarVC')).scope().closeModal();
});

/*
 * Facebook
 */

window.fbAsyncInit = function() {
    FB.init({
        appId: '1321278234570954',
        xfbml: true,
        version: 'v2.8'
    });
    // Facebook Analytics
    FB.AppEvents.logEvent("calendar");
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/*
 * Google Analytics
 */
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '/js/analytics.js', 'ga');

ga('create', 'UA-60506552-2', 'auto');
ga('send', 'pageview');