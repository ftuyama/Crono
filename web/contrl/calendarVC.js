/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/

angular.module("calendarApp", ['ngCookies']).controller("calendarVC", function($scope, $http, $cookies, $compile) {
    // Variável do form
    $scope.event_form = { summary: '', description: '', group_id: '', startDate: '', startHour: '', endDate: '', endHour: '' };
    $scope.event_id = "";
    $scope.event_group = "";

    // Variável de calendário
    $scope.monthYear = new Date();

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

    $scope.fetch = function() {
        $scope.create_calendar();
        $scope.user = "";
        $scope.events = [];
        for (j = 0; j < $scope.groups.length; j++) {
            $scope.events.push([]);
        }
        for (j = 0; j < $scope.groups.length; j++) {
            var group_checked = $scope.groups[j].checked;
            $cookies[$scope.groups[j].id] = group_checked;
            if (group_checked == true) {
                $http.get('/calendar/list' + j)
                    .then(function success(response) {
                        var calendario = response.data;
                        var events = calendario.items;
                        var group = Number(response.data.group_id);
                        $scope.user += calendario.summary + "; ";
                        $scope.events[group] = events;
                        // Debug: $scope.user = calendario;
                        for (i = 0; i < events.length; i++) {
                            var date = getDateProperty(events[i].start);
                            var tiny_class = getTextSize(events[i].summary.length);
                            var event_item = '<a href="#" class="list-group-item' + tiny_class +
                                '" id="task' + group + '-' + i + '" ng-click="newEvent(\'' +
                                group + '-' + i + '\', \'' + date + '\'); $event.stopPropagation();"' +
                                'draggable="true" ondragstart="drag(event)">' +
                                events[i].summary + '</a>';
                            $("#" + date).append($compile(event_item)($scope));
                            $("#task" + group + '-' + i).css('color', getRandomColor());
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

    $scope.monthPicker = function() {
        showSnackBar("Criando novo evento...");
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

    function returnMonth(month) {
        month = month.trim();
        return monthNames.indexOf(month);
    }

    /*
        ===========================================================================
                        Generating basic calendar structure
        ===========================================================================
    */

    $scope.select_month = function() {
        [month, year] = $("#monthPicker").val().split(' ');
        $scope.monthYear = new Date(year, returnMonth(month), 1);
        $scope.create_calendar();
    };

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

        var table = '<table class="table table-bordered">';
        table += '<tr><td COLSPAN=7 ng-click="monthPicker()">' +
            '<button class="btn btn-success" style="float:left;" ng-click="newEvent(\'0-666\', \'' +
            date.toISOString().slice(0, 10) + '\')">Add event</button>' +
            monthNames[date.getMonth()] + " " + date.getFullYear() +
            '<button class="btn btn-danger" style="float:right;">Change month</button>' +
            "</td></tr>";
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
                row += '<td id="day-' + dateString + '" class="day';
                if (dayDate.sameDay(date)) {
                    row += " today";
                } else if (dayDate < date || dayOut == true) {
                    row += " day-gone";
                }
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
        $("#motherTable").html($compile(table)($scope));
    }

    var monthNames = ["Janeiro", "Fevereito", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

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