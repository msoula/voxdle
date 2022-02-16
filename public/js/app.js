import { Context } from './context.js';
import { Locales } from './locales.js';

import Game from './game.js';

// load canvases into context
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

    // init
    if (!Context.time) {
        Context.frame = 0;
        Context.timeNextFrame = 0;
    }

    // get time since application started
    Context.currentTime = performance.now()/1000;
    while (Context.time < Context.currentTime) {
        while (Context.time < Context.timeNextFrame) {
            Context.time += 1/16384;
        }

        game.onTick();

        Context.frame++;
        Context.timeNextFrame += 1/60;
    }
}

// start ticker
onTick();

// vim: set ts=4 sw=4 expandtab:
