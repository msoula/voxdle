import { Collections } from './collections.js';
import { Locales } from './locales.js';
import { Sounds } from './sounds.js';

import helpModal from './help-modal.js';
import settingsModal from './settings-modal.js';
import statsModal from './stats-modal.js';
import randomizer from './random.js';
import utils from './utils.js';

import GameStorage from './storage.js';
import Grid from './grid.js';
import Keyboard from './keyboard.js';
import Recognizer from './recognizer.js';
import Synthetizer from './synthetizer.js';

const STARTING = 'STARTING';
const GUESSING = 'GUESSING';
const SUCCESS  = 'SUCCESS';
const FAILURE  = 'FAILURE';

const MAX_TRIES = 6;
const LETTER_ACTION_DELAY = 100;

const SHARE_GUESS_CORRECT = '\ud83d\udfe9'; // green square emoji
const SHARE_GUESS_PRESENT = '\ud83d\udfe7'; // orange square emoji
const SHARE_GUESS_ABSENT  = '\u2b1b'; // large black square emoji
const VALIDITY_SYMBOLS    = [SHARE_GUESS_ABSENT, SHARE_GUESS_PRESENT, SHARE_GUESS_CORRECT];

const FLAGS = {
    fr: '\ud83c\uddeb\ud83c\uddf7',
    en: '\ud83c\uddec\ud83c\udde7'
};

const MAX_TIME_BEFORE_MUTE = 30*1000;

export default class Game {

    constructor(element) {
        this.element     = element;

        this.state       = STARTING;
        this.collection = {};
        this.inputBuffer = '';
        this.current     = 0;

        this.storage     = new GameStorage();
        this.evaluations = [];
        this.guesses     = [];

        this.recognizer  = null; // speech recognition tool
        this.synthetizer = null; // speech synthesis tool
        this.recogTime   = -1;   // recognition timer

        this.keys       = [];    // valid keys, depending on the keyboard
        this.alphabet   = '';    // valid chars that may be entered
        this.hasDigrams = false; // whether current alphabet has digrams or trigrams

        this.grid     = new Grid(this.element.getElementsByClassName('grid')[0], MAX_TRIES);
        this.keyboard = new Keyboard(this.element.getElementsByClassName('keyboard')[0], this);

        this.titleElement = this.element.getElementsByClassName('title')[0];
        this.helpBtn      = this.element.getElementsByClassName('icon-help')[0];
        this.micBtn       = this.element.getElementsByClassName('icon-microphone')[0];
        this.statsBtn     = this.element.getElementsByClassName('icon-stats')[0];
        this.settingsBtn  = this.element.getElementsByClassName('icon-settings')[0];

        if (this.helpBtn) {
            this.helpBtn.onclick = () => this.showHelpModal();
        }
        if (this.micBtn) {
            this.micBtn.onclick = () => this.startRecog(true);
        }
        if (this.statsBtn) {
            this.statsBtn.onclick = () => this.showStatsModal();
        }
        if (this.settingsBtn) {
            this.settingsBtn.onclick = () => this.showSettingsModal();
        }
        if (this.storage.getDarkMode()) {
            document.documentElement.classList.add('dark');
        }
        if (this.storage.getColorBlind()) {
            document.documentElement.classList.add('color-blind');
        }

        this.setLocale(this.storage.getLang());
        if (this.storage.firstTime) {
            setTimeout(() => this.showHelpModal(), 500);
        }

    }

    // update game with new locale data
    setLocale(lang) {
        if (this.lang === lang) return;

        // change locale
        this.lang = lang;
        this.storage.setLang(this.lang);

        const locale = Locales[this.lang];

        // reload allowed keys and chars
        this.alphabet = '';
        this.keys.length = 0;
        this.hasDigrams = false;
        locale.keyboard.forEach(row => {
            row.forEach(key => {
                if (Locales.CONFIRM === key || Locales.CANCEL === key) return;

                // check digrams and complete chars list
                this.hasDigrams |= 1 < key.length;
                for (let letterPos = 0; letterPos < key.length; ++letterPos) {
                    if (-1 === this.alphabet.indexOf(key[letterPos])) {
                        this.alphabet += key[letterPos];
                    }
                }

                this.keys.push(key);
            });
        });

        // update view
        document.title = locale.title;
        if ('en' === lang) {
            document.documentElement.classList.add('en');
        } else {
            document.documentElement.classList.remove('en');
        }
        this.titleElement.textContent = `VOXDLE [${this.lang.toUpperCase()}]`;
        this.helpBtn.ariaLabel     = locale.accessibility.help;
        this.settingsBtn.ariaLabel = locale.accessibility.settings;
        this.statsBtn.ariaLabel    = locale.accessibility.stats;
        if (this.micBtn) {
            if (!this.recognizer || !this.recognizer.isStarted()) {
                this.micBtn.ariaLabel = locale.accessibility.turnOnMic;
            } else {
                this.micBtn.ariaLabel = locale.accessibility.turnOffMic;
            }
        }
        this.keyboard.setLayout(locale.accessibility, locale.keyboard);

        // update speech tools if necessary
        if (this.recognizer) {
            if (this.recognizer.isStarted()) {
                this.stopRecog(true);
            }
            this.recognizer.setLocale(locale.locale, locale.language);
            this.synthetizer.setLocale(locale.locale);
        }

        Collections.load(this.lang, (collection) => this.loadCollection(collection));
    }

    // load words list and select reference word
    loadCollection(collection) {
        if (!collection) return;
        this.collection = collection;

        const daysSinceEpoch = this.storage.getDaysSinceEpoch();
        if (!collection.randomized) {
            /**
             * Got this from https://github.com/renaudbedard/wordle-fr/
             * Thanks R.Bedard
             */
            randomizer.shuffle(collection.wordles);
            collection.randomized = true;
        }

        let reference = collection.wordles[daysSinceEpoch % collection.wordles.length];

        // decompose wordle into keys
        reference.keys = [];
        for (let idx = 0; idx < reference.clean.length; ) {
            let best = '';
            // get the best key (because of digrams)
            this.keys.forEach(key => {
                if (idx === reference.clean.indexOf(key, idx) && best.length < key.length) {
                    best = key;
                }
            });
            reference.keys.push(best);
            idx += best.length;
        }

        this.reference = reference;
        this.referenceLength = this.reference.keys.length;
        console.log('reference:', this.reference);

        // reset game state
        this.inputBuffer = '';
        this.currentWord = [];
        this.evaluations = this.storage.getEvaluations();
        this.guesses     = this.storage.getGuesses();
        this.current     = this.guesses.length;

        // decompose guesses into keys
        let guessesLetters = this.guesses.map(guess => {
            let result = [];
            for (let idx = 0; idx < guess.clean.length; ) {
                let best = '';
                // get the best key (because of digrams)
                this.keys.forEach(key => {
                    if (idx === guess.clean.indexOf(key, idx) && best.length < key.length) {
                        best = key;
                    }
                });
                result.push(best);
                idx += best.length;
            }
            return result;
        });

        this.grid.init(guessesLetters, this.evaluations);
        this.keyboard.init(guessesLetters, this.evaluations);

        // game state may change with locale
        let storageState = this.storage.getState();
        if ('success' === storageState) {
            this.onSuccess();
        } else if ('failure' === storageState) {
            this.onFailure();
        } else {
            this.state = GUESSING;
        }
    }

    initRecog(locale) {
        this.recognizer = new Recognizer(this.lang, {
            onResult: (result) => this.onLettersSpelled(result),
            onNoResult: () => this.onNoLetterRecognized(),
            onEnd: () => this.onRecognizerEnded(),
        });
        this.recognizer.setLocale(locale.locale, locale.language);

        this.synthetizer = new Synthetizer();
        this.synthetizer.setLocale(locale.locale);

        // load sounds
        Sounds.load(() => {});
    }

    startRecog(verbose) {
        const locale = Locales[this.lang];
        if (GUESSING !== this.state) {
            return this.showSnackbar(locale.snacks.gameOver);
        }

        if (!this.recognizer) {
            this.initRecog(locale);
        }

        if (this.recognizer.available) {
            if (!this.recognizer.isStarted()) {

                this.recogTime = Date.now();

                if (verbose && this.storage.getEchoMode()) {
                    this.synthetizer.speak(locale.tts.micTurnOn, () => {
                        this.recognizer.start()
                    });
                } else {
                    this.recognizer.start();
                }
            }
            if (verbose) {
                if (!this.storage.getEchoMode()) {
                    Sounds.play('TURN_ON_MIC');
                }
                this.showHelpMicroModal();
            }

            this.stopped = false;

            // update mic control
            this.micBtn.ariaLabel = locale.accessibility.turnOffMic;
            this.micBtn.children[0].className = 'fas fa-microphone-slash fa-lg';
            this.micBtn.onclick = () => this.stopRecog(true);
        } else {
            // speech recogntion is not available on this platform
            this.showSnackbar(locale.snacks.micDisable);
            this.micBtn.remove();
            this.micBtn = null;
        }
    }

    stopRecog(verbose) {
        if (!this.recognizer || !this.recognizer.isStarted()) return;

        const locale = Locales[this.lang];

        this.recogTime = -1;
        this.stopped = true;
        this.recognizer.stop();

        this.micBtn.ariaLabel = locale.accessibility.turnOnMic;
        this.micBtn.children[0].className = 'fas fa-microphone fa-lg';
        this.micBtn.onclick = () => this.startRecog(verbose);

        if (verbose) {
            if (this.storage.getEchoMode()) {
                this.synthetizer.speak(locale.tts.micTurnOff);
            } else {
                Sounds.play('TURN_OFF_MIC');
            }
            this.showSnackbar(locale.snacks.micTurnOff, 1000);
        }
    }

    onTick() {
        if (0 < this.recogTime && MAX_TIME_BEFORE_MUTE < Date.now() - this.recogTime) {
            this.stopRecog(true);
            this.recogTime = -1;
        }

        let modals = this.element.getElementsByClassName('modal');
        if (!modals.length) return;

        let modal = modals[modals.length - 1];
        const today = new Date();
        const millisToNextDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1, 0, 0, 0, 0) - today.getTime();
        statsModal.updateCountdown(modal, millisToNextDay);
    }

    showHelpModal() {
        this.element.appendChild(helpModal.build(Locales[this.lang]));
    }

    showHelpMicroModal() {
        this.element.appendChild(helpModal.buildMicro(Locales[this.lang]));
    }

    share(e) {
        let button = e.target;
        if ('i' === button.tagName.toLowerCase()) {
            button = button.parentNode;
        }

        let text = '';
        if (SUCCESS === this.state || FAILURE === this.state) {
            let step = SUCCESS === this.state ? this.current : 'X';
            text += `voxdle ${FLAGS[this.lang]} #${this.storage.getDaysSinceEpoch()} ${step}/6\n`;
            this.evaluations.forEach(evaluation => {
                evaluation.forEach(validity => text += VALIDITY_SYMBOLS[validity]);
                text += '\n'
            });
        }
        utils.copyClipboard(text, (err) => {
            if (!err) {
                this.showSnackbar(Locales[this.lang].snacks.sharedClipboard);
                button.innerHTML = `<i class="fas fa-copy"></i>&nbsp;${Locales[this.lang].stats.shared}`;
            }
        });
    }

    showStatsModal() {
        let modal = statsModal.build(
            Locales[this.lang],
            SUCCESS === this.state || FAILURE === this.state ? this.reference.word : null,
            (e) => this.share(e)
        );
        this.element.appendChild(modal);
    }

    showSettingsModal() {
        let modal = settingsModal.build(Locales[this.lang], this.storage.getDarkMode(), this.storage.getColorBlind(), this.storage.getEchoMode());

        // add dark mode change listener
        const localeSettings = Locales[this.lang].settings
        let inputs = modal.getElementsByClassName('dark-mode-ctrl');
        if (inputs.length) {
            let input = inputs[0];
            input.onchange = () => {
                // update aria label
                if (input.checked) {
                    input.parentNode.ariaLabel = localeSettings.darkMode.ariaLabelChecked;
                    document.documentElement.classList.add('dark');
                } else {
                    input.parentNode.ariaLabel = localeSettings.darkMode.ariaLabelUnchecked;
                    document.documentElement.classList.remove('dark');
                }
                this.storage.setDarkMode(input.checked);
            }
        }
        inputs = modal.getElementsByClassName('color-blind-ctrl');
        if (inputs.length) {
            let input = inputs[0];
            input.onchange = () => {
                // update aria label
                if (input.checked) {
                    input.parentNode.ariaLabel = localeSettings.colorBlind.ariaLabelChecked;
                    document.documentElement.classList.add('color-blind');
                } else {
                    input.parentNode.ariaLabel = localeSettings.colorBlind.ariaLabelChecked;
                    document.documentElement.classList.remove('color-blind');
                }
                this.storage.setColorBlind(input.checked);
            }
        }
        inputs = modal.getElementsByClassName('echo-ctrl');
        if (inputs.length) {
            let input = inputs[0];
            input.onchange = () => {
                // update aria label
                if (input.checked) {
                    input.parentNode.ariaLabel = localeSettings.echo.ariaLabelChecked;
                } else {
                    input.parentNode.ariaLabel = localeSettings.echo.ariaLabelChecked;
                }
                this.storage.setEchoMode(input.checked);
            }
        }
        inputs = modal.getElementsByClassName('lang-ctrl');
        for (let idx = 0; idx < inputs.length; ++idx) {
            let input = inputs[idx];
            input.onclick = () => this.setLocale(input.value.toLowerCase());
        }

        this.element.appendChild(modal);
    }

    showSnackbar(message, duration = 2500) {
        let snack = document.createElement('div');
        snack.className = 'snackbar show';
        snack.innerHTML = `<div class="snackbar-content">${message}</div>`;
        document.body.appendChild(snack);
        setTimeout(() => snack.remove(), duration);
    }

    onLettersSpelled(letters) {
        if (GUESSING !== this.state) return;
        if (!letters || !letters.length) return;

        const locale = Locales[this.lang];

        let recogStarted = false;
        let tts = '';
        if (this.recognizer && this.recognizer.isStarted()) {
            recogStarted = true;
            this.recogTime = Date.now();
        }

        letters.forEach((letter, idx) => {
            if (Locales.CANCEL === letter) {
                // clear input buffer
                if (this.inputBuffer) {
                    this.inputBuffer = '';
                    return;
                }

                if (recogStarted) {
                    tts = tts.slice(0, -1);
                }

                // remove last letter
                if (this.currentWord.length) {
                    let letterPos    = this.currentWord.length - 1;
                    this.currentWord = this.currentWord.slice(0, -1);

                    // delay visual updates
                    setTimeout(() => {
                        if (recogStarted && !this.storage.getEchoMode()) {
                            Sounds.play('REMOVE_LETTER');
                        }
                        this.grid.onLetterCancel(this.current, letterPos);
                    }, idx*LETTER_ACTION_DELAY);
                }

            } else if (Locales.CHECK === letter) {
                this.checkGuess();
            } else if (Locales.CONFIRM === letter) {
                // cannot confirm while synthetizer is speaking
                if (!this.synthetizer || !this.synthetizer.isSpeaking()) {
                    this.confirmGuess(idx*LETTER_ACTION_DELAY);
                }
            } else if (Locales.RESET === letter) {
                this.currentWord = [];
                this.inputBuffer = '';

                if (recogStarted) {
                    tts = '';
                }

                // delay visual updates
                setTimeout(() => {
                    if (recogStarted && !this.storage.getEchoMode()) {
                        Sounds.play('ERASE_WORD');
                    }
                    this.grid.clear(this.current);
                }, idx*LETTER_ACTION_DELAY);
            } else if (Locales.STOP === letter) {
                this.stopRecog(true);
            } else if (this.referenceLength > this.currentWord.length) {

                // using input buffer to handle digrams
                if (this.hasDigrams) {
                    let found = '';
                    let partial = '';

                    let tmp = this.inputBuffer + letter;
                    for (let charIdx = 0; !found && charIdx < this.keys.length; ++charIdx) {
                        let key = this.keys[charIdx];
                        if (0 === key.indexOf(tmp)) {
                            partial = tmp;
                            if (key.length === tmp.length) {
                                found = tmp;
                            }
                        }
                    }
                    if (partial) {
                        this.inputBuffer = partial;
                    }
                    if (!found) return;
                } else {
                    this.inputBuffer += letter;
                }

                if (recogStarted) {
                    tts += locale.phonetics[this.inputBuffer] + '~';
                }

                let row       = this.current;
                let letterPos = this.currentWord.length;
                let input     = this.inputBuffer;

                this.currentWord.push(input);
                this.inputBuffer = '';

                // delay visual updates
                setTimeout(() => {
                    if (recogStarted && !this.storage.getEchoMode()) {
                        Sounds.play('ADD_LETTER');
                    }
                    this.grid.onLetterSpelled(row, letterPos, input);
                }, idx*LETTER_ACTION_DELAY);
            }
        });

        if (this.storage.getEchoMode()) {

            if (recogStarted && tts) {
                this.stopRecog();
                this.synthetizer.speak(tts.slice(0, -1), () => this.startRecog());
            }
        }
    }

    onNoLetterRecognized() {
        if (GUESSING !== this.state) return;

        if (this.recognizer && this.recognizer.isStarted()) {
            this.recogTime = Date.now();

            // play
            this.stopRecog();
            this.synthetizer.speak(Locales[this.lang].tts.recogFailed, () => this.startRecog());
        }
    }

    onRecognizerEnded() {
        // automatically restart recognition
        if (GUESSING === this.state && !this.stopped) {
            this.recognizer.start();
        }
    }

    confirmGuess(delay) {
        if (this.referenceLength !== this.currentWord.length) return;

        let currentWord = this.currentWord.join('');
        let item = this.collection.words.find(item => item.clean === currentWord);
        if (item) {
            this.guesses.push(item);

            let reference = this.reference.keys;

            let stats = {};
            for (let idx = 0; idx < reference.length; ++idx) {
                let letter = reference[idx];
                let stat = stats[letter];
                if (!stat) {
                    stat = {count: 0};
                    stats[letter] = stat;
                }
                if (this.currentWord[idx] !== reference[idx]) {
                    stat.count++;
                }
            }

            let score = 0;
            let evaluation = [];
            for (let idx = 0; idx < this.currentWord.length; ++idx) {
                let letter = this.currentWord[idx];
                if (letter === reference[idx]) {
                    this.keyboard.onLetterValidity(letter, 2);
                    evaluation.push(2);
                    score++;
                } else if (-1 < reference.indexOf(letter) && 0 < stats[letter].count) {
                    this.keyboard.onLetterValidity(letter, 1);
                    evaluation.push(1);
                    stats[letter].count--;
                } else {
                    this.keyboard.onLetterValidity(letter, 0);
                    evaluation.push(0);
                }
            }
            this.evaluations.push(evaluation);

            // delay visual updates
            let currentRow = this.current;
            setTimeout(() => {
                this.grid.validate(currentRow, evaluation);
            }, delay);

            // store game updates
            this.storage.setEvaluations(this.evaluations);
            this.storage.setGuesses(this.guesses);

            // check results
            if (this.referenceLength === score) {
                this.onSuccess();
            } else if (MAX_TRIES === this.current + 1) {
                this.onFailure();
            } else {
                if (this.recognizer && this.recognizer.isStarted()) {
                    if (this.storage.getEchoMode()) {
                        this.checkGuess(this.current);
                    } else {
                        Sounds.play('INVALID_GUESS');
                    }
                }
            }

            this.currentWord = [];
            this.current++;

        } else {
            this.grid.onInvalidWord(this.current);
            this.showSnackbar(Locales[this.lang].snacks.unknownWord);

            if (recogStarted) {
                if (this.storage.getEchoMode()) {
                    this.stopRecog();
                    this.synthetizer.speak(Locales[this.lang].tts.unknownWord, () => this.startRecog());
                } else {
                    Sounds.play('INVALID_WORD');
                }
            }
        }
    }

    spellGuess(tts, phonetics, guessIdx) {
        const tries = tts.tries;

        if (guessIdx < 0 || this.guesses.length <= guessIdx) return '';
        const guess = this.guesses[guessIdx];

        let message = `${tries[guessIdx]}.`;
        message += tts.formatWord(guess.word);
        for (let pos = 0; pos < guess.clean.length; pos++) {
            let evaluation = this.evaluations[guessIdx];
            message += tts.formatLetterSpellAndEval(phonetics[guess.clean[pos]], evaluation[pos]);
        }
        return message;
    }

    checkGuess(guessIdx = -1) {
        if (!this.synthetizer) return;

        const tts = Locales[this.lang].tts;

        let message = '';
        if (!this.current && !this.currentWord.length) {
            message = tts.starting;
        } else if (FAILURE === this.state) {
            message = tts.formatFailure(this.reference.word);
        } else if (SUCCESS === this.state) {
            message = tts.formatSuccess(this.reference.word);
        } else {
            const phonetics = Locales[this.lang].phonetics;
            if (-1 === guessIdx) {
                this.guesses.forEach((guess, idx) => {
                    message += this.spellGuess(tts, phonetics, idx);
                });
                if (this.currentWord.length) {

                    message += tts.lettersCurrentlySpelled;
                    for (let pos = 0; pos < this.currentWord.length; ++pos) {
                        message += tts.formatLetterSpell(phonetics[this.currentWord[pos]]);
                    }
                }
            } else {
                message += this.spellGuess(tts, phonetics, guessIdx);
            }
            message += tts.playTime;
        }

        if (message) {
            this.stopRecog();
            this.synthetizer.speak(message, () => this.startRecog());
        }
    }

    onSuccess() {
        this.state = SUCCESS;
        this.storage.onSuccess();
        if (this.recognizer && this.recognizer.isStarted()) {
            if (this.storage.getEchoMode()) {
                this.synthetizer.speak(Locales[this.lang].tts.formatSuccess(this.reference.word));
            } else {
                Sounds.play('GAME_WON');
            }
            this.stopRecog();
        }
        setTimeout(() => this.showStatsModal(), 2000);
    }

    onFailure() {
        this.state = FAILURE;
        this.storage.onFailure();
        if (this.recognizer && this.recognizer.isStarted()) {
            if (this.storage.getEchoMode()) {
                this.synthetizer.speak(Locales[this.lang].tts.formatFailure(this.reference.word));
            } else {
                Sounds.play('GAME_LOST');
            }
            this.stopRecog();
        }

        setTimeout(() => this.showStatsModal(), 2000);
    }

    onclick(event) {
        let modals = this.element.getElementsByClassName('modal');
        if (modals.length) {
            let modal = modals[modals.length - 1];
            if (modal === event.target) {
                modal.remove();
            }
        }
    }

}


// vim: set ts=4 sw=4 expandtab:
