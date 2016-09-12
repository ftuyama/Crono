        var userLang = navigator.language || navigator.userLanguage;

        var final_transcript = '';
        var recognizing = false;
        var ignore_onend;

        if (!('webkitSpeechRecognition' in window)) {
            start_button.style.visibility = 'hidden';
        } else {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = function() {
                recognizing = true;
                document.getElementById("start_img").src = 'mic/mic-animate.gif';
            };

            recognition.onerror = function(event) {
                document.getElementById("start_img").src = 'mic/mic.gif';
                ignore_onend = true;
            };

            recognition.onend = function() {
                recognizing = false;
                if (ignore_onend) {
                    return;
                }
                document.getElementById("start_img").src = 'mic/mic.gif';
                if (!final_transcript) {
                    return;
                }
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
                final_transcript = capitalize(final_transcript);
                document.getElementById("summary_form").value = final_transcript;
            };
        }

        var first_char = /\S/;

        function capitalize(s) {
            return s.replace(first_char, function(m) {
                return m.toUpperCase();
            });
        }

        function startButton(event) {
            if (recognizing) {
                recognition.stop();
                return;
            }
            final_transcript = '';
            recognition.lang = userLang;
            recognition.start();
            ignore_onend = false;
            document.getElementById("start_img").src = 'mic/mic-slash.gif';
        }