import utils from './utils.js';

const byLang = {};

// donwload words list
function loadJson(lang, callback) {
    if (byLang[lang]) return callback(byLang[lang]);

    const data = {src: `assets/words-${lang}.json`, type: 'json'};
    const request = new XMLHttpRequest();
    request.open('GET', data.src);
    request.responseType = 'json';
    request.onload = () => {
        console.log('loaded', data.src);
        let json = request.response;

        let collection = {wordles: [], words: []};
        json.forEach(entry => {
            let item = {
                word:  entry.word,
                clean: utils.sanitizeWord(entry.word)
            };
            collection.words.push(item);
            if (entry.wordle) {
                collection.wordles.push(item);
            }
        });
        byLang[lang] = collection;

        callback(collection);
    };
    request.send();
}

export const Collections = {
    load: (lang, callback) => loadJson(lang, callback),
    byLang: byLang
};

// vim: set ts=4 sw=4 expandtab:
