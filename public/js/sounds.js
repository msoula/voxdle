const assets = [
    {id: 'TURN_ON_MIC', src: 'assets/snd/turn-on-mic.ogg', type: 'snd'},
    {id: 'TURN_OFF_MIC', src: 'assets/snd/turn-off-mic.ogg', type: 'snd'},

    {id: 'ADD_LETTER', src: 'assets/snd/add-letter.ogg', type: 'snd'},
    {id: 'ERASE_WORD', src: 'assets/snd/erase-word.ogg', type: 'snd'},
    {id: 'GAME_LOST', src: 'assets/snd/game-lost.ogg', type: 'snd'},
    {id: 'GAME_WON', src: 'assets/snd/game-won.ogg', type: 'snd'},
    {id: 'INVALID_GUESS', src: 'assets/snd/invalid-guess.ogg', type: 'snd'},
    {id: 'INVALID_WORD', src: 'assets/snd/invalid-word.ogg', type: 'snd'},
    {id: 'REMOVE_LETTER', src: 'assets/snd/remove-letter.ogg', type: 'snd'},

];

let audioCtx = null;
let loadingSounds = false;
let onSoundsLoaded = [];
const sounds = {};

function onSoundLoad(callback) {
    if (assets.length === Object.keys(sounds).length) {

        loadingSounds = false;

        callback();

        onSoundsLoaded.forEach(callback => callback());
        onSoundsLoaded.length = 0;
    }
}

function loadSnd(data, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', data.src);
    request.responseType = 'arraybuffer';
    request.onload = () => {
        console.log('loaded', data.src);
        let undecodedAudio = request.response;
        audioCtx.decodeAudioData(undecodedAudio, (sndData) => {
            let entry = {
                audio: sndData
            };
            sounds[data.id] = entry;
            onSoundLoad(callback);
        });
    };
    request.send();
}

function loadSounds(callback) {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    loadingSounds = true;
    assets.forEach(data => loadSnd(data, callback));
}

function playSound(id) {
    if (!sounds[id]) {
        if (loadingSounds) {
            onSoundsLoaded.push(() => playSound(id));
        }
        return;
    }

    var source = audioCtx.createBufferSource();
    source.buffer = sounds[id].audio;
    source.connect(audioCtx.destination);
    source.start(0);
}

export const Sounds = {
    audioCtx,
    load: loadSounds,
    play: playSound,

    sounds,
}

// vim: set ts=4 sw=4 expandtab:

