/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/

angular.module("calendarApp", ['ngCookies']).controller("calendarVC", function($scope, $http, $cookies, $compile) {
    // Variável do form
    $scope.event_form = { summary: '', description: '', group_id: '', startDate: '', startHour: '', endDate: '', endHour: '' };
    $scope.event_id = "";

    // Variáveis de negócio
    $scope.events = {};
    $scope.groups = {};

    // Varíaveis para definir Modal Form
    $scope.dateTime = false;
    $scope.create = false;
    $scope.edit = false;

    /*
        ===========================================================================
                        Manage user's decisions using Modal
        ===========================================================================
    */

    $scope.newEvent = function(id, selected_date) {
        /*  
         *   Id == 0 -> Event Creation
         *   Id != 0 -> Event Edition
         */
        $scope.create = $scope.edit = false;
        $scope.event_id = id = Number(id);
        if (id == -1) {
            $scope.create = true;
            $scope.event_form = {
                summary: "",
                description: "",
                startDate: toDateBR(selected_date),
                startHour: "",
                endDate: toDateBR(selected_date),
                endHour: "",
                group_id: 0
            };
        } else {
            $scope.edit = true;
            evento = $scope.events[id];
            $scope.event_form = {
                summary: evento.summary,
                description: evento.description,
                startDate: toDateBR(getDateProperty(evento.start)),
                startHour: getHourProperty(evento.start),
                endDate: toDateBR(getDateProperty(evento.end)),
                endHour: getHourProperty(evento.end),
                group_id: 0
            };
        }
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
        if ($scope.dateTime) {
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
        post["event_id"] = $scope.events[$scope.event_id].id;
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
            group_id: $scope.groups[$scope.event_form.group_id].id,
            event_id: $scope.events[$scope.event_id].id
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
                        Fetching Data from the Server
        ===========================================================================
    */

    $scope.fetch = function() {
        $scope.create_calendar();
        $scope.user = "";
        for (i = 0; i < $scope.groups.length; i++) {
            var group_checked = $scope.groups[i].checked;
            $cookies[$scope.groups[i].id] = group_checked;
            if (group_checked == true) {
                $http.get('/calendar/list' + i)
                    .then(function success(response) {
                        var calendario = response.data;
                        var events = calendario.items;
                        $scope.user += calendario.summary + "; ";
                        $scope.events = events;
                        // Debug: $scope.user = calendario;
                        for (i = 0; i < events.length; i++) {
                            var date = getDateProperty(events[i].start);
                            var tiny_class = getTextSize(events[i].summary.length);
                            var event_item = '<a href="#" class="list-group-item' + tiny_class +
                                '" id="task' + i + '" ng-click="newEvent(\'' + i +
                                '\', \'' + date + '\'); $event.stopPropagation();">' +
                                events[i].summary + '</a>';
                            $("#" + date).append($compile(event_item)($scope));
                            $("#task" + i).css('color', getRandomColor());
                        }
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
                    (cookie != undefined && cookie == "true");
            }
            $scope.fetch();
        });

    /*
        ===========================================================================
                        Auxialiary functions in javascript
        ===========================================================================
    */

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

    function toDateISO(date, hour) {
        var dateISO = date.slice(6, 10) + '-' + date.slice(3, 5) + '-' + date.slice(0, 2);
        if (hour.length < 5)
            return dateISO;
        return dateISO + 'T' + hour.slice(0, 5) + ":00-03:00";
    }

    function toDateBR(date) {
        return date.slice(8, 10) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4);
    }

    function getTextSize(length) {
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
    $scope.create_calendar = function() {
        // Hoje
        var date = new Date();
        // Data do dia do calendário
        var dayDate;
        // Primeiro dia do mês
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
        // Último dia do mês
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        // Dia da semana do primeiro dia
        var firstWeekDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        // Quantos dias teve último mês
        var lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

        var table = '<table class="table table-bordered">';
        table += "<tr><td COLSPAN=7>" +
            monthNames[date.getMonth()] + " " +
            date.getFullYear() + "</td></tr>";
        table += "<tr>" +
            "<td>Dom</td>" + "<td>Seg</td>" +
            "<td>Ter</td>" + "<td>Qua</td>" +
            "<td>Qui</td>" + "<td>Sex</td>" +
            "<td>Sab</td>" + "</tr>"
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
                row += '<td class="day';
                if (dayDate.sameDay(date)) {
                    row += " today";
                } else if (dayDate < date || dayOut == true) {
                    row += " day-gone";
                }
                row += '" ng-click="newEvent(-1, \'' + dateString +
                    '\')"><div id="' + dateString + '" class="list-group">' +
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
        $("#motherTable").html($compile(table)($scope));
    }

    var monthNames = ["Janeiro", "Fevereito", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

});