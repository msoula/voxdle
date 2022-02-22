import { Locales } from './locales.js';

import Game from './game.js';

const element = document.getElementsByClassName('game')[0];

// start game and get valid keys
let game = new Game(element);
let keyRegExp = new RegExp(`^[${game.alphabet}]$`, 'i');

document.onclick = function(e) {
    e = e || window.event;
    game.onclick(e);
};

document.onkeydown = function(e) {
    e = e || window.event;

    let letter = e.key;
    if (keyRegExp.test(letter)) {
        game.onLettersSpelled([letter.toLowerCase()]);
    } else if ('Backspace' === letter) {
        game.onLettersSpelled([Locales.CANCEL]);
    } else if ('Enter' === letter) {
        game.onLettersSpelled([Locales.CONFIRM]);
    }
};

function onTick() {
    requestAnimationFrame(onTick);
    game.onTick();
}

// start ticker
onTick();

// vim: set ts=4 sw=4 expandtab:
