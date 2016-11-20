/*
    Annyang!

    A tiny javascript SpeechRecognition library that lets your users control 
        your site with voice commands.

    annyang has no dependencies, weighs just 2 KB, and is free to use 
        and modify under the MIT license.
    https://github.com/TalAter/annyang
*/

var userLang = navigator.language || navigator.userLanguage;

var translator = {
    'pt-BR': {
        'create-event': "Criando evento...",
        'update': "Atualizando",
        'login': "Fazendo login...",
        'calendar': "Mostrando calendário...",
        'kanban': "Mostrando kanban...",
        'commands': 'Alguns comandos úteis…',
        'samples': ['Criar evento', 'Atualizar', 'Login']
    },
    'en-US': {
        'create-event': "Creating event...",
        'update': "Updating",
        'login': "Signing in...",
        'calendar': "Displaying calendar...",
        'kanban': "Displaying kanban...",
        'commands': 'Some cool tips…',
        'samples': ['create event', 'update', 'login']

    }
}

$(document).ready(function() {
    if (annyang) {
        // Add our commands to annyang
        annyang.addCommands({
            'criar (evento)': function() {
                showSnackBar(translator[userLang].create + "-" + event);
                angular.element(document.getElementById('calendarVC'))
                    .scope().newEvent("0-666", (new Date()).toISOString().split('T')[0]);
            },
            'atualizar': function() {
                showSnackBar(translator[userLang].update);
                angular.element(document.getElementById('calendarVC'))
                    .scope().display();
            },
            'login': function() {
                showSnackBar(translator[userLang].login);
                $(location).attr('href', 'calendarAuth/');
            },
            'calendário': function() {
                showSnackBar(translator[userLang].calendar);
                angular.element(document.getElementById('calendarVC'))
                    .scope().display_calendar();
            },
            'kanban': function() {
                showSnackBar(translator[userLang].kanban);
                angular.element(document.getElementById('calendarVC'))
                    .scope().display_kanban();
            }
        });
        annyang.setLanguage(userLang);

        // Tell KITT to use annyang
        SpeechKITT.annyang();
        // Define a stylesheet for KITT to use
        SpeechKITT.setStylesheet('/script/speech/flat.css');

        // Add instructional texts
        SpeechKITT.setInstructionsText(translator[userLang].commands);
        SpeechKITT.setSampleCommands(translator[userLang].samples);

        // If user clicks start button, remember his choice for 1 minute
        SpeechKITT.rememberStatus(1);

        SpeechKITT.vroom();
    }
});