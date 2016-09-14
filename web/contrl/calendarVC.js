var monthNames = ["Janeiro", "Fevereito", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

/*
===========================================================================
            Calendar View Controller using Angular
===========================================================================
*/

angular.module("calendarApp", ['ngCookies']).controller("calendarVC", function($scope, $http, $cookies, $compile) {
    // Variável do form
    $scope.event_form = { summary: '', description: '', group_id: '', startDate: '', startHour: '', endDate: '', endHour: '' };

    // Variáveis de negócio
    $scope.events = {};
    $scope.groups = {};

    // Varíaveis para definir Modal Form
    $scope.create = false;
    $scope.edit = false;

    /*  Gerencia tomada de decisões usando Modal */

    $scope.newEvent = function(id, selected_date) {
        /*  
         *   Id == 0 -> Event Creation
         *   Id != 0 -> Event Edition
         */
        $scope.create = $scope.edit = false;
        id = Number(id);
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
            // Preencher dados do evento
        }
        $("#formModal").modal('show');
    };

    $scope.closeModal = function() {
        $("#formModal").modal('hide');
    };

    /*  Eventos de POST para o servidor */

    $scope.postCreateEvent = function(selected_date) {
        // Deixar group_id como opção
        var post = {
            group_id: $scope.groups[1].id,
            new_event: {
                summary: "Evento de teste",
                start: { date: selected_date },
                end: { date: selected_date }
            }
        };
        showSnackBar("Criando novo evento...");
        $http.post('/calendar/create', JSON.stringify(post))
            .then(function success(response) {
                showSnackBar("Evento criado com sucesso!");
                $scope.fetch();
            });
        showSnackBar("Evento criado com sucesso!");
        $scope.create = false;
    }

    $scope.postEditEvent = function(id) {
        // Ver como faz para editar
        showSnackBar("Evento editado com sucesso!");
        $scope.edit = false;
    }

    $scope.postDeleteEvent = function(selected_date) {
        // Ver como faz para deletar
        showSnackBar("Evento deletado com sucesso!");
        $scope.create = $scope.edit = true;
    };

    /*  Fetching data do servidor   */

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

    /*  Funções auxiliares  */

    function toDateBR(date) {
        var d = new Date(date);
        return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
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
});