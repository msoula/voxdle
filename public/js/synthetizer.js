const SpeechSynthesis = window.speechSynthesis;

const SEPARATOR = '~';
const SEPARATOR_DELAY = 20;

export default class Synthetizer {

    constructor() {
        this.buffer = '';
    }

    setLocale(locale) {
        this.locale = locale;
    }

    isSpeaking() {
        return this.started;
    }

    speak(text, callback = () => {}) {
        this.buffer += text;
        this._process(callback);
        this.started = true;
    }

    _process(callback) {
        let pos = 0;

        let delay = 0;
        while (pos < this.buffer.length && SEPARATOR === this.buffer[pos]) {
            delay += SEPARATOR_DELAY;
            pos++;
        }
        this.buffer = this.buffer.substring(pos);
        if (delay) {
            return setTimeout(() => this._process(callback), delay);
        }

        pos = 0;
        let text = '';
        while (pos < this.buffer.length && SEPARATOR !== this.buffer[pos]) {
            text += this.buffer[pos];
            pos++;
        }
        this.buffer = this.buffer.substring(pos);
        if (text) {
            let utterThis = new SpeechSynthesisUtterance(text);
            utterThis.onend = () => this._process(callback);

            let voice = SpeechSynthesis.getVoices().find(voice => this.locale === voice.lang);
            if (voice) {
                utterThis.voice = voice;
            } else {
                utterThis.lang = this.locale;
            }

            return SpeechSynthesis.speak(utterThis);
        }

        this.started = false;
        callback();
    }
}

