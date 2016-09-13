var userLang = navigator.language || navigator.userLanguage;

var final_transcript = '';
var recognizing = false;
var mic_img_id;
var dest_form_id;
var ignore_onend;

if (!('webkitSpeechRecognition' in window)) {
    start_button.style.visibility = 'hidden';
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        document.getElementById(mic_img_id).src = 'speech/mic-animate.gif';
    };

    recognition.onerror = function(event) {
        document.getElementById(mic_img_id).src = 'speech/mic.gif';
        ignore_onend = true;
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        document.getElementById(mic_img_id).src = 'speech/mic.gif';
        if (!final_transcript) {
            return;
        }
        document.getElementById(dest_form_id).value = capitalize(final_transcript);
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        document.getElementById(dest_form_id).value = interim_transcript;
    };
}

var first_char = /\S/;

function capitalize(s) {
    return s.replace(first_char, function(m) {
        return m.toUpperCase();
    });
}

function startButton(event, form_id, img_id) {
    if (recognizing) {
        document.getElementById(mic_img_id).src = 'speech/mic.gif';
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = userLang;
    recognition.start();
    ignore_onend = false;
    mic_img_id = img_id;
    dest_form_id = form_id;
    document.getElementById(mic_img_id).src = 'speech/mic-slash.gif';
}