import utils from './utils.js';

const DEFAULT_ALPHABET = 'fr';

const ITEM_COLOR_BLIND = 'color-blind';
const ITEM_DARK_MODE = 'dark';
const ITEM_ECHO_MODE = 'echo';
const ITEM_EVALUATIONS = 'evaluations';
const ITEM_GUESSES = 'guesses';
const ITEM_LANGUAGE = 'language';
const ITEM_LAST_PLAYED_DAY = 'lastPlayedDay';
const ITEM_SKIP_RULES = 'skipRules';
const ITEM_STATE = 'state';
const ITEM_STATES = 'states';

const STATE_VALUE_PLAYING = 'playing';
const STATE_VALUE_SUCCESS = 'success';
const STATE_VALUE_FAILURE = 'failure';

export default class GameStorage {

    constructor() {
        this.lang = this.getLang();
        this._upgradeIfNecessary();

        this.firstTime = !window.localStorage.getItem(ITEM_SKIP_RULES);
        window.localStorage.setItem(ITEM_SKIP_RULES, true);

        // check has played today
        // see https://github.com/renaudbedard/wordle-fr/
        const lastPlayedDay = parseInt(localStorage.getItem(ITEM_LAST_PLAYED_DAY));

        const today = new Date();
        const epoch = utils.epoch;
        const millisSinceEpoch = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0) - epoch;
        const daysSinceEpoch = Math.floor(millisSinceEpoch / 1000 / 60 / 60 / 24);

        if (lastPlayedDay != daysSinceEpoch) {
            console.log(`Now playing day ${daysSinceEpoch}`);
            window.localStorage.setItem(ITEM_LAST_PLAYED_DAY, '' + daysSinceEpoch);

            let states = this._getStates();
            Object.keys(states).forEach(lang => {
                delete states[lang].guesses;
                delete states[lang].evaluations;
                states[lang].state = STATE_VALUE_PLAYING;
            });
            window.localStorage.setItem(ITEM_STATES, JSON.stringify(states));
        }
    }

    firstTime() {
        return this.firstTime;
    }

    getDaysSinceEpoch() {
        return window.localStorage.getItem(ITEM_LAST_PLAYED_DAY);
    }

    getLang() {
        return window.localStorage.getItem(ITEM_LANGUAGE) || DEFAULT_ALPHABET;
    }
    setLang(lang) {
        this.lang = lang;
        return window.localStorage.setItem(ITEM_LANGUAGE, lang);
    }

    getGuesses() {
        let results = this._getState().guesses || [];
        return results;
    }
    setGuesses(guesses) {
        let states = this._getStates();
        if (states[this.lang]) {
            states[this.lang].guesses = guesses;
            window.localStorage.setItem(ITEM_STATES, JSON.stringify(states));
        }
    }

    getEvaluations() {
        let results = this._getState().evaluations || [];
        return results;
    }
    setEvaluations(evaluations) {
        let states = this._getStates();
        if (states[this.lang]) {
            states[this.lang].evaluations = evaluations;
            window.localStorage.setItem(ITEM_STATES, JSON.stringify(states));
        }
    }

    getState() {
        let results = this._getState().state || STATE_VALUE_PLAYING;
        return results;
    }
    onSuccess() {
        let states = this._getStates();
        if (states[this.lang]) {
            states[this.lang].state = STATE_VALUE_SUCCESS;
            window.localStorage.setItem(ITEM_STATES, JSON.stringify(states));
        }
    }
    onFailure() {
        let states = this._getStates();
        if (states[this.lang]) {
            states[this.lang].state = STATE_VALUE_FAILURE;
            window.localStorage.setItem(ITEM_STATES, JSON.stringify(states));
        }
    }
    getDarkMode() {
        return 'true' === window.localStorage.getItem(ITEM_DARK_MODE);
    }
    setDarkMode(enabled) {
        window.localStorage.setItem(ITEM_DARK_MODE, '' + enabled);
    }
    getColorBlind() {
        return 'true' === window.localStorage.getItem(ITEM_COLOR_BLIND);
    }
    setColorBlind(enabled) {
        window.localStorage.setItem(ITEM_COLOR_BLIND, '' + enabled);
    }
    getEchoMode() {
        return 'true' === window.localStorage.getItem(ITEM_ECHO_MODE);
    }
    setEchoMode(enabled) {
        window.localStorage.setItem(ITEM_ECHO_MODE, '' + enabled);
    }

    _getState() {
        return this._getStates()[this.lang];
    }

    _getStates() {
        let states = utils.parseJSON(window.localStorage.getItem(ITEM_STATES), null);
        if (!states) {
            states = {};
            window.localStorage.setItem(ITEM_STATES, JSON.stringify(states));
        }
        if (!states[this.lang]) {
            states[this.lang] = {state: STATE_VALUE_PLAYING};
            window.localStorage.setItem(ITEM_STATES, JSON.stringify(states));
        }
        return states;
    }

    _upgradeIfNecessary() {
        if (null !== window.localStorage.getItem(ITEM_GUESSES)) {
            let states = this._getStates(this.lang);

            states[this.lang].guesses = utils.parseJSON(window.localStorage.getItem(ITEM_GUESSES), []);
            window.localStorage.removeItem(ITEM_GUESSES);

            states[this.lang].evaluations = utils.parseJSON(window.localStorage.getItem(ITEM_EVALUATIONS), []);
            window.localStorage.removeItem(ITEM_EVALUATIONS);

            states[this.lang].state = utils.parseJSON(window.localStorage.getItem(ITEM_STATE), STATE_VALUE_PLAYING);

            window.localStorage.setItem(ITEM_STATES, JSON.stringify(states));
        }
    }
}
// vim: set ts=4 sw=4 expandtab:
