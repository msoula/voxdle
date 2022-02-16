// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function fallbackCopyTextToClipboard(text) {
    let textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    textArea.remove();
}
function copyTextToClipboard(text, callback) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(callback, callback);
}

function parseJSON(str, defaultValue) {
    let result = defaultValue;
    if (str) {
        try {
            result = JSON.parse(str)
        } catch(e) {
            result = defaultValue;
        }
    }
    return result;
}

function sanitizeWord(word) {
    return word.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export default {
    copyClipboard: copyTextToClipboard,
    epoch: Date.UTC(2022, 0, 31, 0, 0, 0, 0),
    parseJSON,
    sanitizeWord,
}

// vim: set ts=4 sw=4 expandtab:
