import { Locales } from './locales.js';
import utils from './utils.js';

function sanitizeResult(language, transcript) {

    var letters = [];

    var words = utils.sanitizeWord(transcript).split(/[ .,;!?-]+/g);
    var checkLetter = false;
    words.forEach(word => {
        if (checkLetter) {
            var letter = language.alphabet.find(letter => -1 < letter.indexOf(word));
            if (letter) {
                letters.push(letter[0]);
            }
            checkLetter = false;
        } else {
            if (language.spellingPrefix === word) {
                checkLetter = true;
            } else if (-1 < language.cancel.indexOf(word)) {
                letters.push(Locales.CANCEL);
            } else if (-1 < language.check.indexOf(word)) {
                letters.push(Locales.CHECK);
            } else if (-1 < language.confirm.indexOf(word)) {
                letters.push(Locales.CONFIRM);
            } else if (-1 < language.reset.indexOf(word)) {
                letters.push(Locales.RESET);
            } else if (-1 < language.stop.indexOf(word)) {
                letters.push(Locales.STOP);
            }
        }

    });
    return letters;
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

export default class Recognizer {

    constructor(lang, callbacks) {

        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.available = true;

            var letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            var grammar = '#JSGF V1.0; grammar letters; public <letter> = ' + letters.join(' | ') + ' ;';
            var speechRecognitionList = new SpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1);

            this.recognition.grammars = speechRecognitionList;
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;

            this.recognition.onresult = event => {
                // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
                // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
                // It has a getter so it can be accessed like an array
                // The first [0] returns the SpeechRecognitionResult at the last position.
                // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
                // These also have getters so they can be accessed like arrays.
                // The second [0] returns the SpeechRecognitionAlternative at position 0.
                // We then return the transcript property of the SpeechRecognitionAlternative object

                if (!event.results || !event.results.length) return;

                var results = event.results[event.results.length - 1];
                if (!results || !results.length || !results[0].transcript) return;

                console.log(results[0].transcript);
                let letters = sanitizeResult(this.languageNormalized, results[0].transcript.toLowerCase());
                if (letters.length) {
                    callbacks.onResult(letters);
                } else {
                    callbacks.onNoResult();
                }
            };

            this.recognition.onaudiostart = (e) => console.log(e);
            this.recognition.onsoundstart = (e) => console.log(e);
            this.recognition.onspeechstart = (e) => console.log(e);
            this.recognition.onsoundend = (e) => console.log(e);
            this.recognition.onaudioend = (e) => console.log(e);
            this.recognition.onstart = (e) => console.log(e);
            this.recognition.onend = callbacks.onEnd;
            this.recognition.onspeechend = (e) => console.log(e);
            this.recognition.onnomatch = (e) => console.error(e);
            this.recognition.onerror = (e) => console.error(e);
        } else {
            this.available = false;
        }
    }

    setLocale(locale, language) {
        this.languageNormalized = {
            alphabet: language.letters.map(letter => letter.map(word => utils.sanitizeWord(word))),
            spellingPrefix: utils.sanitizeWord(language.spellingPrefix),
            cancel: language.cancel.map(word => utils.sanitizeWord(word)),
            check: language.check.map(word => utils.sanitizeWord(word)),
            confirm: language.confirm.map(word => utils.sanitizeWord(word)),
            reset: language.reset.map(word => utils.sanitizeWord(word)),
            stop: language.stop.map(word => utils.sanitizeWord(word)),
        };

        if (this.recognition) {
            this.recognition.lang = locale;
        }
    }

    isStarted() {
        return this.started;
    }

    start() {
        if (this.recognition) {
            this.started = true;
            this.recognition.start();
        }
    }

    stop() {
        if (this.recognition) {
            this.started = false;
            this.recognition.stop();
        }
    }

}

