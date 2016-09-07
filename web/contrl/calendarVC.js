var calendarApp = angular.module("calendarApp", ['ngCookies']);
var calendar;
var monthNames = ["Janeiro", "Fevereito", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

/*
  ===========================================================================
                    Calendar View Controller using Angular
  ===========================================================================
*/

calendarApp.controller("calendarVC", function($scope, $http, $cookieStore, $compile) {
    $scope.events = {};
    $scope.groups = {};

    $scope.doSome = function() {
        alert("Vamos editar esse bagulho ai");
    };

    $scope.research = function() {
        create_calendar();
        $scope.user = "";
        for (i = 0; i < $scope.groups.length; i++) {
            var group_checked = $scope.groups[i].checked;
            $cookieStore.put($scope.groups[i].id, group_checked);
            if (group_checked == true) {
                $http.get('/calendar/list' + i)
                    .then(function success(response) {
                        var calendario = response.data;
                        $scope.user += calendario.summary + "; ";
                        var events = calendario.items;
                        // Debug: $scope.user = calendario;
                        for (i = 0; i < events.length; i++) {
                            var date = events[i].start.date.split('T')[0];
                            var event_div = '<div id="task' + i + '" class="events" ng-click="doSome()">' +
                                events[i].summary + '</div>';
                            $("#" + date).html($compile($("#" + date).html() + event_div)($scope));
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
                var cookie = $cookieStore.get($scope.groups[i].id);
                if (cookie != undefined) {
                    $scope.groups[i].checked = cookie;
                }
            }
            $scope.research();
        });
});

/*
  ===========================================================================
                    Generating basic calendar structure
  ===========================================================================
*/

function create_calendar() {
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

    var table = "<table>";
    table += "<tr><td COLSPAN=7>" +
        monthNames[date.getMonth()] +
        date.getFullYear() +
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
            if ((i * 7 + j - firstWeekDay) > lastDay) {
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
            row += "<td id=" + dayDate.toISOString().split('T')[0] +
                " class=\"day";
            if (dayDate.sameDay(date)) {
                row += " today";
            } else if (dayDate < date || dayOut == true) {
                row += " day-gone";
            }
            row += "\"><span>" + dayString + "</span></td>";
        }
        table += (row + "</tr>");
    }
    table += "</table>";
    $("#motherTable").html(table);
}