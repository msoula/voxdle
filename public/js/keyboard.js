
const VALIDITY_CLASSES = ['key-box absent', 'key-box present', 'key-box correct'];

export default class Keyboard {

    constructor(element, listener) {
        this.element    = element;
        this.listener   = listener;
        this.rows       = [];
        this.validities = {};
    }

    init(guesses, evaluations) {
        guesses.forEach((guess, idx) => {
            let evaluation = evaluations[idx];
            for (let pos = 0; pos < guess.length; ++pos) {
                this.onLetterValidity(guess[pos], evaluation[pos]);
            }
        });
    }

    setLayout(accessibility, layout) {
        this.rows.forEach(row => row.remove());

        layout.forEach(letters => {
            let row = document.createElement('div');
            row.classList.add('row');

            letters.forEach(letter => {
                let keyBox = document.createElement('button');
                keyBox.className = 'key-box disable-select';
                if ('CANCEL' === letter) {
                    keyBox.classList.add('control', 'cancel');
                } else if ('CONFIRM' === letter) {
                    keyBox.classList.add('control', 'confirm');
                }

                if (letter) {
                    let key = document.createElement('div');
                    key.ariaHidden = true;
                    key.className = 'key disable-select';
                    if ('CANCEL' === letter) {
                        keyBox.ariaLabel = accessibility.cancel;
                        let span = document.createElement('i');
                        span.className = 'fas fa-backspace';
                        key.appendChild(span);
                        keyBox.onclick = () => this.listener.onLettersSpelled(['CANCEL']);
                    } else if ('CONFIRM' === letter) {
                        keyBox.ariaLabel = accessibility.confirm;
                        let span = document.createElement('i');
                        span.className = 'fas fa-level-down-alt fa-rotate-90';
                        key.appendChild(span);
                        keyBox.onclick = () => this.listener.onLettersSpelled(['CONFIRM']);
                    } else {
                        keyBox.ariaLabel = accessibility.formatAddLetter(letter.toUpperCase());
                        key.textContent = letter.toUpperCase();
                        this.validities[letter] = {element: keyBox, value: -1};
                        keyBox.onclick = () => this.listener.onLettersSpelled([letter]);
                    }
                    keyBox.appendChild(key);
                } else {
                    keyBox.style.visibility = 'hidden';
                }
                row.appendChild(keyBox);
            });

            this.rows.push(row);
            this.element.appendChild(row);
        });
    }

    onLetterValidity(letter, validity = 0) {
        if (!letter) { return; }

        var entry = this.validities[letter];
        if (!entry) return;

        if (entry.value < validity) {
            entry.value = Math.min(2, Math.max(0, validity));
            let keyBox = entry.element;
            keyBox.className = VALIDITY_CLASSES[entry.value];
        }

    }

}

// vim: set ts=4 sw=4 expandtab:
