/*
    Annyang!

    A tiny javascript SpeechRecognition library that lets your users control 
        your site with voice commands.

    annyang has no dependencies, weighs just 2 KB, and is free to use 
        and modify under the MIT license.
    https://github.com/TalAter/annyang
*/

var userLang = navigator.language || navigator.userLanguage;

if (annyang) {
    // Add our commands to annyang
    annyang.addCommands({
        'criar (evento)': function() {
            alert('Criar world!');
        },
        'editar (evento)': function() {
            alert('Editar world!');
        }
    });
    annyang.setLanguage(userLang);

    // Tell KITT to use annyang
    SpeechKITT.annyang();
    // Define a stylesheet for KITT to use
    SpeechKITT.setStylesheet('/script/speech/flat.css');

    // Add instructional texts
    SpeechKITT.setInstructionsText('Alguns comandos úteis…');
    SpeechKITT.setSampleCommands(['Criar evento', 'Editar evento']);

    // If user clicks start button, remember his choice for 1 minute
    SpeechKITT.rememberStatus(1);

    SpeechKITT.vroom();
}